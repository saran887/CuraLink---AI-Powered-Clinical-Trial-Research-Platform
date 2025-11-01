"""
Main FastAPI application for CuraLink
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import users, trials, publications, forum, ai, connections, meetings, external_apis

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="CuraLink API",
    description="Connect patients and researchers to clinical trials, publications, and health experts",
    version="2.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://cura-link-ai-powered-clinical-trial-iota.vercel.app",
        "https://*.vercel.app"  # Allow all Vercel preview deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(trials.router, prefix="/api/trials", tags=["Trials"])
app.include_router(publications.router, prefix="/api/publications", tags=["Publications"])
app.include_router(forum.router, prefix="/api/forum", tags=["Forum"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI"])
app.include_router(connections.router, prefix="/api/connections", tags=["Connections"])
app.include_router(meetings.router, prefix="/api/meetings", tags=["Meeting Requests"])
app.include_router(external_apis.router, prefix="/api/external", tags=["External APIs"])


@app.get("/")
def read_root():
    """
    Root endpoint - health check
    """
    return {
        "message": "Welcome to CuraLink API",
        "status": "active",
        "version": "1.0.0"
    }


@app.get("/health")
def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy"}
