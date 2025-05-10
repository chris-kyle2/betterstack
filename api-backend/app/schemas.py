from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    user_id: str
    email: EmailStr
    plan: Optional[str] = "Free"

class UserOut(UserCreate):
    plan: str
    created_at: datetime

    class Config:
        orm_mode = True
