import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth, vehicles, bookings, parking, analytics, admin

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Parking Management System API",
    description="Full-stack parking management system — secure, modular, production-ready.",
    version="2.0.0",
)

origins = settings.ALLOWED_ORIGINS.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(vehicles.router)
app.include_router(bookings.router)
app.include_router(parking.router)
app.include_router(analytics.router)
app.include_router(admin.router)

@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "Parking Management System API v2.0"}

@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}
