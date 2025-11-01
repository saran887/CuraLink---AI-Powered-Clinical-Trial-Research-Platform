"""
Connections router - Manage collaborator connections and expert follows
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Connection, User
from schemas import ConnectionCreate, ConnectionResponse, ConnectionUpdate

router = APIRouter()


@router.post("/", response_model=ConnectionResponse, status_code=201)
def create_connection(connection: ConnectionCreate, db: Session = Depends(get_db)):
    """
    Create a new connection request (follow or collaborate)
    """
    # Check if connection already exists
    existing = db.query(Connection).filter(
        Connection.requester_id == connection.requester_id,
        Connection.receiver_id == connection.receiver_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Connection already exists")
    
    db_connection = Connection(**connection.model_dump())
    db.add(db_connection)
    db.commit()
    db.refresh(db_connection)
    return db_connection


@router.get("/", response_model=List[ConnectionResponse])
def get_connections(user_id: int = None, status: str = None, db: Session = Depends(get_db)):
    """
    Get connections, optionally filtered by user and status
    """
    query = db.query(Connection)
    
    if user_id:
        query = query.filter(
            (Connection.requester_id == user_id) | (Connection.receiver_id == user_id)
        )
    
    if status:
        query = query.filter(Connection.status == status)
    
    return query.all()


@router.get("/sent/{user_id}", response_model=List[ConnectionResponse])
def get_sent_connections(user_id: int, db: Session = Depends(get_db)):
    """
    Get all connection requests sent by a user
    """
    return db.query(Connection).filter(Connection.requester_id == user_id).all()


@router.get("/received/{user_id}", response_model=List[ConnectionResponse])
def get_received_connections(user_id: int, db: Session = Depends(get_db)):
    """
    Get all connection requests received by a user
    """
    return db.query(Connection).filter(Connection.receiver_id == user_id).all()


@router.put("/{connection_id}", response_model=ConnectionResponse)
def update_connection(connection_id: int, update: ConnectionUpdate, db: Session = Depends(get_db)):
    """
    Update connection status (accept or reject)
    """
    connection = db.query(Connection).filter(Connection.id == connection_id).first()
    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    connection.status = update.status
    db.commit()
    db.refresh(connection)
    return connection


@router.delete("/{connection_id}")
def delete_connection(connection_id: int, db: Session = Depends(get_db)):
    """
    Delete a connection
    """
    connection = db.query(Connection).filter(Connection.id == connection_id).first()
    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    db.delete(connection)
    db.commit()
    return {"message": "Connection deleted successfully"}


@router.get("/collaborators/{user_id}", response_model=List[dict])
def get_collaborators(user_id: int, specialty: str = None, db: Session = Depends(get_db)):
    """
    Get potential collaborators (researchers) for a user
    """
    query = db.query(User).filter(User.role == "researcher", User.id != user_id)
    
    if specialty:
        query = query.filter(User.specialties.ilike(f"%{specialty}%"))
    
    collaborators = query.all()
    
    # Format response with connection status
    result = []
    for collab in collaborators:
        connection = db.query(Connection).filter(
            ((Connection.requester_id == user_id) & (Connection.receiver_id == collab.id)) |
            ((Connection.requester_id == collab.id) & (Connection.receiver_id == user_id))
        ).first()
        
        result.append({
            "id": collab.id,
            "name": collab.name,
            "specialties": collab.specialties,
            "research_interests": collab.research_interests,
            "bio": collab.bio,
            "connection_status": connection.status if connection else None
        })
    
    return result


@router.get("/experts", response_model=List[dict])
def get_health_experts(condition: str = None, location: str = None, db: Session = Depends(get_db)):
    """
    Get health experts for patients to follow
    """
    query = db.query(User).filter(User.role == "researcher")
    
    if condition:
        query = query.filter(
            (User.specialties.ilike(f"%{condition}%")) |
            (User.research_interests.ilike(f"%{condition}%"))
        )
    
    if location:
        query = query.filter(User.location.ilike(f"%{location}%"))
    
    experts = query.all()
    
    return [{
        "id": expert.id,
        "name": expert.name,
        "specialties": expert.specialties,
        "research_interests": expert.research_interests,
        "bio": expert.bio,
        "location": expert.location,
        "meeting_availability": expert.meeting_availability
    } for expert in experts]
