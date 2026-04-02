import os
import sys

# Force the cloud database URL (no ssl-mode param - pymysql doesn't support it)
# Read DATABASE_URL from environment (set it in your shell before running this script)
if not os.environ.get("DATABASE_URL"):
    raise RuntimeError("Please set the DATABASE_URL environment variable before running this script")

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, Base

# Import all models so SQLAlchemy knows about them
from app.models import user, booking, vehicle, parking_slot, pricing, coupon, transaction

print("Connecting to Aiven Cloud Database...")

try:
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("SUCCESS: All tables created!")
except Exception as e:
    print("ERROR creating tables:", e)
    sys.exit(1)

# Seed parking slots
try:
    from sqlalchemy import text
    seed_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'seed_slots.sql')
    with engine.begin() as conn:
        with open(seed_path, "r") as f:
            sql_script = f.read()
            for statement in sql_script.split(';'):
                if statement.strip():
                    conn.execute(text(statement.strip()))
    print("SUCCESS: Parking slots seeded!")
except Exception as e:
    print("Note on seeding:", e)
