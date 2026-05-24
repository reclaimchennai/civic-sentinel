import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("POSTGRES_HOST", "db"), # 'db' is the service name in docker-compose
        database=os.getenv("POSTGRES_DB", "chennai_sentinel"),
        user=os.getenv("POSTGRES_USER", "postgres"),
        password=os.getenv("POSTGRES_PASSWORD", "postgres")
    )

def save_violation_report(image_path, lat, lng, timestamp, violation_type_id, area, ward, zone_number, zone_name, user_id=None):
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        query = """
        INSERT INTO reports (image_url, lat, lng, created_at, sub_category_id, area, ward, zone_number, zone_name, status, user_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'pending', %s)
        RETURNING id;
        """
        cur.execute(query, (image_path, lat, lng, timestamp, violation_type_id, area, ward, zone_number, zone_name, user_id))
        report_id = cur.fetchone()[0]
        conn.commit()
        return report_id
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cur.close()
        conn.close()
