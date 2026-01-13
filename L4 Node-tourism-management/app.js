const express = require('express');
const mysql = require('mysql2/promise');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'tourism-secret',
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.set('views', './views');

// MySQL for users
const mysqlConfig = {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT ,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE 
};

// MongoDB for tourism data
const mongoUri = `mongodb://${process.env.MONGO_HOST}:27017/tourism`;

// MongoDB Schemas
const destinationSchema = new mongoose.Schema({
    name: String,
    country: String,
    city: String,
    description: String,
    category: String,
    price: Number,
    rating: { type: Number, default: 0 },
    image_url: String,
    created_at: { type: Date, default: Date.now }
});

const bookingSchema = new mongoose.Schema({
    user_id: Number,
    destination_id: mongoose.Schema.Types.ObjectId,
    travelers: Number,
    check_in: Date,
    check_out: Date,
    total_amount: Number,
    status: { type: String, default: 'confirmed' },
    booking_date: { type: Date, default: Date.now }
});

const reviewSchema = new mongoose.Schema({
    user_id: Number,
    destination_id: mongoose.Schema.Types.ObjectId,
    rating: Number,
    comment: String,
    created_at: { type: Date, default: Date.now }
});

const Destination = mongoose.model('Destination', destinationSchema);
const Booking = mongoose.model('Booking', bookingSchema);
const Review = mongoose.model('Review', reviewSchema);

async function initDatabases() {
    try {
        const connection = await mysql.createConnection(mysqlConfig);
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role ENUM('user', 'admin') DEFAULT 'user',
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
        const destinations = await Destination.find().limit(6);
        const totalDestinations = await Destination.countDocuments();
        const totalBookings = await Booking.countDocuments();
        
        res.render('dashboard', { 
            user: req.session.user,
            destinations,
            stats: { totalDestinations, totalBookings }
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
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [req.body.username, req.body.email, hashedPassword]
        );
        await connection.end();
        
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: 'Registration failed' });
    }
});

app.get('/destinations', async (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    
    try {
        const destinations = await Destination.find();
        res.render('destinations', { destinations, user: req.session.user });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

app.post('/api/destinations', async (req, res) => {
    if (!req.session.userId || req.session.user.role !== 'admin') {
        return res.json({ success: false, message: 'Unauthorized' });
    }
    
    try {
        const destination = new Destination(req.body);
        await destination.save();
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: 'Error creating destination' });
    }
});

app.post('/api/bookings', async (req, res) => {
    if (!req.session.userId) {
        return res.json({ success: false, message: 'Not authenticated' });
    }
    
    try {
        const destination = await Destination.findById(req.body.destination_id);
        if (!destination) {
            return res.json({ success: false, message: 'Destination not found' });
        }
        
        const days = Math.ceil((new Date(req.body.check_out) - new Date(req.body.check_in)) / (1000 * 60 * 60 * 24));
        const booking = new Booking({
            user_id: req.session.userId,
            destination_id: req.body.destination_id,
            travelers: req.body.travelers,
            check_in: new Date(req.body.check_in),
            check_out: new Date(req.body.check_out),
            total_amount: destination.price * req.body.travelers * days
        });
        
        await booking.save();
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: 'Booking failed' });
    }
});

app.get('/my-bookings', async (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    
    try {
        const bookings = await Booking.find({ user_id: req.session.userId }).sort({ booking_date: -1 });
        const bookingsWithDestinations = await Promise.all(
            bookings.map(async (booking) => {
                const destination = await Destination.findById(booking.destination_id);
                return { ...booking.toObject(), destination };
            })
        );
        
        res.render('bookings', { bookings: bookingsWithDestinations, user: req.session.user });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

app.post('/api/reviews', async (req, res) => {
    if (!req.session.userId) {
        return res.json({ success: false, message: 'Not authenticated' });
    }
    
    try {
        const review = new Review({
            user_id: req.session.userId,
            destination_id: req.body.destination_id,
            rating: req.body.rating,
            comment: req.body.comment
        });
        
        await review.save();
        
        // Update destination rating
        const reviews = await Review.find({ destination_id: req.body.destination_id });
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await Destination.findByIdAndUpdate(req.body.destination_id, { rating: avgRating });
        
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: 'Review failed' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

const PORT = process.env.PORT || 3000;

initDatabases().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Tourism Management running on port ${PORT}`);
    });
});