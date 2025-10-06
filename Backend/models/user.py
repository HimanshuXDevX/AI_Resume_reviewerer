from beanie import Document
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime

# ---------- Tip Model ----------
class Tip(BaseModel):
    type: str
    tip: str
    explanation: Optional[str] = None

# ---------- Section Model ----------
class Section(BaseModel):
    score: float
    tips: List[Tip]

# ---------- Feedback Model ----------
class Feedback(BaseModel):
    overallScore: float
    ATS: Section
    toneAndStyle: Section
    content: Section
    structure: Section
    skills: Section
    recommendation: Optional[dict] = None 
    
# ---------- User Model ----------
class User(Document):
    clerk_id: str
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    profile_image_url: Optional[str] = None
    roles: List[str] = Field(default_factory=list)
    resume_url: Optional[str] = None
    image_url: Optional[str] = None
    job_title: Optional[str] = None
    job_description: Optional[str] = None
    feedback: Optional[Feedback] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"
