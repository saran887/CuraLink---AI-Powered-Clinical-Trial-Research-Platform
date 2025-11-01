"""
User router - signup and login operations
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User
from schemas import UserCreate, UserResponse, UserUpdate

router = APIRouter()


@router.post("/signup", response_model=UserResponse, status_code=201)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user (patient or researcher)
    """
    # Check if email already exists
    if user.email:
        existing = db.query(User).filter(User.email == user.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    db_user = User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """
    Get user by ID
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/", response_model=List[UserResponse])
def get_all_users(role: str = None, db: Session = Depends(get_db)):
    """
    Get all users, optionally filtered by role
    """
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    return query.all()


@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    """
    Update user profile
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update only provided fields
    update_data = user_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)
    
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=UserResponse)
def login(email: str = None, name: str = None, db: Session = Depends(get_db)):
    """
    Simple login by email or name (for MVP - no password required)
    """
    if email:
        user = db.query(User).filter(User.email == email).first()
    elif name:
        user = db.query(User).filter(User.name == name).first()
    else:
        raise HTTPException(status_code=400, detail="Email or name required")
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
