const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('views'));

// MongoDB connection
const mongoUrl = process.env.MONGO_URL ;

mongoose.connect(mongoUrl)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Worker Schema
const workerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    department: { type: String, required: true },
    position: { type: String, required: true },
    salary: { type: Number, required: true },
    joinDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'inactive', 'terminated'], default: 'active' },
    address: { type: String },
    skills: [String],
    createdAt: { type: Date, default: Date.now }
});

const Worker = mongoose.model('Worker', workerSchema);

// Attendance Schema
const attendanceSchema = new mongoose.Schema({
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
    date: { type: Date, required: true },
    checkIn: { type: Date },
    checkOut: { type: Date },
    status: { type: String, enum: ['present', 'absent', 'late', 'half-day'], default: 'present' },
    notes: { type: String }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

// Task Schema
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    dueDate: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);

// Routes

// Get all workers
app.get('/api/workers', async (req, res) => {
    try {
        const workers = await Worker.find().sort({ createdAt: -1 });
        res.json(workers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new worker
app.post('/api/workers', async (req, res) => {
    try {
        const worker = new Worker(req.body);
        await worker.save();
        res.json(worker);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update worker
app.put('/api/workers/:id', async (req, res) => {
    try {
        const worker = await Worker.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(worker);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete worker
app.delete('/api/workers/:id', async (req, res) => {
    try {
        await Worker.findByIdAndDelete(req.params.id);
        res.json({ message: 'Worker deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark attendance
app.post('/api/attendance', async (req, res) => {
    try {
        const { workerId, status, checkIn, checkOut } = req.body;
        const today = new Date().toISOString().split('T')[0];
        
        let attendance = await Attendance.findOne({
            workerId,
            date: { $gte: new Date(today), $lt: new Date(today + 'T23:59:59') }
        });
        
        if (attendance) {
            attendance.status = status;
            if (checkIn) attendance.checkIn = new Date(checkIn);
            if (checkOut) attendance.checkOut = new Date(checkOut);
        } else {
            attendance = new Attendance({
                workerId,
                date: new Date(),
                status,
                checkIn: checkIn ? new Date(checkIn) : new Date(),
                checkOut: checkOut ? new Date(checkOut) : null
            });
        }
        
        await attendance.save();
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get attendance records
app.get('/api/attendance', async (req, res) => {
    try {
        const { date, workerId } = req.query;
        let query = {};
        
        if (date) {
            query.date = { $gte: new Date(date), $lt: new Date(date + 'T23:59:59') };
        }
        if (workerId) {
            query.workerId = workerId;
        }
        
        const attendance = await Attendance.find(query).populate('workerId', 'name department');
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create task
app.post('/api/tasks', async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const { workerId } = req.query;
        let query = {};
        if (workerId) query.assignedTo = workerId;
        
        const tasks = await Task.find(query).populate('assignedTo', 'name department').sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update task status
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Dashboard stats
app.get('/api/dashboard', async (req, res) => {
    try {
        const totalWorkers = await Worker.countDocuments();
        const activeWorkers = await Worker.countDocuments({ status: 'active' });
        const todayAttendance = await Attendance.countDocuments({
            date: { $gte: new Date().setHours(0, 0, 0, 0) }
        });
        const pendingTasks = await Task.countDocuments({ status: 'pending' });
        
        res.json({
            totalWorkers,
            activeWorkers,
            todayAttendance,
            pendingTasks
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Workers management app running on port ${PORT}`);
});