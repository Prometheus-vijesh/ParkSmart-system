from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "mysql+pymysql://root:123456789@localhost:3306/parking_db"
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    # Comma-separated list of allowed origins for CORS
    # In production, set this to your Vercel frontend URL
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    model_config = {"env_file": ".env"}

settings = Settings()
