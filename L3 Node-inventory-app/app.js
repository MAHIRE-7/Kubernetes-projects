const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('views'));

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

let db;

async function initDB() {
    try {
        db = await mysql.createConnection(dbConfig);
        
        await db.execute(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                sku VARCHAR(50) UNIQUE NOT NULL,
                category VARCHAR(50) NOT NULL,
                quantity INT DEFAULT 0,
                min_stock INT DEFAULT 10,
                price DECIMAL(10,2) NOT NULL,
                supplier VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        
        await db.execute(`
            CREATE TABLE IF NOT EXISTS stock_movements (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_id INT NOT NULL,
                type ENUM('IN', 'OUT') NOT NULL,
                quantity INT NOT NULL,
                reason VARCHAR(200),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (product_id) REFERENCES products(id)
            )
        `);
        
        console.log('Inventory database connected and tables created');
    } catch (error) {
        console.error('Database connection failed:', error);
        setTimeout(initDB, 5000);
    }
}

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT *, 
            CASE WHEN quantity <= min_stock THEN 'LOW' ELSE 'OK' END as stock_status
            FROM products ORDER BY name
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new product
app.post('/api/products', async (req, res) => {
    try {
        const { name, sku, category, quantity, min_stock, price, supplier } = req.body;
        const [result] = await db.execute(
            'INSERT INTO products (name, sku, category, quantity, min_stock, price, supplier) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, sku, category, quantity || 0, min_stock || 10, price, supplier]
        );
        res.json({ id: result.insertId, name, sku, category, quantity, min_stock, price, supplier });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update stock
app.post('/api/stock/:id', async (req, res) => {
    try {
        const { type, quantity, reason } = req.body;
        const productId = req.params.id;
        
        // Record stock movement
        await db.execute(
            'INSERT INTO stock_movements (product_id, type, quantity, reason) VALUES (?, ?, ?, ?)',
            [productId, type, quantity, reason]
        );
        
        // Update product quantity
        const operation = type === 'IN' ? '+' : '-';
        await db.execute(
            `UPDATE products SET quantity = quantity ${operation} ? WHERE id = ?`,
            [quantity, productId]
        );
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get stock movements
app.get('/api/movements/:id', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT sm.*, p.name as product_name 
            FROM stock_movements sm 
            JOIN products p ON sm.product_id = p.id 
            WHERE sm.product_id = ? 
            ORDER BY sm.created_at DESC LIMIT 20
        `, [req.params.id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get low stock alerts
app.get('/api/alerts', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM products WHERE quantity <= min_stock');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

initDB();

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Inventory app running on port ${PORT}`);
});