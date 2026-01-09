const express = require('express');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('views'));
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

const dbConfig = {
    host: process.env.DB_HOST || 'mysql-service',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'placement'
};

let db;

async function initDB() {
    try {
        db = await mysql.createConnection(dbConfig);
        
        await db.execute(`
            CREATE TABLE IF NOT EXISTS students (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                phone VARCHAR(15),
                branch VARCHAR(50),
                cgpa DECIMAL(3,2),
                resume_path VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        await db.execute(`
            CREATE TABLE IF NOT EXISTS companies (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                package DECIMAL(10,2),
                min_cgpa DECIMAL(3,2),
                eligible_branches JSON,
                drive_date DATE,
                status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        await db.execute(`
            CREATE TABLE IF NOT EXISTS applications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                company_id INT NOT NULL,
                status ENUM('applied', 'shortlisted', 'selected', 'rejected') DEFAULT 'applied',
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id) REFERENCES students(id),
                FOREIGN KEY (company_id) REFERENCES companies(id),
                UNIQUE KEY unique_application (student_id, company_id)
            )
        `);
        
        console.log('Placement database connected and initialized');
    } catch (error) {
        console.error('Database connection failed:', error);
        setTimeout(initDB, 5000);
    }
}

// Student registration
app.post('/api/students', upload.single('resume'), async (req, res) => {
    try {
        const { name, email, phone, branch, cgpa } = req.body;
        const resumePath = req.file ? req.file.filename : null;
        
        const [result] = await db.execute(
            'INSERT INTO students (name, email, phone, branch, cgpa, resume_path) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, phone, branch, parseFloat(cgpa), resumePath]
        );
        
        res.json({ id: result.insertId, message: 'Student registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all students
app.get('/api/students', async (req, res) => {
    try {
        const [students] = await db.execute('SELECT * FROM students ORDER BY name');
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add company drive
app.post('/api/companies', async (req, res) => {
    try {
        const { name, description, package, min_cgpa, eligible_branches, drive_date } = req.body;
        
        const [result] = await db.execute(
            'INSERT INTO companies (name, description, package, min_cgpa, eligible_branches, drive_date) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, parseFloat(package), parseFloat(min_cgpa), JSON.stringify(eligible_branches), drive_date]
        );
        
        res.json({ id: result.insertId, message: 'Company drive added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all companies
app.get('/api/companies', async (req, res) => {
    try {
        const [companies] = await db.execute('SELECT * FROM companies ORDER BY drive_date DESC');
        const companiesWithBranches = companies.map(company => ({
            ...company,
            eligible_branches: JSON.parse(company.eligible_branches || '[]')
        }));
        res.json(companiesWithBranches);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get eligible companies for student
app.get('/api/students/:id/eligible-companies', async (req, res) => {
    try {
        const studentId = req.params.id;
        
        const [student] = await db.execute('SELECT * FROM students WHERE id = ?', [studentId]);
        if (student.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        const studentData = student[0];
        
        const [companies] = await db.execute(`
            SELECT c.*, 
                   CASE WHEN a.id IS NOT NULL THEN a.status ELSE NULL END as application_status
            FROM companies c
            LEFT JOIN applications a ON c.id = a.company_id AND a.student_id = ?
            WHERE c.status = 'active' 
            AND c.min_cgpa <= ?
        `, [studentId, studentData.cgpa]);
        
        const eligibleCompanies = companies.filter(company => {
            const branches = JSON.parse(company.eligible_branches || '[]');
            return branches.length === 0 || branches.includes(studentData.branch);
        });
        
        res.json(eligibleCompanies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Apply for company
app.post('/api/applications', async (req, res) => {
    try {
        const { student_id, company_id } = req.body;
        
        const [result] = await db.execute(
            'INSERT INTO applications (student_id, company_id) VALUES (?, ?)',
            [student_id, company_id]
        );
        
        res.json({ id: result.insertId, message: 'Application submitted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get applications for company
app.get('/api/companies/:id/applications', async (req, res) => {
    try {
        const companyId = req.params.id;
        
        const [applications] = await db.execute(`
            SELECT a.*, s.name, s.email, s.phone, s.branch, s.cgpa, s.resume_path
            FROM applications a
            JOIN students s ON a.student_id = s.id
            WHERE a.company_id = ?
            ORDER BY a.applied_at DESC
        `, [companyId]);
        
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update application status
app.put('/api/applications/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        
        await db.execute(
            'UPDATE applications SET status = ? WHERE id = ?',
            [status, applicationId]
        );
        
        res.json({ message: 'Application status updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Dashboard stats
app.get('/api/dashboard', async (req, res) => {
    try {
        const [studentCount] = await db.execute('SELECT COUNT(*) as count FROM students');
        const [companyCount] = await db.execute('SELECT COUNT(*) as count FROM companies WHERE status = "active"');
        const [applicationCount] = await db.execute('SELECT COUNT(*) as count FROM applications');
        const [selectedCount] = await db.execute('SELECT COUNT(*) as count FROM applications WHERE status = "selected"');
        
        res.json({
            students: studentCount[0].count,
            companies: companyCount[0].count,
            applications: applicationCount[0].count,
            selections: selectedCount[0].count
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

initDB();

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Placement system running on port ${PORT}`);
});