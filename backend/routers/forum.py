"""
Forum router - Create and read forum posts with categories and replies
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import ForumPost, User
from schemas import ForumPostCreate, ForumPostResponse

router = APIRouter()


@router.post("/", response_model=ForumPostResponse, status_code=201)
def create_post(post: ForumPostCreate, db: Session = Depends(get_db)):
    """
    Create a new forum post or reply
    """
    # Verify author exists
    author = db.query(User).filter(User.id == post.author_id).first()
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")
    
    # If it's a reply, verify parent post exists
    if post.parent_id:
        parent = db.query(ForumPost).filter(ForumPost.id == post.parent_id).first()
        if not parent:
            raise HTTPException(status_code=404, detail="Parent post not found")
        
        # Check restrictions: Only researchers can reply to patient questions
        if parent.is_question and author.role != "researcher":
            raise HTTPException(status_code=403, detail="Only researchers can reply to patient questions")
    
    db_post = ForumPost(**post.model_dump())
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post


@router.get("/", response_model=List[ForumPostResponse])
def get_posts(
    author_id: int = None, 
    category: str = None, 
    is_question: bool = None,
    parent_id: int = None,
    db: Session = Depends(get_db)
):
    """
    Get all forum posts with optional filters
    """
    query = db.query(ForumPost)
    
    if author_id:
        query = query.filter(ForumPost.author_id == author_id)
    
    if category:
        query = query.filter(ForumPost.category == category)
    
    if is_question is not None:
        query = query.filter(ForumPost.is_question == is_question)
    
    # If parent_id is provided, get replies to that post
    # If parent_id is None and not specified, get only top-level posts
    if parent_id is not None:
        query = query.filter(ForumPost.parent_id == parent_id)
    elif parent_id is None and 'parent_id' not in locals():
        query = query.filter(ForumPost.parent_id == None)
    
    return query.order_by(ForumPost.created_at.desc()).all()


@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    """
    Get all unique forum categories
    """
    categories = db.query(ForumPost.category).distinct().all()
    return [cat[0] for cat in categories if cat[0]]


@router.get("/{post_id}", response_model=ForumPostResponse)
def get_post(post_id: int, db: Session = Depends(get_db)):
    """
    Get a specific forum post by ID
    """
    post = db.query(ForumPost).filter(ForumPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.get("/{post_id}/replies", response_model=List[ForumPostResponse])
def get_post_replies(post_id: int, db: Session = Depends(get_db)):
    """
    Get all replies to a specific post
    """
    post = db.query(ForumPost).filter(ForumPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    replies = db.query(ForumPost).filter(ForumPost.parent_id == post_id).order_by(ForumPost.created_at.asc()).all()
    return replies


@router.delete("/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db)):
    """
    Delete a forum post
    """
    post = db.query(ForumPost).filter(ForumPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Delete all replies first
    db.query(ForumPost).filter(ForumPost.parent_id == post_id).delete()
    
    db.delete(post)
    db.commit()
    return {"message": "Post deleted successfully"}
