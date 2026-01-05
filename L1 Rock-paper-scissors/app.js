const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('.'));
app.use(express.json());

const choices = ['rock', 'paper', 'scissors'];

app.post('/api/play', (req, res) => {
  const playerChoice = req.body.choice;
  const computerChoice = choices[Math.floor(Math.random() * 3)];
  
  let result;
  if (playerChoice === computerChoice) {
    result = 'tie';
  } else if (
    (playerChoice === 'rock' && computerChoice === 'scissors') ||
    (playerChoice === 'paper' && computerChoice === 'rock') ||
    (playerChoice === 'scissors' && computerChoice === 'paper')
  ) {
    result = 'win';
  } else {
    result = 'lose';
  }
  
  res.json({ playerChoice, computerChoice, result });
});

app.listen(port, () => {
  console.log(`Rock-paper-scissors game listening at http://localhost:${port}`);
});