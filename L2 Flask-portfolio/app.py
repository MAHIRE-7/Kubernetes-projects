from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
import os
import json
from datetime import datetime

app = Flask(__name__)
app.config['PROJECTS_FOLDER'] = 'projects'
app.secret_key = 'portfolio-secret'

@app.route('/')
def index():
    projects = load_projects()
    return render_template('index.html', projects=projects)

@app.route('/admin')
def admin():
    projects = load_projects()
    return render_template('admin.html', projects=projects)

@app.route('/api/projects', methods=['GET'])
def get_projects():
    return jsonify(load_projects())

@app.route('/api/projects', methods=['POST'])
def add_project():
    data = request.json
    project = {
        'id': str(int(datetime.now().timestamp())),
        'title': data.get('title', ''),
        'description': data.get('description', ''),
        'tech': data.get('tech', ''),
        'github': data.get('github', ''),
        'demo': data.get('demo', ''),
        'date': datetime.now().strftime('%Y-%m-%d')
    }
    
    save_project(project)
    return jsonify(project)

@app.route('/api/projects/<project_id>', methods=['DELETE'])
def delete_project(project_id):
    filepath = os.path.join(app.config['PROJECTS_FOLDER'], f'{project_id}.json')
    if os.path.exists(filepath):
        os.remove(filepath)
        return jsonify({'success': True})
    return jsonify({'error': 'Project not found'}), 404

def load_projects():
    projects = []
    if os.path.exists(app.config['PROJECTS_FOLDER']):
        for filename in os.listdir(app.config['PROJECTS_FOLDER']):
            if filename.endswith('.json'):
                with open(os.path.join(app.config['PROJECTS_FOLDER'], filename), 'r') as f:
                    projects.append(json.load(f))
    return sorted(projects, key=lambda x: x['date'], reverse=True)

def save_project(project):
    os.makedirs(app.config['PROJECTS_FOLDER'], exist_ok=True)
    with open(os.path.join(app.config['PROJECTS_FOLDER'], f"{project['id']}.json"), 'w') as f:
        json.dump(project, f, indent=2)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)