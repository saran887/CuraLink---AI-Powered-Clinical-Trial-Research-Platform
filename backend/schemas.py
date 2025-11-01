"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ============ User Schemas ============
class UserBase(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    role: str  # "patient" or "researcher"
    
    # Patient fields
    condition: Optional[str] = None
    symptoms: Optional[str] = None
    
    # Location fields
    location: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    
    # Researcher fields
    specialties: Optional[str] = None
    research_interests: Optional[str] = None
    orcid: Optional[str] = None
    researchgate_url: Optional[str] = None
    bio: Optional[str] = None
    meeting_availability: Optional[bool] = False


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    condition: Optional[str] = None
    symptoms: Optional[str] = None
    location: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    specialties: Optional[str] = None
    research_interests: Optional[str] = None
    orcid: Optional[str] = None
    researchgate_url: Optional[str] = None
    bio: Optional[str] = None
    meeting_availability: Optional[bool] = None


class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============ Trial Schemas ============
class TrialBase(BaseModel):
    title: str
    condition: str
    phase: str
    location: str
    description: Optional[str] = None


class TrialCreate(TrialBase):
    researcher_id: int


class TrialResponse(TrialBase):
    id: int
    researcher_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============ Publication Schemas ============
class PublicationBase(BaseModel):
    title: str
    summary: str


class PublicationCreate(PublicationBase):
    researcher_id: int


class PublicationResponse(PublicationBase):
    id: int
    researcher_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============ Forum Post Schemas ============
class ForumPostBase(BaseModel):
    content: str
    title: Optional[str] = None
    category: Optional[str] = None
    is_question: Optional[bool] = False
    parent_id: Optional[int] = None


class ForumPostCreate(ForumPostBase):
    author_id: int


class ForumPostResponse(ForumPostBase):
    id: int
    author_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============ Favorite Schemas ============
class FavoriteBase(BaseModel):
    item_type: str  # "trial", "publication", "expert", "collaborator"
    item_id: int


class FavoriteCreate(FavoriteBase):
    user_id: int


class FavoriteResponse(FavoriteBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============ Connection Schemas ============
class ConnectionBase(BaseModel):
    receiver_id: int
    connection_type: str  # "follow" or "collaborate"


class ConnectionCreate(ConnectionBase):
    requester_id: int


class ConnectionUpdate(BaseModel):
    status: str  # "accepted" or "rejected"


class ConnectionResponse(ConnectionBase):
    id: int
    requester_id: int
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ============ Meeting Request Schemas ============
class MeetingRequestBase(BaseModel):
    expert_id: int
    message: Optional[str] = None
    contact_info: Optional[str] = None


class MeetingRequestCreate(MeetingRequestBase):
    requester_id: int


class MeetingRequestUpdate(BaseModel):
    status: str  # "accepted" or "rejected"


class MeetingRequestResponse(MeetingRequestBase):
    id: int
    requester_id: int
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ============ External Publication Schemas ============
class ExternalPublicationResponse(BaseModel):
    id: int
    external_id: str
    source: str
    title: str
    authors: Optional[str] = None
    abstract: Optional[str] = None
    journal: Optional[str] = None
    publication_date: Optional[str] = None
    url: Optional[str] = None
    ai_summary: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============ External Trial Schemas ============
class ExternalTrialResponse(BaseModel):
    id: int
    nct_id: str
    title: str
    condition: Optional[str] = None
    phase: Optional[str] = None
    status: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    eligibility: Optional[str] = None
    contact_email: Optional[str] = None
    url: Optional[str] = None
    ai_summary: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============ AI Schemas ============
class SummarizeRequest(BaseModel):
    text: str


class SummarizeResponse(BaseModel):
    summary: str
