import os
import sys

if not os.environ.get("DATABASE_URL"):
    raise RuntimeError("Please set the DATABASE_URL environment variable before running this script")
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine
from sqlalchemy import text

print("Seeding parking slots into Aiven database...")

inserts = [
    # Cars: 100 slots
    "INSERT IGNORE INTO parking_slots (slot_code, vehicle_type, slot_type, floor) VALUES ('C-001','car','vip',1),('C-002','car','vip',1),('C-003','car','vip',1),('C-004','car','vip',1),('C-005','car','vip',1),('C-006','car','vip',1),('C-007','car','vip',1),('C-008','car','vip',1),('C-009','car','vip',1),('C-010','car','vip',1)",
    "INSERT IGNORE INTO parking_slots (slot_code, vehicle_type, slot_type, floor) VALUES ('C-011','car','normal',1),('C-012','car','normal',1),('C-013','car','normal',1),('C-014','car','normal',1),('C-015','car','normal',1),('C-016','car','normal',1),('C-017','car','normal',1),('C-018','car','normal',1),('C-019','car','normal',1),('C-020','car','normal',1)",
    "INSERT IGNORE INTO parking_slots (slot_code, vehicle_type, slot_type, floor) VALUES ('C-021','car','normal',1),('C-022','car','normal',1),('C-023','car','normal',1),('C-024','car','normal',1),('C-025','car','normal',1),('C-026','car','normal',1),('C-027','car','normal',1),('C-028','car','normal',1),('C-029','car','normal',1),('C-030','car','normal',1)",
    "INSERT IGNORE INTO parking_slots (slot_code, vehicle_type, slot_type, floor) VALUES ('C-031','car','normal',1),('C-032','car','normal',1),('C-033','car','normal',1),('C-034','car','normal',1),('C-035','car','normal',1),('C-036','car','normal',1),('C-037','car','normal',1),('C-038','car','normal',1),('C-039','car','normal',1),('C-040','car','normal',1)",
    "INSERT IGNORE INTO parking_slots (slot_code, vehicle_type, slot_type, floor) VALUES ('C-041','car','normal',1),('C-042','car','normal',1),('C-043','car','normal',1),('C-044','car','normal',1),('C-045','car','normal',1),('C-046','car','normal',1),('C-047','car','normal',1),('C-048','car','normal',1),('C-049','car','normal',1),('C-050','car','normal',1)",
    "INSERT IGNORE INTO parking_slots (slot_code, vehicle_type, slot_type, floor) VALUES ('C-051','car','normal',2),('C-052','car','normal',2),('C-053','car','normal',2),('C-054','car','normal',2),('C-055','car','normal',2),('C-056','car','normal',2),('C-057','car','normal',2),('C-058','car','normal',2),('C-059','car','normal',2),('C-060','car','normal',2)",
    "INSERT IGNORE INTO parking_slots (slot_code, vehicle_type, slot_type, floor) VALUES ('C-061','car','normal',2),('C-062','car','normal',2),('C-063','car','normal',2),('C-064','car','normal',2),('C-065','car','normal',2),('C-066','car','normal',2),('C-067','car','normal',2),('C-068','car','normal',2),('C-069','car','normal',2),('C-070','car','normal',2)",
    "INSERT IGNORE INTO parking_slots (slot_code, vehicle_type, slot_type, floor) VALUES ('C-071','car','normal',2),('C-072','car','normal',2),('C-073','car','normal',2),('C-074','car','normal',2),('C-075','car','normal',2),('C-076','car','normal',2),('C-077','car','normal',2),('C-078','car','normal',2),('C-079','car','normal',2),('C-080','car','normal',2)",
    "INSERT IGNORE INTO parking_slots (slot_code, vehicle_type, slot_type, floor) VALUES ('C-081','car','normal',2),('C-082','car','normal',2),('C-083','car','normal',2),('C-084','car','normal',2),('C-085','car','normal',2),('C-086','car','normal',2),('C-087','car','normal',2),('C-088','car','normal',2),('C-089','car','normal',2),('C-090','car','normal',2)",
    "INSERT IGNORE INTO parking_slots (slot_code, vehicle_type, slot_type, floor) VALUES ('C-091','car','normal',2),('C-092','car','normal',2),('C-093','car','normal',2),('C-094','car','normal',2),('C-095','car','normal',2),('C-096','car','normal',2),('C-097','car','normal',2),('C-098','car','normal',2),('C-099','car','normal',2),('C-100','car','normal',2)",
    # Bikes: 50 slots
    "INSERT IGNORE INTO parking_slots (slot_code, vehicle_type, slot_type, floor) VALUES ('B-001','bike','vip',1),('B-002','bike','vip',1),('B-003','bike','vip',1),('B-004','bike','vip',1),('B-005','bike','vip',1),('B-006','bike','vip',1),('B-007','bike','vip',1),('B-008','bike','vip',1),('B-009','bike','vip',1),('B-010','bike','vip',1)",
    "INSERT IGNORE INTO parking_slots (slot_code, vehicle_type, slot_type, floor) VALUES ('B-011','bike','normal',1),('B-012','bike','normal',1),('B-013','bike','normal',1),('B-014','bike','normal',1),('B-015','bike','normal',1),('B-016','bike','normal',1),('B-017','bike','normal',1),('B-018','bike','normal',1),('B-019','bike','normal',1),('B-020','bike','normal',1)",
    "INSERT IGNORE INTO parking_slots (slot_code, vehicle_type, slot_type, floor) VALUES ('B-021','bike','normal',1),('B-022','bike','normal',1),('B-023','bike','normal',1),('B-024','bike','normal',1),('B-025','bike','normal',1),('B-026','bike','normal',2),('B-027','bike','normal',2),('B-028','bike','normal',2),('B-029','bike','normal',2),('B-030','bike','normal',2)",
    "INSERT IGNORE INTO parking_slots (slot_code, vehicle_type, slot_type, floor) VALUES ('B-031','bike','normal',2),('B-032','bike','normal',2),('B-033','bike','normal',2),('B-034','bike','normal',2),('B-035','bike','normal',2),('B-036','bike','normal',2),('B-037','bike','normal',2),('B-038','bike','normal',2),('B-039','bike','normal',2),('B-040','bike','normal',2)",
    "INSERT IGNORE INTO parking_slots (slot_code, vehicle_type, slot_type, floor) VALUES ('B-041','bike','normal',3),('B-042','bike','normal',3),('B-043','bike','normal',3),('B-044','bike','normal',3),('B-045','bike','normal',3),('B-046','bike','normal',3),('B-047','bike','normal',3),('B-048','bike','normal',3),('B-049','bike','normal',3),('B-050','bike','normal',3)",
    # Bicycles: 30 slots
    "INSERT IGNORE INTO parking_slots (slot_code, vehicle_type, slot_type, floor) VALUES ('BC-001','bicycle','vip',1),('BC-002','bicycle','vip',1),('BC-003','bicycle','vip',1),('BC-004','bicycle','vip',1),('BC-005','bicycle','vip',1)",
    "INSERT IGNORE INTO parking_slots (slot_code, vehicle_type, slot_type, floor) VALUES ('BC-006','bicycle','normal',1),('BC-007','bicycle','normal',1),('BC-008','bicycle','normal',1),('BC-009','bicycle','normal',1),('BC-010','bicycle','normal',1),('BC-011','bicycle','normal',1),('BC-012','bicycle','normal',1),('BC-013','bicycle','normal',1),('BC-014','bicycle','normal',1),('BC-015','bicycle','normal',1)",
    "INSERT IGNORE INTO parking_slots (slot_code, vehicle_type, slot_type, floor) VALUES ('BC-016','bicycle','normal',1),('BC-017','bicycle','normal',1),('BC-018','bicycle','normal',1),('BC-019','bicycle','normal',1),('BC-020','bicycle','normal',1),('BC-021','bicycle','normal',1),('BC-022','bicycle','normal',1),('BC-023','bicycle','normal',1),('BC-024','bicycle','normal',1),('BC-025','bicycle','normal',1)",
    "INSERT IGNORE INTO parking_slots (slot_code, vehicle_type, slot_type, floor) VALUES ('BC-026','bicycle','normal',1),('BC-027','bicycle','normal',1),('BC-028','bicycle','normal',1),('BC-029','bicycle','normal',1),('BC-030','bicycle','normal',1)",
    # EVs: 40 slots
    "INSERT IGNORE INTO parking_slots (slot_code, vehicle_type, slot_type, floor) VALUES ('E-001','ev','vip',1),('E-002','ev','vip',1),('E-003','ev','vip',1),('E-004','ev','vip',1),('E-005','ev','vip',1),('E-006','ev','vip',1),('E-007','ev','vip',1),('E-008','ev','vip',1),('E-009','ev','vip',1),('E-010','ev','vip',1)",
    "INSERT IGNORE INTO parking_slots (slot_code, vehicle_type, slot_type, floor) VALUES ('E-011','ev','normal',1),('E-012','ev','normal',1),('E-013','ev','normal',1),('E-014','ev','normal',1),('E-015','ev','normal',1),('E-016','ev','normal',1),('E-017','ev','normal',1),('E-018','ev','normal',1),('E-019','ev','normal',1),('E-020','ev','normal',1)",
    "INSERT IGNORE INTO parking_slots (slot_code, vehicle_type, slot_type, floor) VALUES ('E-021','ev','normal',1),('E-022','ev','normal',1),('E-023','ev','normal',1),('E-024','ev','normal',1),('E-025','ev','normal',1),('E-026','ev','normal',1),('E-027','ev','normal',1),('E-028','ev','normal',1),('E-029','ev','normal',1),('E-030','ev','normal',1)",
    "INSERT IGNORE INTO parking_slots (slot_code, vehicle_type, slot_type, floor) VALUES ('E-031','ev','normal',1),('E-032','ev','normal',1),('E-033','ev','normal',1),('E-034','ev','normal',1),('E-035','ev','normal',1),('E-036','ev','normal',1),('E-037','ev','normal',1),('E-038','ev','normal',1),('E-039','ev','normal',1),('E-040','ev','normal',1)",
]

try:
    with engine.begin() as conn:
        for stmt in inserts:
            conn.execute(text(stmt))
    print("SUCCESS: All parking slots seeded!")
except Exception as e:
    print("ERROR seeding:", e)
