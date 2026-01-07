"""Notification Service for Email and SMS Alerts"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from twilio.rest import Client
import os
import logging
from typing import Optional

logger = logging.getLogger(__name__)


class NotificationService:
    """Service for sending email and SMS notifications"""
    
    def __init__(self):
        """Initialize notification service with SMTP and Twilio config"""
        # Email configuration
        self.smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', 587))
        self.sender_email = os.getenv('SENDER_EMAIL')
        self.sender_password = os.getenv('SENDER_PASSWORD')
        self.sender_name = os.getenv('SENDER_NAME', 'Flipkart Price Tracker')
        
        # Twilio configuration
        self.twilio_account = os.getenv('TWILIO_ACCOUNT_SID')
        self.twilio_token = os.getenv('TWILIO_AUTH_TOKEN')
        self.twilio_phone = os.getenv('TWILIO_PHONE_NUMBER')
        
        self.email_enabled = os.getenv('NOTIFICATION_EMAIL_ENABLED', 'True') == 'True'
        self.sms_enabled = os.getenv('NOTIFICATION_SMS_ENABLED', 'True') == 'True'
    
    def send_price_drop_email(self, recipient_email: str, product_name: str, 
                              old_price: float, new_price: float, 
                              savings: float) -> bool:
        """Send email notification for price drop
        
        Args:
            recipient_email: User's email address
            product_name: Name of product
            old_price: Previous price
            new_price: Current price
            savings: Amount saved
            
        Returns:
            bool: True if email sent successfully
        """
        if not self.email_enabled or not self.sender_email:
            logger.warning("Email notifications disabled or not configured")
            return False
        
        try:
            subject = f"Price Drop Alert: {product_name}"
            
            body = f"""
            <html>
                <body style="font-family: Arial, sans-serif;">
                    <h2 style="color: #00d4ff;">Price Drop Detected!</h2>
                    <p><strong>Product:</strong> {product_name}</p>
                    <p><strong>Previous Price:</strong> ₹{old_price:,.2f}</p>
                    <p><strong>Current Price:</strong> ₹{new_price:,.2f}</p>
                    <p><strong>Savings:</strong> <span style="color: green;">₹{savings:,.2f}</span></p>
                    <p>Check it out on <a href="https://www.flipkart.com" style="color: #00d4ff;">Flipkart</a> now!</p>
                    <hr>
                    <p style="color: gray; font-size: 12px;">This is an automated notification from {self.sender_name}</p>
                </body>
            </html>
            """
            
            message = MIMEMultipart('alternative')
            message['Subject'] = subject
            message['From'] = f"{self.sender_name} <{self.sender_email}>"
            message['To'] = recipient_email
            
            message.attach(MIMEText(body, 'html'))
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.send_message(message)
            
            logger.info(f"Price drop email sent to {recipient_email} for {product_name}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send price drop email: {str(e)}")
            return False
    
    def send_price_drop_sms(self, phone_number: str, product_name: str,
                            old_price: float, new_price: float) -> Optional[str]:
        """Send SMS notification for price drop
        
        Args:
            phone_number: User's phone number (with country code)
            product_name: Name of product
            old_price: Previous price
            new_price: Current price
            
        Returns:
            str: Message SID if sent successfully, None otherwise
        """
        if not self.sms_enabled or not self.twilio_account:
            logger.warning("SMS notifications disabled or not configured")
            return None
        
        try:
            client = Client(self.twilio_account, self.twilio_token)
            
            message_body = f"Price Drop Alert: {product_name} - ₹{old_price:,.0f} → ₹{new_price:,.0f}. Check Flipkart now!"
            
            message = client.messages.create(
                body=message_body,
                from_=self.twilio_phone,
                to=phone_number
            )
            
            logger.info(f"Price drop SMS sent to {phone_number} for {product_name}")
            return message.sid
            
        except Exception as e:
            logger.error(f"Failed to send price drop SMS: {str(e)}")
            return None
    
    def send_notification(self, user_email: str, phone_number: Optional[str],
                         notification_method: str, product_name: str,
                         old_price: float, new_price: float) -> bool:
        """Send notification via specified method(s)
        
        Args:
            user_email: User's email
            phone_number: User's phone number
            notification_method: 'email', 'sms', or 'both'
            product_name: Product name
            old_price: Previous price
            new_price: Current price
            
        Returns:
            bool: True if at least one notification sent
        """
        success = False
        savings = old_price - new_price
        
        if notification_method in ['email', 'both']:
            if self.send_price_drop_email(user_email, product_name, old_price, new_price, savings):
                success = True
        
        if notification_method in ['sms', 'both'] and phone_number:
            if self.send_price_drop_sms(phone_number, product_name, old_price, new_price):
                success = True
        
        return success


# Create singleton instance
notification_service = NotificationService()
