"""
Publications router - CRUD operations for research publications
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Publication
from schemas import PublicationCreate, PublicationResponse

router = APIRouter()


@router.post("/", response_model=PublicationResponse, status_code=201)
def create_publication(publication: PublicationCreate, db: Session = Depends(get_db)):
    """
    Create a new publication
    """
    db_publication = Publication(**publication.model_dump())
    db.add(db_publication)
    db.commit()
    db.refresh(db_publication)
    return db_publication


@router.get("/", response_model=List[PublicationResponse])
def get_publications(researcher_id: int = None, db: Session = Depends(get_db)):
    """
    Get all publications, optionally filtered by researcher
    """
    query = db.query(Publication)
    if researcher_id:
        query = query.filter(Publication.researcher_id == researcher_id)
    return query.all()


@router.get("/{publication_id}", response_model=PublicationResponse)
def get_publication(publication_id: int, db: Session = Depends(get_db)):
    """
    Get a specific publication by ID
    """
    publication = db.query(Publication).filter(Publication.id == publication_id).first()
    if not publication:
        raise HTTPException(status_code=404, detail="Publication not found")
    return publication


@router.put("/{publication_id}", response_model=PublicationResponse)
def update_publication(publication_id: int, publication_update: PublicationCreate, db: Session = Depends(get_db)):
    """
    Update an existing publication
    """
    publication = db.query(Publication).filter(Publication.id == publication_id).first()
    if not publication:
        raise HTTPException(status_code=404, detail="Publication not found")
    
    for key, value in publication_update.model_dump().items():
        setattr(publication, key, value)
    
    db.commit()
    db.refresh(publication)
    return publication


@router.delete("/{publication_id}")
def delete_publication(publication_id: int, db: Session = Depends(get_db)):
    """
    Delete a publication
    """
    publication = db.query(Publication).filter(Publication.id == publication_id).first()
    if not publication:
        raise HTTPException(status_code=404, detail="Publication not found")
    
    db.delete(publication)
    db.commit()
    return {"message": "Publication deleted successfully"}
