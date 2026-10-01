from datetime import datetime, timedelta

import bcrypt
from fastapi import APIRouter, Depends, Header, HTTPException
from jose import jwt
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from app.config import settings
from app.db.postgresql import get_db
from app.models.user import User

router = APIRouter()


class AuthPayload(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: str = Field(default="", max_length=255)


class ProfileUpdate(BaseModel):
    full_name: str = Field(min_length=1, max_length=255)


def get_current_user(authorization: str | None = Header(default=None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    try:
        token_data = jwt.decode(
            authorization.removeprefix("Bearer ").strip(),
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        email = token_data.get("sub")
    except Exception as error:
        raise HTTPException(status_code=401, detail="Invalid or expired token") from error

    user = db.query(User).filter(User.email == email, User.is_active.is_(True)).first()
    if not isinstance(user, User):
        raise HTTPException(status_code=401, detail="User not found")
    return user


def serialize_user(user: User):
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "theme": user.theme,
        "language": user.language,
    }


@router.post("/signup")
def signup(payload: AuthPayload, db: Session = Depends(get_db)):
    email = payload.email.lower()
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=409, detail="An account with this email already exists")

    hashed_password = bcrypt.hashpw(payload.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    full_name = payload.full_name.strip()
    if not full_name:
        raise HTTPException(status_code=422, detail="Full name is required")
    user = User(email=email, full_name=full_name, hashed_password=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "User created", "user": serialize_user(user)}


@router.post("/login")
def login(payload: AuthPayload, db: Session = Depends(get_db)):
    email = payload.email.lower()
    user = db.query(User).filter(User.email == email).first()
    if not isinstance(user, User):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    hashed_password = user.hashed_password
    if not isinstance(hashed_password, str) or not bcrypt.checkpw(
        payload.password.encode("utf-8"), hashed_password.encode("utf-8")
    ):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = jwt.encode(
        {"sub": email, "exp": datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)},
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )
    return {"access_token": token, "token_type": "bearer", "user": serialize_user(user)}


@router.get("/me")
def get_me(user: User = Depends(get_current_user)):
    return serialize_user(user)


@router.patch("/me")
def update_me(payload: ProfileUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(User).filter(User.id == user.id).update({"full_name": payload.full_name.strip()})
    db.commit()
    updated_user = db.query(User).filter(User.id == user.id).first()
    if not isinstance(updated_user, User):
        raise HTTPException(status_code=404, detail="User not found")
    return serialize_user(updated_user)