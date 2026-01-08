import os
import tweepy
import psycopg2
from dotenv import load_dotenv

load_dotenv()

# DB Connection
def get_db_connection():
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        database=os.getenv("DB_NAME", "chennai_sentinel"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASS", "postgres")
    )
    return conn

# Twitter Auth (Placeholders)
def get_twitter_client():
    # In a real scenario, these would be in .env
    consumer_key = os.getenv("TWITTER_CONSUMER_KEY")
    consumer_secret = os.getenv("TWITTER_CONSUMER_SECRET")
    access_token = os.getenv("TWITTER_ACCESS_TOKEN")
    access_token_secret = os.getenv("TWITTER_ACCESS_TOKEN_SECRET")
    
    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    return tweepy.API(auth)

def process_report(report_id):
    conn = get_db_connection()
    cur = conn.cursor()
    
    query = """
    SELECT r.id, r.image_url, r.description, z.name as zone_name, c.name as cat_name, sc.name as sub_cat_name
    FROM reports r
    JOIN zones z ON r.zone_id = z.id
    JOIN complaint_sub_categories sc ON r.sub_category_id = sc.id
    JOIN complaint_categories c ON sc.category_id = c.id
    WHERE r.id = %s
    """
    cur.execute(query, (report_id,))
    report = cur.fetchone()
    
    if not report:
        print(f"Report {report_id} not found.")
        return

    report_id, image_url, description, zone_name, cat_name, sub_cat_name = report
    
    # Smart Routing
    handle = "@chennaicorp"
    if cat_name == "Traffic Violations":
        handle = "@ChennaiTraffic"
    elif cat_name == "Water & Drainage":
        handle = "@chnmetrowater"
    elif cat_name == "Street Light":
        # Note: TANGEDCO usually handles street lights in many areas but sometimes it's corp
        handle = "@TANGEDCO_Offcl"
    
    # Hashtag
    hashtag = "#" + zone_name.replace(" ", "")
    
    tweet_text = f"New Report: {sub_cat_name} in {zone_name} {hashtag}\n\n{description or ''}\n\nCC: {handle}"
    
    print(f"Would post to Twitter:\n{tweet_text}")
    # In production, you'd use api.update_status_with_media or similar
    
    cur.close()
    conn.close()

if __name__ == "__main__":
    # This would be triggered by a job queue (Redis)
    import sys
    if len(sys.argv) > 1:
        process_report(sys.argv[1])
