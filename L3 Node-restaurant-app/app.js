const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('views'));

// MySQL connection
const dbConfig = {
    host: process.env.DB_HOST || 'mysql-service',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'restaurant'
};

let db;

async function initDB() {
    try {
        db = await mysql.createConnection(dbConfig);
        
        // Create tables
        await db.execute(`
            CREATE TABLE IF NOT EXISTS menu_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                category VARCHAR(50) NOT NULL,
                description TEXT
            )
        `);
        
        await db.execute(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                customer_name VARCHAR(100) NOT NULL,
                items JSON NOT NULL,
                total DECIMAL(10,2) NOT NULL,
                status VARCHAR(20) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        console.log('Database connected and tables created');
    } catch (error) {
        console.error('Database connection failed:', error);
        setTimeout(initDB, 5000);
    }
}

// Routes
app.get('/api/menu', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM menu_items ORDER BY category, name');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/menu', async (req, res) => {
    try {
        const { name, price, category, description } = req.body;
        const [result] = await db.execute(
            'INSERT INTO menu_items (name, price, category, description) VALUES (?, ?, ?, ?)',
            [name, price, category, description]
        );
        res.json({ id: result.insertId, name, price, category, description });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const { customer_name, items, total } = req.body;
        const [result] = await db.execute(
            'INSERT INTO orders (customer_name, items, total) VALUES (?, ?, ?)',
            [customer_name, JSON.stringify(items), total]
        );
        res.json({ id: result.insertId, customer_name, items, total, status: 'pending' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/orders', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM orders ORDER BY created_at DESC');
        res.json(rows.map(row => ({
            ...row,
            items: JSON.parse(row.items)
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

initDB();

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Restaurant app running on port ${PORT}`);
});