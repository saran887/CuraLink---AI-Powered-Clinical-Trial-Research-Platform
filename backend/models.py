"""
SQLAlchemy ORM models for CuraLink
"""
from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, Boolean, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class User(Base):
    """
    User model for both patients and researchers
    """
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=True)
    role = Column(String, nullable=False)  # "patient" or "researcher"
    
    # Patient-specific fields
    condition = Column(String, nullable=True)  # For patients
    symptoms = Column(Text, nullable=True)  # Natural language symptoms
    
    # Location fields
    location = Column(String, nullable=True)
    city = Column(String, nullable=True)
    country = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    # Researcher-specific fields
    specialties = Column(Text, nullable=True)  # Comma-separated or JSON
    research_interests = Column(Text, nullable=True)  # Comma-separated or JSON
    orcid = Column(String, nullable=True)
    researchgate_url = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    meeting_availability = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    trials = relationship("Trial", back_populates="researcher")
    publications = relationship("Publication", back_populates="researcher")
    forum_posts = relationship("ForumPost", back_populates="author")
    favorites = relationship("Favorite", back_populates="user")
    sent_connections = relationship("Connection", foreign_keys="Connection.requester_id", back_populates="requester")
    received_connections = relationship("Connection", foreign_keys="Connection.receiver_id", back_populates="receiver")
    sent_meetings = relationship("MeetingRequest", foreign_keys="MeetingRequest.requester_id", back_populates="requester")
    received_meetings = relationship("MeetingRequest", foreign_keys="MeetingRequest.expert_id", back_populates="expert")


class Trial(Base):
    """
    Clinical trial model
    """
    __tablename__ = "trials"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    condition = Column(String, nullable=False)
    phase = Column(String, nullable=False)  # Phase I, II, III, IV
    location = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    researcher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    researcher = relationship("User", back_populates="trials")


class Publication(Base):
    """
    Research publication model
    """
    __tablename__ = "publications"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    summary = Column(Text, nullable=False)
    researcher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    researcher = relationship("User", back_populates="publications")


class ForumPost(Base):
    """
    Forum post model for community discussions
    """
    __tablename__ = "forum_posts"
    
    id = Column(Integer, primary_key=True, index=True)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    title = Column(String, nullable=True)
    category = Column(String, nullable=True)  # e.g., "Cancer Research", "Clinical Trials"
    is_question = Column(Boolean, default=False)  # True if posted by patient
    parent_id = Column(Integer, ForeignKey("forum_posts.id"), nullable=True)  # For replies
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    author = relationship("User", back_populates="forum_posts")
    replies = relationship("ForumPost", remote_side=[parent_id])


class Favorite(Base):
    """
    Favorite/bookmark model for users to save items
    """
    __tablename__ = "favorites"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    item_type = Column(String, nullable=False)  # "trial", "publication", "expert", "collaborator"
    item_id = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="favorites")


class Connection(Base):
    """
    Connection/Follow model for researcher collaborations and patient-expert follows
    """
    __tablename__ = "connections"
    
    id = Column(Integer, primary_key=True, index=True)
    requester_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String, default="pending")  # "pending", "accepted", "rejected"
    connection_type = Column(String, nullable=False)  # "follow" or "collaborate"
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    requester = relationship("User", foreign_keys=[requester_id], back_populates="sent_connections")
    receiver = relationship("User", foreign_keys=[receiver_id], back_populates="received_connections")


class MeetingRequest(Base):
    """
    Meeting request model for patients to request meetings with experts
    """
    __tablename__ = "meeting_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    requester_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Patient
    expert_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Researcher/Expert
    message = Column(Text, nullable=True)
    contact_info = Column(String, nullable=True)
    status = Column(String, default="pending")  # "pending", "accepted", "rejected"
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    requester = relationship("User", foreign_keys=[requester_id], back_populates="sent_meetings")
    expert = relationship("User", foreign_keys=[expert_id], back_populates="received_meetings")


class ExternalPublication(Base):
    """
    Model to cache external publications from PubMed, etc.
    """
    __tablename__ = "external_publications"
    
    id = Column(Integer, primary_key=True, index=True)
    external_id = Column(String, unique=True, nullable=False)  # PubMed ID, DOI, etc.
    source = Column(String, nullable=False)  # "pubmed", "google_scholar", etc.
    title = Column(String, nullable=False)
    authors = Column(Text, nullable=True)
    abstract = Column(Text, nullable=True)
    journal = Column(String, nullable=True)
    publication_date = Column(String, nullable=True)
    url = Column(String, nullable=True)
    ai_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class ExternalTrial(Base):
    """
    Model to cache external clinical trials from ClinicalTrials.gov
    """
    __tablename__ = "external_trials"
    
    id = Column(Integer, primary_key=True, index=True)
    nct_id = Column(String, unique=True, nullable=False)  # NCT number
    title = Column(String, nullable=False)
    condition = Column(String, nullable=True)
    phase = Column(String, nullable=True)
    status = Column(String, nullable=True)  # "Recruiting", "Completed", etc.
    location = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    eligibility = Column(Text, nullable=True)
    contact_email = Column(String, nullable=True)
    url = Column(String, nullable=True)
    ai_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
