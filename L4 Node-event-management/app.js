const express = require('express');
const mysql = require('mysql2/promise');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'event-secret-key',
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.set('views', './views');

// MySQL connection for users
const mysqlConfig = {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
};

// MongoDB connection for events
const mongoUri = `mongodb://${process.env.MONGO_HOST || 'localhost'}:27017/event_platform`;

// MongoDB Schemas
const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    date: Date,
    time: String,
    location: String,
    capacity: Number,
    price: Number,
    organizer_id: Number,
    created_at: { type: Date, default: Date.now },
    status: { type: String, default: 'active' }
});

const bookingSchema = new mongoose.Schema({
    event_id: mongoose.Schema.Types.ObjectId,
    user_id: Number,
    tickets: Number,
    total_amount: Number,
    booking_date: { type: Date, default: Date.now },
    status: { type: String, default: 'confirmed' }
});

const Event = mongoose.model('Event', eventSchema);
const Booking = mongoose.model('Booking', bookingSchema);

// Initialize databases
async function initDatabases() {
    try {
        // MySQL initialization
        const connection = await mysql.createConnection(mysqlConfig);
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role ENUM('user', 'organizer', 'admin') DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await connection.end();
        
        // MongoDB initialization
        await mongoose.connect(mongoUri);
        console.log('Databases connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
    }
}

// Routes
app.get('/', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    
    try {
        const events = await Event.find({ status: 'active' }).sort({ date: 1 }).limit(6);
        const totalEvents = await Event.countDocuments();
        const totalBookings = await Booking.countDocuments();
        
        res.render('dashboard', { 
            user: req.session.user,
            events,
            stats: { totalEvents, totalBookings }
        });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    try {
        const connection = await mysql.createConnection(mysqlConfig);
        const [rows] = await connection.execute(
            'SELECT * FROM users WHERE username = ?',
            [req.body.username]
        );
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

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const connection = await mysql.createConnection(mysqlConfig);
        
        await connection.execute(
            'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [req.body.username, req.body.email, hashedPassword, req.body.role || 'user']
        );
        await connection.end();
        
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: error.code === 'ER_DUP_ENTRY' ? 'Username or email already exists' : 'Server error' });
    }
});

app.get('/events', async (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    
    try {
        const events = await Event.find({ status: 'active' }).sort({ date: 1 });
        res.render('events', { events, user: req.session.user });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

app.get('/create-event', (req, res) => {
    if (!req.session.userId || req.session.user.role === 'user') {
        return res.redirect('/');
    }
    res.render('create-event', { user: req.session.user });
});

app.post('/api/events', async (req, res) => {
    if (!req.session.userId) {
        return res.json({ success: false, message: 'Not authenticated' });
    }
    
    try {
        const event = new Event({
            ...req.body,
            organizer_id: req.session.userId,
            date: new Date(req.body.date)
        });
        
        await event.save();
        res.json({ success: true, eventId: event._id });
    } catch (error) {
        res.json({ success: false, message: 'Error creating event' });
    }
});

app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find({ status: 'active' }).sort({ date: 1 });
        res.json({ events });
    } catch (error) {
        res.json({ success: false, message: 'Error fetching events' });
    }
});

app.post('/api/bookings', async (req, res) => {
    if (!req.session.userId) {
        return res.json({ success: false, message: 'Not authenticated' });
    }
    
    try {
        const event = await Event.findById(req.body.event_id);
        if (!event) {
            return res.json({ success: false, message: 'Event not found' });
        }
        
        const booking = new Booking({
            event_id: req.body.event_id,
            user_id: req.session.userId,
            tickets: req.body.tickets,
            total_amount: event.price * req.body.tickets
        });
        
        await booking.save();
        res.json({ success: true, bookingId: booking._id });
    } catch (error) {
        res.json({ success: false, message: 'Error creating booking' });
    }
});

app.get('/my-bookings', async (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    
    try {
        const bookings = await Booking.find({ user_id: req.session.userId }).sort({ booking_date: -1 });
        const bookingsWithEvents = await Promise.all(
            bookings.map(async (booking) => {
                const event = await Event.findById(booking.event_id);
                return { ...booking.toObject(), event };
            })
        );
        
        res.render('bookings', { bookings: bookingsWithEvents, user: req.session.user });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

app.get('/analytics', async (req, res) => {
    if (!req.session.userId || req.session.user.role === 'user') {
        return res.redirect('/');
    }
    
    try {
        const totalEvents = await Event.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const totalRevenue = await Booking.aggregate([
            { $group: { _id: null, total: { $sum: '$total_amount' } } }
        ]);
        
        const categoryStats = await Event.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);
        
        res.render('analytics', {
            user: req.session.user,
            stats: {
                totalEvents,
                totalBookings,
                totalRevenue: totalRevenue[0]?.total || 0,
                categoryStats
            }
        });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

const PORT = process.env.PORT || 3000;

initDatabases().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Event Management Platform running on port ${PORT}`);
    });
});