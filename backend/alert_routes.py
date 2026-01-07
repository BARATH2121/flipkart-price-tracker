"""Alert Management Routes for Flipkart Price Tracker"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Product, Alert
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
alert_bp = Blueprint('alerts', __name__, url_prefix='/api/alerts')


@alert_bp.route('', methods=['GET'])
@jwt_required()
def get_user_alerts():
    """Get all alerts for current user"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        alerts = Alert.query.filter_by(user_id=user_id).all()
        return jsonify({
            'alerts': [a.to_dict() for a in alerts]
        }), 200
        
    except Exception as e:
        logger.error(f"Error fetching alerts: {str(e)}")
        return jsonify({'error': 'Failed to fetch alerts'}), 500


@alert_bp.route('', methods=['POST'])
@jwt_required()
def create_alert():
    """Create new price alert
    
    Request body:
    {
        "product_id": 1,
        "threshold_price": 5000.00,
        "alert_type": "price_drop",
        "notification_method": "email",
        "frequency": "once"
    }
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        if not data.get('product_id'):
            return jsonify({'error': 'Product ID required'}), 400
        
        # Verify product belongs to user
        product = Product.query.filter_by(
            id=data['product_id'],
            user_id=user_id
        ).first()
        
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        # Create alert
        alert = Alert(
            product_id=data['product_id'],
            user_id=user_id,
            threshold_price=data.get('threshold_price'),
            alert_type=data.get('alert_type', 'price_drop'),
            notification_method=data.get('notification_method', 'email'),
            frequency=data.get('frequency', 'once'),
            is_active=True
        )
        
        db.session.add(alert)
        db.session.commit()
        
        logger.info(f"Alert created for product {data['product_id']} by user {user_id}")
        
        return jsonify({
            'message': 'Alert created successfully',
            'alert': alert.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating alert: {str(e)}")
        return jsonify({'error': 'Failed to create alert'}), 500


@alert_bp.route('/<int:alert_id>', methods=['GET'])
@jwt_required()
def get_alert(alert_id):
    """Get specific alert details"""
    try:
        user_id = get_jwt_identity()
        alert = Alert.query.filter_by(
            id=alert_id,
            user_id=user_id
        ).first()
        
        if not alert:
            return jsonify({'error': 'Alert not found'}), 404
        
        return jsonify({
            'alert': alert.to_dict()
        }), 200
        
    except Exception as e:
        logger.error(f"Error fetching alert: {str(e)}")
        return jsonify({'error': 'Failed to fetch alert'}), 500


@alert_bp.route('/<int:alert_id>', methods=['PUT'])
@jwt_required()
def update_alert(alert_id):
    """Update alert settings"""
    try:
        user_id = get_jwt_identity()
        alert = Alert.query.filter_by(
            id=alert_id,
            user_id=user_id
        ).first()
        
        if not alert:
            return jsonify({'error': 'Alert not found'}), 404
        
        data = request.get_json()
        
        # Update allowed fields
        if 'threshold_price' in data:
            alert.threshold_price = data['threshold_price']
        if 'alert_type' in data:
            alert.alert_type = data['alert_type']
        if 'notification_method' in data:
            alert.notification_method = data['notification_method']
        if 'frequency' in data:
            alert.frequency = data['frequency']
        if 'is_active' in data:
            alert.is_active = data['is_active']
        
        alert.updated_at = datetime.utcnow()
        db.session.commit()
        
        logger.info(f"Alert {alert_id} updated by user {user_id}")
        
        return jsonify({
            'message': 'Alert updated successfully',
            'alert': alert.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating alert: {str(e)}")
        return jsonify({'error': 'Failed to update alert'}), 500


@alert_bp.route('/<int:alert_id>', methods=['DELETE'])
@jwt_required()
def delete_alert(alert_id):
    """Delete alert"""
    try:
        user_id = get_jwt_identity()
        alert = Alert.query.filter_by(
            id=alert_id,
            user_id=user_id
        ).first()
        
        if not alert:
            return jsonify({'error': 'Alert not found'}), 404
        
        db.session.delete(alert)
        db.session.commit()
        
        logger.info(f"Alert {alert_id} deleted by user {user_id}")
        
        return jsonify({'message': 'Alert deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error deleting alert: {str(e)}")
        return jsonify({'error': 'Failed to delete alert'}), 500


@alert_bp.route('/product/<int:product_id>', methods=['GET'])
@jwt_required()
def get_product_alerts(product_id):
    """Get all alerts for a specific product"""
    try:
        user_id = get_jwt_identity()
        
        # Verify product belongs to user
        product = Product.query.filter_by(
            id=product_id,
            user_id=user_id
        ).first()
        
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        alerts = Alert.query.filter_by(
            product_id=product_id,
            user_id=user_id
        ).all()
        
        return jsonify({
            'alerts': [a.to_dict() for a in alerts]
        }), 200
        
    except Exception as e:
        logger.error(f"Error fetching product alerts: {str(e)}")
        return jsonify({'error': 'Failed to fetch alerts'}), 500
