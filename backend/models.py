"""Database Models for Flipkart Price Tracker"""
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from sqlalchemy.dialects.postgresql import JSON

db = SQLAlchemy()
bcrypt = Bcrypt()


class User(db.Model):
    """User Model for Authentication"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(15), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    products = db.relationship('Product', backref='user', lazy=True, cascade='all, delete-orphan')
    alerts = db.relationship('Alert', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        """Verify password"""
        return bcrypt.check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'phone': self.phone,
            'created_at': self.created_at.isoformat()
        }


class Product(db.Model):
    """Product Model for Tracking Flipkart Products"""
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    flipkart_url = db.Column(db.String(500), nullable=False)
    product_name = db.Column(db.String(300), nullable=False)
    current_price = db.Column(db.Float, nullable=True)
    stock_status = db.Column(db.String(50), default='Unknown')
    product_image = db.Column(db.String(500), nullable=True)
    rating = db.Column(db.Float, nullable=True)
    reviews_count = db.Column(db.Integer, default=0)
    added_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_scraped_at = db.Column(db.DateTime, nullable=True)
    
    # Relationships
    price_histories = db.relationship('PriceHistory', backref='product', lazy=True, cascade='all, delete-orphan')
    alerts = db.relationship('Alert', backref='product', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'flipkart_url': self.flipkart_url,
            'product_name': self.product_name,
            'current_price': self.current_price,
            'stock_status': self.stock_status,
            'product_image': self.product_image,
            'rating': self.rating,
            'reviews_count': self.reviews_count,
            'added_at': self.added_at.isoformat(),
            'last_scraped_at': self.last_scraped_at.isoformat() if self.last_scraped_at else None
        }


class PriceHistory(db.Model):
    """Price History Model for Tracking Price Changes"""
    __tablename__ = 'price_histories'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False, index=True)
    price = db.Column(db.Float, nullable=False)
    stock_status = db.Column(db.String(50), default='Unknown')
    discount = db.Column(db.Float, nullable=True)
    original_price = db.Column(db.Float, nullable=True)
    recorded_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'product_id': self.product_id,
            'price': self.price,
            'stock_status': self.stock_status,
            'discount': self.discount,
            'original_price': self.original_price,
            'recorded_at': self.recorded_at.isoformat()
        }


class Alert(db.Model):
    """Alert Model for User Notifications"""
    __tablename__ = 'alerts'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    threshold_price = db.Column(db.Float, nullable=True)
    alert_type = db.Column(db.String(50), default='price_drop')  # price_drop, threshold, stock
    notification_method = db.Column(db.String(50), default='email')  # email, sms, both
    is_active = db.Column(db.Boolean, default=True)
    frequency = db.Column(db.String(50), default='once')  # once, daily, weekly
    last_notified_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'product_id': self.product_id,
            'user_id': self.user_id,
            'threshold_price': self.threshold_price,
            'alert_type': self.alert_type,
            'notification_method': self.notification_method,
            'is_active': self.is_active,
            'frequency': self.frequency,
            'last_notified_at': self.last_notified_at.isoformat() if self.last_notified_at else None,
            'created_at': self.created_at.isoformat()
        }
