from flask import Flask, render_template, request, redirect
import redis
import json
import uuid

app = Flask(__name__)
r = redis.Redis(host='redis', port=6379, decode_responses=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/vote', methods=['POST'])
def vote():
    vote_id = str(uuid.uuid4())
    vote_data = {
        'vote_id': vote_id,
        'vote': request.form['vote']
    }
    r.rpush('votes', json.dumps(vote_data))
    return redirect('/')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)