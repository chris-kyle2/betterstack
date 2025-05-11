from pydantic import BaseModel, EmailStr , HttpUrl
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    user_id: str
    email: EmailStr
    plan: Optional[str] = "Free"

class UserOut(UserCreate):
    plan: Optional[str] = "Free"
    created_at: datetime

    class Config:
        orm_mode = True


class EndPointIn(BaseModel):
    url: HttpUrl
    is_active: bool = True

class EndPointOut(EndPointIn):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

