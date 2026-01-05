from flask import Flask, render_template, request, jsonify
from datetime import datetime

app = Flask(__name__)

posts = [
    {"id": 1, "title": "Welcome to Flask Blog", "content": "This is your first blog post on Kubernetes!", "date": "2024-01-01"},
    {"id": 2, "title": "Kubernetes Deployment", "content": "Learn how to deploy Flask apps on K8s cluster.", "date": "2024-01-02"}
]

@app.route('/')
def index():
    return render_template('index.html', posts=posts)

@app.route('/api/posts', methods=['GET'])
def get_posts():
    return jsonify(posts)

@app.route('/api/posts', methods=['POST'])
def add_post():
    data = request.json
    new_post = {
        "id": len(posts) + 1,
        "title": data['title'],
        "content": data['content'],
        "date": datetime.now().strftime('%Y-%m-%d')
    }
    posts.append(new_post)
    return jsonify(new_post)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)