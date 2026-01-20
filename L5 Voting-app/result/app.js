const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(express.static('public'));

const pool = new Pool({
    host: 'postgres',
    database: 'votes',
    user: 'postgres',
    password: 'password'
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/results', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT vote, COUNT(*) as count FROM votes GROUP BY vote'
        );
        
        const results = { cats: 0, dogs: 0 };
        result.rows.forEach(row => {
            results[row.vote] = parseInt(row.count);
        });
        
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Results app running on port 3000');
});