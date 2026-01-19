const express = require('express');
const mysql = require('mysql2/promise');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({ secret: 'pharmacy-secret', resave: false, saveUninitialized: false }));

app.set('view engine', 'ejs');
app.set('views', './views');

// MySQL for users
const mysqlConfig = {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD ,
    database: process.env.MYSQL_DATABASE
};

// MongoDB for pharmacy data
const mongoUri = `mongodb://${process.env.MONGO_HOST || 'localhost'}:27017/pharmacy`;

// MongoDB Schemas
const medicineSchema = new mongoose.Schema({
    name: String,
    generic_name: String,
    manufacturer: String,
    category: String,
    price: Number,
    stock: Number,
    expiry_date: Date,
    batch_number: String,
    description: String,
    created_at: { type: Date, default: Date.now }
});

const prescriptionSchema = new mongoose.Schema({
    patient_name: String,
    patient_phone: String,
    doctor_name: String,
    medicines: [{
        medicine_id: mongoose.Schema.Types.ObjectId,
        quantity: Number,
        dosage: String
    }],
    total_amount: Number,
    status: { type: String, default: 'pending' },
    created_at: { type: Date, default: Date.now }
});

const saleSchema = new mongoose.Schema({
    customer_name: String,
    customer_phone: String,
    items: [{
        medicine_id: mongoose.Schema.Types.ObjectId,
        quantity: Number,
        price: Number
    }],
    total_amount: Number,
    payment_method: String,
    created_at: { type: Date, default: Date.now }
});

const Medicine = mongoose.model('Medicine', medicineSchema);
const Prescription = mongoose.model('Prescription', prescriptionSchema);
const Sale = mongoose.model('Sale', saleSchema);

async function initDatabases() {
    try {
        const connection = await mysql.createConnection(mysqlConfig);
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role ENUM('pharmacist', 'manager', 'cashier') DEFAULT 'cashier',
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

app.get('/', async (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    
    try {
        const totalMedicines = await Medicine.countDocuments();
        const totalPrescriptions = await Prescription.countDocuments();
        const totalSales = await Sale.countDocuments();
        const lowStock = await Medicine.countDocuments({ stock: { $lt: 10 } });
        
        res.render('dashboard', { 
            user: req.session.user,
            stats: { totalMedicines, totalPrescriptions, totalSales, lowStock }
        });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

app.get('/login', (req, res) => res.render('login'));

app.post('/login', async (req, res) => {
    try {
        const connection = await mysql.createConnection(mysqlConfig);
        const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [req.body.username]);
        await connection.end();
        
        if (rows.length > 0 && await bcrypt.compare(req.body.password, rows[0].password_hash)) {
            req.session.userId = rows[0].id;
            req.session.user = { id: rows[0].id, username: rows[0].username, role: rows[0].role };
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        res.json({ success: false, message: 'Server error' });
    }
});

app.get('/register', (req, res) => res.render('register'));

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const connection = await mysql.createConnection(mysqlConfig);
        await connection.execute(
            'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [req.body.username, req.body.email, hashedPassword, req.body.role]
        );
        await connection.end();
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: 'Registration failed' });
    }
});

app.get('/medicines', async (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    
    try {
        const medicines = await Medicine.find().sort({ created_at: -1 });
        res.render('medicines', { medicines, user: req.session.user });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

app.post('/api/medicines', async (req, res) => {
    if (!req.session.userId) return res.json({ success: false, message: 'Not authenticated' });
    
    try {
        const medicine = new Medicine(req.body);
        await medicine.save();
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: 'Error adding medicine' });
    }
});

app.get('/prescriptions', async (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    
    try {
        const prescriptions = await Prescription.find().sort({ created_at: -1 });
        res.render('prescriptions', { prescriptions, user: req.session.user });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

app.post('/api/prescriptions', async (req, res) => {
    if (!req.session.userId) return res.json({ success: false, message: 'Not authenticated' });
    
    try {
        const prescription = new Prescription(req.body);
        await prescription.save();
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: 'Error creating prescription' });
    }
});

app.get('/sales', async (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    
    try {
        const sales = await Sale.find().sort({ created_at: -1 });
        res.render('sales', { sales, user: req.session.user });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

app.post('/api/sales', async (req, res) => {
    if (!req.session.userId) return res.json({ success: false, message: 'Not authenticated' });
    
    try {
        const sale = new Sale(req.body);
        await sale.save();
        
        // Update stock
        for (const item of req.body.items) {
            await Medicine.findByIdAndUpdate(item.medicine_id, { $inc: { stock: -item.quantity } });
        }
        
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: 'Error processing sale' });
    }
});

app.get('/api/medicines', async (req, res) => {
    try {
        const medicines = await Medicine.find();
        res.json({ medicines });
    } catch (error) {
        res.json({ success: false, message: 'Error fetching medicines' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

const PORT = process.env.PORT || 3000;

initDatabases().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Pharmacy Management running on port ${PORT}`);
    });
});