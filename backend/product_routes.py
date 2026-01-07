"""Product Management Routes for Flipkart Price Tracker"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Product, PriceHistory
from flipkart_scraper import scrape_flipkart_product
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
product_bp = Blueprint('products', __name__, url_prefix='/api/products')


@product_bp.route('', methods=['GET'])
@jwt_required()
def get_user_products():
    """Get all products tracked by user"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        products = Product.query.filter_by(user_id=user_id).all()
        return jsonify({
            'products': [p.to_dict() for p in products]
        }), 200
    except Exception as e:
        logger.error(f"Error fetching products: {str(e)}")
        return jsonify({'error': 'Failed to fetch products'}), 500


@product_bp.route('', methods=['POST'])
@jwt_required()
def add_product():
    """Add new product to track"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data.get('flipkart_url'):
            return jsonify({'error': 'Flipkart URL required'}), 400
        
        # Check if product already tracked by user
        existing = Product.query.filter_by(
            user_id=user_id,
            flipkart_url=data['flipkart_url']
        ).first()
        
        if existing:
            return jsonify({'error': 'Product already tracked'}), 409
        
        # Scrape product information
        scraped_data = scrape_flipkart_product(data['flipkart_url'])
        
        if not scraped_data:
            return jsonify({'error': 'Failed to scrape product. Invalid URL?'}), 400
        
        # Create product record
        product = Product(
            user_id=user_id,
            flipkart_url=data['flipkart_url'],
            product_name=scraped_data.get('name', 'Unknown'),
            current_price=scraped_data.get('price'),
            stock_status=scraped_data.get('stock_status', 'Unknown'),
            rating=scraped_data.get('rating'),
            reviews_count=scraped_data.get('reviews_count', 0),
            last_scraped_at=datetime.utcnow()
        )
        
        # Add initial price history
        price_history = PriceHistory(
            product_id=product.id,
            price=scraped_data.get('price'),
            stock_status=scraped_data.get('stock_status')
        )
        
        db.session.add(product)
        db.session.add(price_history)
        db.session.commit()
        
        logger.info(f"Product added: {product.product_name} for user {user_id}")
        
        return jsonify({
            'message': 'Product added successfully',
            'product': product.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error adding product: {str(e)}")
        return jsonify({'error': 'Failed to add product'}), 500


@product_bp.route('/<int:product_id>', methods=['GET'])
@jwt_required()
def get_product(product_id):
    """Get product details with price history"""
    try:
        user_id = get_jwt_identity()
        product = Product.query.filter_by(
            id=product_id,
            user_id=user_id
        ).first()
        
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        # Get recent price history
        history = PriceHistory.query.filter_by(
            product_id=product_id
        ).order_by(PriceHistory.recorded_at.desc()).limit(30).all()
        
        return jsonify({
            'product': product.to_dict(),
            'price_history': [h.to_dict() for h in reversed(history)]
        }), 200
        
    except Exception as e:
        logger.error(f"Error fetching product: {str(e)}")
        return jsonify({'error': 'Failed to fetch product'}), 500


@product_bp.route('/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    """Remove product from tracking"""
    try:
        user_id = get_jwt_identity()
        product = Product.query.filter_by(
            id=product_id,
            user_id=user_id
        ).first()
        
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        db.session.delete(product)
        db.session.commit()
        
        logger.info(f"Product deleted: {product_id}")
        
        return jsonify({'message': 'Product deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error deleting product: {str(e)}")
        return jsonify({'error': 'Failed to delete product'}), 500
