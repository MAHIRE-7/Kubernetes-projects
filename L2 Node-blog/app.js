const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_DIR = '/app/data';

app.use(express.json());
app.use(express.static('views'));

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Get all posts
app.get('/api/posts', (req, res) => {
    try {
        const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
        const posts = files.map(file => {
            const data = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
            return JSON.parse(data);
        }).sort((a, b) => new Date(b.date) - new Date(a.date));
        res.json(posts);
    } catch (error) {
        res.json([]);
    }
});

// Create new post
app.post('/api/posts', (req, res) => {
    const { title, content } = req.body;
    const post = {
        id: Date.now().toString(),
        title,
        content,
        date: new Date().toISOString()
    };
    
    fs.writeFileSync(path.join(DATA_DIR, `${post.id}.json`), JSON.stringify(post, null, 2));
    res.json(post);
});

// Delete post
app.delete('/api/posts/:id', (req, res) => {
    const filePath = path.join(DATA_DIR, `${req.params.id}.json`);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Post not found' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Blog server running on port ${PORT}`);
});