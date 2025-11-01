"""
Meeting requests router - Manage patient-expert meeting requests
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import MeetingRequest, User
from schemas import MeetingRequestCreate, MeetingRequestResponse, MeetingRequestUpdate

router = APIRouter()


@router.post("/", response_model=MeetingRequestResponse, status_code=201)
def create_meeting_request(meeting: MeetingRequestCreate, db: Session = Depends(get_db)):
    """
    Create a new meeting request from patient to expert
    """
    # Verify expert exists and is a researcher
    expert = db.query(User).filter(User.id == meeting.expert_id).first()
    if not expert:
        raise HTTPException(status_code=404, detail="Expert not found")
    
    if expert.role != "researcher":
        raise HTTPException(status_code=400, detail="Can only request meetings with researchers")
    
    # Check if expert is available for meetings
    if not expert.meeting_availability:
        raise HTTPException(status_code=400, detail="This expert is not available for meetings")
    
    db_meeting = MeetingRequest(**meeting.model_dump())
    db.add(db_meeting)
    db.commit()
    db.refresh(db_meeting)
    return db_meeting


@router.get("/", response_model=List[MeetingRequestResponse])
def get_meeting_requests(user_id: int = None, status: str = None, db: Session = Depends(get_db)):
    """
    Get meeting requests, optionally filtered by user and status
    """
    query = db.query(MeetingRequest)
    
    if user_id:
        query = query.filter(
            (MeetingRequest.requester_id == user_id) | (MeetingRequest.expert_id == user_id)
        )
    
    if status:
        query = query.filter(MeetingRequest.status == status)
    
    return query.all()


@router.get("/sent/{user_id}", response_model=List[MeetingRequestResponse])
def get_sent_meetings(user_id: int, db: Session = Depends(get_db)):
    """
    Get all meeting requests sent by a user (patient)
    """
    return db.query(MeetingRequest).filter(MeetingRequest.requester_id == user_id).all()


@router.get("/received/{user_id}", response_model=List[MeetingRequestResponse])
def get_received_meetings(user_id: int, db: Session = Depends(get_db)):
    """
    Get all meeting requests received by a user (expert)
    """
    return db.query(MeetingRequest).filter(MeetingRequest.expert_id == user_id).all()


@router.put("/{meeting_id}", response_model=MeetingRequestResponse)
def update_meeting_request(meeting_id: int, update: MeetingRequestUpdate, db: Session = Depends(get_db)):
    """
    Update meeting request status (accept or reject)
    """
    meeting = db.query(MeetingRequest).filter(MeetingRequest.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting request not found")
    
    meeting.status = update.status
    db.commit()
    db.refresh(meeting)
    return meeting


@router.delete("/{meeting_id}")
def delete_meeting_request(meeting_id: int, db: Session = Depends(get_db)):
    """
    Delete a meeting request
    """
    meeting = db.query(MeetingRequest).filter(MeetingRequest.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting request not found")
    
    db.delete(meeting)
    db.commit()
    return {"message": "Meeting request deleted successfully"}
