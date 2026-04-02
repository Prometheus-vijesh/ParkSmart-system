from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserCreate, UserLogin, UserOut, Token
from app.services.auth_service import register_user, login_user

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/register", response_model=UserOut, status_code=201)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    return register_user(db, payload)

@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    token, user = login_user(db, payload.email, payload.password)
    return {"access_token": token, "token_type": "bearer", "user": user}
