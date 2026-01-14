const express = require('express');
const mysql = require('mysql2/promise');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({ secret: 'hospital-secret', resave: false, saveUninitialized: false }));

app.set('view engine', 'ejs');
app.set('views', './views');

const mysqlConfig = {
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'password',
    database: process.env.MYSQL_DATABASE || 'hospital_db'
};

const mongoUri = `mongodb://${process.env.MONGO_HOST || 'localhost'}:${process.env.MONGO_PORT || 27017}/hospital`;

const patientSchema = new mongoose.Schema({
    name: String,
    age: Number,
    gender: String,
    phone: String,
    email: String,
    blood_group: String,
    address: String,
    medical_history: String,
    created_at: { type: Date, default: Date.now }
});

const appointmentSchema = new mongoose.Schema({
    patient_id: mongoose.Schema.Types.ObjectId,
    doctor_id: Number,
    date: Date,
    time: String,
    department: String,
    reason: String,
    status: { type: String, default: 'scheduled' },
    created_at: { type: Date, default: Date.now }
});

const Patient = mongoose.model('Patient', patientSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);

async function initDatabases() {
    try {
        const connection = await mysql.createConnection(mysqlConfig);
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role ENUM('admin', 'doctor', 'receptionist') DEFAULT 'receptionist',
                department VARCHAR(50),
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
        const totalPatients = await Patient.countDocuments();
        const totalAppointments = await Appointment.countDocuments();
        const todayAppointments = await Appointment.countDocuments({
            date: { $gte: new Date().setHours(0,0,0,0), $lt: new Date().setHours(23,59,59,999) }
        });
        
        res.render('dashboard', { 
            user: req.session.user,
            stats: { totalPatients, totalAppointments, todayAppointments }
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
            req.session.user = { id: rows[0].id, username: rows[0].username, role: rows[0].role, department: rows[0].department };
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
            'INSERT INTO users (username, email, password_hash, role, department) VALUES (?, ?, ?, ?, ?)',
            [req.body.username, req.body.email, hashedPassword, req.body.role, req.body.department]
        );
        await connection.end();
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: 'Registration failed' });
    }
});

app.get('/patients', async (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    
    try {
        const patients = await Patient.find().sort({ created_at: -1 });
        res.render('patients', { patients, user: req.session.user });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

app.post('/api/patients', async (req, res) => {
    if (!req.session.userId) return res.json({ success: false, message: 'Not authenticated' });
    
    try {
        const patient = new Patient(req.body);
        await patient.save();
        res.json({ success: true, patientId: patient._id });
    } catch (error) {
        res.json({ success: false, message: 'Error creating patient' });
    }
});

app.get('/appointments', async (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    
    try {
        const appointments = await Appointment.find().sort({ date: 1, time: 1 });
        const appointmentsWithDetails = await Promise.all(
            appointments.map(async (apt) => {
                const patient = await Patient.findById(apt.patient_id);
                const connection = await mysql.createConnection(mysqlConfig);
                const [doctor] = await connection.execute('SELECT username, department FROM users WHERE id = ?', [apt.doctor_id]);
                await connection.end();
                return { ...apt.toObject(), patient, doctor: doctor[0] };
            })
        );
        res.render('appointments', { appointments: appointmentsWithDetails, user: req.session.user });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

app.post('/api/appointments', async (req, res) => {
    if (!req.session.userId) return res.json({ success: false, message: 'Not authenticated' });
    
    try {
        const appointment = new Appointment({
            ...req.body,
            date: new Date(req.body.date)
        });
        await appointment.save();
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: 'Error creating appointment' });
    }
});

app.get('/api/doctors', async (req, res) => {
    try {
        const connection = await mysql.createConnection(mysqlConfig);
        const [doctors] = await connection.execute('SELECT id, username, department FROM users WHERE role = "doctor"');
        await connection.end();
        res.json({ doctors });
    } catch (error) {
        res.json({ success: false, message: 'Error fetching doctors' });
    }
});

app.get('/api/patients', async (req, res) => {
    try {
        const patients = await Patient.find({}, { name: 1, phone: 1 });
        res.json({ patients });
    } catch (error) {
        res.json({ success: false, message: 'Error fetching patients' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

const PORT = process.env.PORT || 3000;

initDatabases().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Hospital Management running on port ${PORT}`);
    });
});