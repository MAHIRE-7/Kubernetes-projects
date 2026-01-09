const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('views'));

const dbConfig = {
    host: process.env.DB_HOST || 'mysql-service',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'hangman'
};

let db;

async function initDB() {
    try {
        db = await mysql.createConnection(dbConfig);
        
        await db.execute(`
            CREATE TABLE IF NOT EXISTS words (
                id INT AUTO_INCREMENT PRIMARY KEY,
                word VARCHAR(50) NOT NULL,
                category VARCHAR(30) NOT NULL,
                difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        await db.execute(`
            CREATE TABLE IF NOT EXISTS games (
                id INT AUTO_INCREMENT PRIMARY KEY,
                word_id INT NOT NULL,
                player_name VARCHAR(50),
                guessed_letters JSON,
                wrong_guesses INT DEFAULT 0,
                status ENUM('playing', 'won', 'lost') DEFAULT 'playing',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (word_id) REFERENCES words(id)
            )
        `);
        
        // Insert default words
        const [count] = await db.execute('SELECT COUNT(*) as count FROM words');
        if (count[0].count === 0) {
            const defaultWords = [
                ['javascript', 'programming', 'medium'],
                ['kubernetes', 'technology', 'hard'],
                ['elephant', 'animals', 'easy'],
                ['rainbow', 'nature', 'easy'],
                ['computer', 'technology', 'medium'],
                ['butterfly', 'animals', 'medium'],
                ['mountain', 'nature', 'easy'],
                ['database', 'programming', 'medium'],
                ['adventure', 'general', 'medium'],
                ['chocolate', 'food', 'easy']
            ];
            
            for (const [word, category, difficulty] of defaultWords) {
                await db.execute(
                    'INSERT INTO words (word, category, difficulty) VALUES (?, ?, ?)',
                    [word, category, difficulty]
                );
            }
        }
        
        console.log('Hangman database connected and initialized');
    } catch (error) {
        console.error('Database connection failed:', error);
        setTimeout(initDB, 5000);
    }
}

// Start new game
app.post('/api/game/start', async (req, res) => {
    try {
        console.log('Starting new game with:', req.body);
        
        if (!db) {
            console.log('Database not connected');
            return res.status(500).json({ error: 'Database not connected' });
        }
        
        const { player_name, difficulty } = req.body;
        
        let query = 'SELECT * FROM words';
        let params = [];
        
        if (difficulty && difficulty !== 'all') {
            query += ' WHERE difficulty = ?';
            params.push(difficulty);
        }
        
        query += ' ORDER BY RAND() LIMIT 1';
        
        console.log('Executing query:', query, 'with params:', params);
        const [words] = await db.execute(query, params);
        console.log('Found words:', words.length);
        
        if (words.length === 0) {
            return res.status(404).json({ error: 'No words found' });
        }
        
        const word = words[0];
        console.log('Selected word:', word);
        
        const [result] = await db.execute(
            'INSERT INTO games (word_id, player_name, guessed_letters) VALUES (?, ?, ?)',
            [word.id, player_name || 'Anonymous', JSON.stringify([])]
        );
        
        const response = {
            game_id: result.insertId,
            word_length: word.word.length,
            category: word.category,
            difficulty: word.difficulty,
            guessed_letters: [],
            wrong_guesses: 0,
            status: 'playing'
        };
        
        console.log('Game started:', response);
        res.json(response);
    } catch (error) {
        console.error('Error starting game:', error);
        res.status(500).json({ error: error.message });
    }
});

// Make a guess
app.post('/api/game/:id/guess', async (req, res) => {
    try {
        const gameId = req.params.id;
        const { letter } = req.body;
        
        console.log('Making guess - Game ID:', gameId, 'Letter:', letter);
        
        if (!letter || letter.length !== 1) {
            console.log('Invalid letter:', letter);
            return res.status(400).json({ error: 'Invalid letter' });
        }
        
        if (!db) {
            console.log('Database not connected');
            return res.status(500).json({ error: 'Database not connected' });
        }
        
        const [games] = await db.execute(`
            SELECT g.*, w.word FROM games g 
            JOIN words w ON g.word_id = w.id 
            WHERE g.id = ?
        `, [gameId]);
        
        console.log('Found games:', games.length);
        
        if (games.length === 0) {
            console.log('Game not found:', gameId);
            return res.status(404).json({ error: 'Game not found' });
        }
        
        const game = games[0];
        console.log('Game data:', { id: game.id, word: game.word, status: game.status });
        
        if (game.status !== 'playing') {
            console.log('Game already finished:', game.status);
            return res.status(400).json({ error: 'Game already finished' });
        }
        
        const guessedLetters = JSON.parse(game.guessed_letters || '[]');
        const lowerLetter = letter.toLowerCase();
        
        console.log('Current guessed letters:', guessedLetters);
        
        if (guessedLetters.includes(lowerLetter)) {
            console.log('Letter already guessed:', lowerLetter);
            return res.status(400).json({ error: 'Letter already guessed' });
        }
        
        guessedLetters.push(lowerLetter);
        let wrongGuesses = game.wrong_guesses;
        
        if (!game.word.toLowerCase().includes(lowerLetter)) {
            wrongGuesses++;
        }
        
        // Check win/lose conditions
        let status = 'playing';
        const wordLetters = [...new Set(game.word.toLowerCase().split(''))];
        const correctGuesses = guessedLetters.filter(l => game.word.toLowerCase().includes(l));
        
        if (wordLetters.every(l => correctGuesses.includes(l))) {
            status = 'won';
        } else if (wrongGuesses >= 6) {
            status = 'lost';
        }
        
        console.log('Updating game - Wrong guesses:', wrongGuesses, 'Status:', status);
        
        await db.execute(
            'UPDATE games SET guessed_letters = ?, wrong_guesses = ?, status = ? WHERE id = ?',
            [JSON.stringify(guessedLetters), wrongGuesses, status, gameId]
        );
        
        // Build display word
        const displayWord = game.word.split('').map(l => 
            guessedLetters.includes(l.toLowerCase()) ? l : '_'
        ).join(' ');
        
        const response = {
            display_word: displayWord,
            guessed_letters: guessedLetters,
            wrong_guesses: wrongGuesses,
            status: status,
            word: status !== 'playing' ? game.word : undefined
        };
        
        console.log('Guess response:', response);
        res.json(response);
    } catch (error) {
        console.error('Error making guess:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get game state
app.get('/api/game/:id', async (req, res) => {
    try {
        const [games] = await db.execute(`
            SELECT g.*, w.word, w.category, w.difficulty FROM games g 
            JOIN words w ON g.word_id = w.id 
            WHERE g.id = ?
        `, [req.params.id]);
        
        if (games.length === 0) {
            return res.status(404).json({ error: 'Game not found' });
        }
        
        const game = games[0];
        const guessedLetters = JSON.parse(game.guessed_letters);
        
        const displayWord = game.word.split('').map(l => 
            guessedLetters.includes(l.toLowerCase()) ? l : '_'
        ).join(' ');
        
        res.json({
            game_id: game.id,
            display_word: displayWord,
            category: game.category,
            difficulty: game.difficulty,
            guessed_letters: guessedLetters,
            wrong_guesses: game.wrong_guesses,
            status: game.status,
            word: game.status !== 'playing' ? game.word : undefined
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
    try {
        const [games] = await db.execute(`
            SELECT player_name, COUNT(*) as games_played, 
                   SUM(CASE WHEN status = 'won' THEN 1 ELSE 0 END) as wins,
                   AVG(wrong_guesses) as avg_wrong_guesses
            FROM games 
            WHERE player_name IS NOT NULL AND player_name != 'Anonymous'
            GROUP BY player_name 
            ORDER BY wins DESC, avg_wrong_guesses ASC 
            LIMIT 10
        `);
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new word
app.post('/api/words', async (req, res) => {
    try {
        const { word, category, difficulty } = req.body;
        const [result] = await db.execute(
            'INSERT INTO words (word, category, difficulty) VALUES (?, ?, ?)',
            [word.toLowerCase(), category, difficulty]
        );
        res.json({ id: result.insertId, word, category, difficulty });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

initDB();

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Hangman game running on port ${PORT}`);
});