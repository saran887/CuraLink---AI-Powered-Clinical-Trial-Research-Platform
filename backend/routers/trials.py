"""
Trials router - CRUD operations for clinical trials
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Trial
from schemas import TrialCreate, TrialResponse

router = APIRouter()


@router.post("/", response_model=TrialResponse, status_code=201)
def create_trial(trial: TrialCreate, db: Session = Depends(get_db)):
    """
    Create a new clinical trial
    """
    db_trial = Trial(**trial.model_dump())
    db.add(db_trial)
    db.commit()
    db.refresh(db_trial)
    return db_trial


@router.get("/", response_model=List[TrialResponse])
def get_trials(condition: str = None, location: str = None, db: Session = Depends(get_db)):
    """
    Get all trials with optional filters
    """
    query = db.query(Trial)
    if condition:
        query = query.filter(Trial.condition.ilike(f"%{condition}%"))
    if location:
        query = query.filter(Trial.location.ilike(f"%{location}%"))
    return query.all()


@router.get("/{trial_id}", response_model=TrialResponse)
def get_trial(trial_id: int, db: Session = Depends(get_db)):
    """
    Get a specific trial by ID
    """
    trial = db.query(Trial).filter(Trial.id == trial_id).first()
    if not trial:
        raise HTTPException(status_code=404, detail="Trial not found")
    return trial


@router.put("/{trial_id}", response_model=TrialResponse)
def update_trial(trial_id: int, trial_update: TrialCreate, db: Session = Depends(get_db)):
    """
    Update an existing trial
    """
    trial = db.query(Trial).filter(Trial.id == trial_id).first()
    if not trial:
        raise HTTPException(status_code=404, detail="Trial not found")
    
    for key, value in trial_update.model_dump().items():
        setattr(trial, key, value)
    
    db.commit()
    db.refresh(trial)
    return trial


@router.delete("/{trial_id}")
def delete_trial(trial_id: int, db: Session = Depends(get_db)):
    """
    Delete a trial
    """
    trial = db.query(Trial).filter(Trial.id == trial_id).first()
    if not trial:
        raise HTTPException(status_code=404, detail="Trial not found")
    
    db.delete(trial)
    db.commit()
    return {"message": "Trial deleted successfully"}
