# Hangman Game

Interactive hangman game with MySQL database for word storage and player statistics.

## Port
- **NodePort**: 30210
- **Container Port**: 3000

## Quick Start
```bash
# Build image
docker build -t hangman-game:latest .

# Deploy to Kubernetes
kubectl apply -f k8s/hangman-all.yml

# Access game
minikube service hangman-service -n hangman-ns
```

## Features
- 🎯 Classic hangman gameplay with visual hangman
- 📚 Word categories (programming, animals, nature, etc.)
- 🎚️ Difficulty levels (easy, medium, hard)
- 🏆 Player leaderboard with statistics
- 💾 Persistent game history in MySQL
- 🎨 Modern responsive interface

## Developer Info
- **Framework**: Node.js/Express + MySQL
- **Features**: Game logic, word management, player tracking, leaderboard
- **K8s Resources**: StatefulSet (MySQL), Deployment (App), Services, ConfigMap

## Challenge
Learn game state management, database relationships, and interactive web applications.