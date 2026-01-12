from flask import Flask, render_template, request, jsonify, redirect, url_for
from pymongo import MongoClient
from datetime import datetime
import os

app = Flask(__name__)

# MongoDB connection
mongo_host = os.getenv('MONGO_HOST', 'localhost')
mongo_port = int(os.getenv('MONGO_PORT', 27017))
client = MongoClient(f'mongodb://{mongo_host}:{mongo_port}/')
db = client.expense_tracker
expenses = db.expenses

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    expense_list = list(expenses.find({}, {'_id': 0}).sort('date', -1))
    total = sum(exp['amount'] for exp in expense_list)
    return jsonify({'expenses': expense_list, 'total': total})

@app.route('/api/expenses', methods=['POST'])
def add_expense():
    data = request.json
    expense = {
        'description': data['description'],
        'amount': float(data['amount']),
        'category': data['category'],
        'date': data.get('date', datetime.now().strftime('%Y-%m-%d'))
    }
    expenses.insert_one(expense)
    return jsonify({'success': True})

@app.route('/api/expenses/<description>', methods=['DELETE'])
def delete_expense(description):
    expenses.delete_one({'description': description})
    return jsonify({'success': True})

@app.route('/api/stats')
def get_stats():
    pipeline = [
        {'$group': {'_id': '$category', 'total': {'$sum': '$amount'}}}
    ]
    stats = list(expenses.aggregate(pipeline))
    return jsonify(stats)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)