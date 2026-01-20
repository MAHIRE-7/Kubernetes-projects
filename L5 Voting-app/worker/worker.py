import redis
import psycopg2
import json
import time

# Connect to Redis
r = redis.Redis(host='redis', port=6379, decode_responses=True)

# Connect to PostgreSQL
def get_db_connection():
    return psycopg2.connect(
        host='postgres',
        database='votes',
        user='postgres',
        password='password'
    )

# Initialize database
def init_db():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('''
        CREATE TABLE IF NOT EXISTS votes (
            id SERIAL PRIMARY KEY,
            vote_id VARCHAR(50) UNIQUE,
            vote VARCHAR(10),
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    cur.close()
    conn.close()

def process_votes():
    while True:
        try:
            # Get vote from Redis queue
            vote_data = r.blpop('votes', timeout=1)
            if vote_data:
                vote_json = json.loads(vote_data[1])
                
                # Store in PostgreSQL
                conn = get_db_connection()
                cur = conn.cursor()
                cur.execute(
                    'INSERT INTO votes (vote_id, vote) VALUES (%s, %s) ON CONFLICT (vote_id) DO NOTHING',
                    (vote_json['vote_id'], vote_json['vote'])
                )
                conn.commit()
                cur.close()
                conn.close()
                print(f"Processed vote: {vote_json['vote']}")
        except Exception as e:
            print(f"Error: {e}")
            time.sleep(1)

if __name__ == '__main__':
    print("Starting worker...")
    init_db()
    process_votes()