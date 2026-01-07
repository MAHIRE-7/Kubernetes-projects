from flask import Flask, render_template, request, redirect, url_for, flash
import os
from datetime import datetime

app = Flask(__name__)
app.config['NOTES_FOLDER'] = 'notes'
app.secret_key = 'notes-secret'

@app.route('/')
def index():
    notes = []
    if os.path.exists(app.config['NOTES_FOLDER']):
        for filename in os.listdir(app.config['NOTES_FOLDER']):
            if filename.endswith('.txt'):
                filepath = os.path.join(app.config['NOTES_FOLDER'], filename)
                with open(filepath, 'r') as f:
                    content = f.read()
                notes.append({
                    'id': filename[:-4],
                    'title': filename[:-4].replace('_', ' '),
                    'content': content,
                    'date': datetime.fromtimestamp(os.path.getmtime(filepath)).strftime('%Y-%m-%d %H:%M')
                })
    return render_template('index.html', notes=notes)

@app.route('/create', methods=['POST'])
def create_note():
    title = request.form.get('title', '').strip()
    content = request.form.get('content', '').strip()
    
    if not title or not content:
        flash('Title and content are required')
        return redirect(url_for('index'))
    
    filename = title.replace(' ', '_') + '.txt'
    os.makedirs(app.config['NOTES_FOLDER'], exist_ok=True)
    
    with open(os.path.join(app.config['NOTES_FOLDER'], filename), 'w') as f:
        f.write(content)
    
    flash(f'Note "{title}" created successfully')
    return redirect(url_for('index'))

@app.route('/delete/<note_id>')
def delete_note(note_id):
    filepath = os.path.join(app.config['NOTES_FOLDER'], note_id + '.txt')
    if os.path.exists(filepath):
        os.remove(filepath)
        flash(f'Note deleted successfully')
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)