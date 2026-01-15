const express = require('express');
const mysql = require('mysql2/promise');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'ecommerce-secret';

const mysqlConfig = {
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'password',
    database: process.env.MYSQL_DATABASE || 'ecommerce_db'
};

const mongoUri = `mongodb://${process.env.MONGO_HOST || 'localhost'}:${process.env.MONGO_PORT || 27017}/ecommerce`;

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    category: String,
    stock: Number,
    image: String,
    created_at: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
    user_id: Number,
    items: Array,
    total_amount: Number,
    status: { type: String, default: 'pending' },
    created_at: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

async function initDatabases() {
    try {
        const connection = await mysql.createConnection(mysqlConfig);
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await connection.end();
        await mongoose.connect(mongoUri);
        console.log('Databases connected');
    } catch (error) {
        console.error('Database error:', error);
    }
}

// Auth middleware
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token provided' });
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Auth routes
app.post('/api/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const connection = await mysql.createConnection(mysqlConfig);
        await connection.execute(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [req.body.username, req.body.email, hashedPassword]
        );
        await connection.end();
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: 'Registration failed' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const connection = await mysql.createConnection(mysqlConfig);
        const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [req.body.username]);
        await connection.end();
        
        if (rows.length > 0 && await bcrypt.compare(req.body.password, rows[0].password_hash)) {
            const token = jwt.sign({ userId: rows[0].id }, JWT_SECRET);
            res.json({ success: true, token, user: { id: rows[0].id, username: rows[0].username } });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Product routes
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ products });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/products', auth, async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.json({ success: true, product });
    } catch (error) {
        res.status(400).json({ error: 'Error creating product' });
    }
});

// Order routes
app.post('/api/orders', auth, async (req, res) => {
    try {
        const order = new Order({
            user_id: req.userId,
            items: req.body.items,
            total_amount: req.body.total_amount
        });
        await order.save();
        res.json({ success: true, order });
    } catch (error) {
        res.status(400).json({ error: 'Error creating order' });
    }
});

app.get('/api/orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user_id: req.userId }).sort({ created_at: -1 });
        res.json({ orders });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/stats', async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        res.json({ totalProducts, totalOrders });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;

initDatabases().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Backend API running on port ${PORT}`);
    });
});