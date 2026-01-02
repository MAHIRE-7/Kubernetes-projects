from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    num1 = float(data['num1'])
    num2 = float(data['num2'])
    operation = data['operation']
    
    if operation == 'add':
        result = num1 + num2
    elif operation == 'subtract':
        result = num1 - num2
    elif operation == 'multiply':
        result = num1 * num2
    elif operation == 'divide':
        if num2 == 0:
            return jsonify({'error': 'Cannot divide by zero'})
        result = num1 / num2
    else:
        return jsonify({'error': 'Invalid operation'})
    
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)