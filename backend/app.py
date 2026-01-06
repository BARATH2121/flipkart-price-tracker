"""Flask Backend for Flipkart Price Tracker"""
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import os
from datetime import timedelta

load_dotenv()

app = Flask(__name__)
Bcrypt(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    'DATABASE_URL', 
    'sqlite:///flipkart_tracker.db'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Flipkart Price Tracker API is running'}), 200

# Main route
@app.route('/api', methods=['GET'])
def api_info():
    return jsonify({
        'name': 'Flipkart Price Tracker API',
        'version': '1.0.0',
        'endpoints': {
            'auth': '/api/auth',
            'products': '/api/products',
            'alerts': '/api/alerts'
        }
    }), 200

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
