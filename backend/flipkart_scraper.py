"""Flipkart Web Scraper Module"""
import logging
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from bs4 import BeautifulSoup
import requests
import re
import time
from typing import Dict, Optional

logger = logging.getLogger(__name__)


class FlipkartScraper:
    """Web scraper for Flipkart product information"""
    
    def __init__(self, headless=True, timeout=30):
        """Initialize Flipkart scraper with Selenium WebDriver
        
        Args:
            headless (bool): Run browser in headless mode
            timeout (int): Timeout for WebDriver operations in seconds
        """
        self.timeout = timeout
        self.user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        self.headers = {'User-Agent': self.user_agent}
        
        # Selenium options
        options = webdriver.ChromeOptions()
        if headless:
            options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument(f'user-agent={self.user_agent}')
        
        try:
            self.driver = webdriver.Chrome(options=options)
        except Exception as e:
            logger.error(f"Failed to initialize Chrome WebDriver: {str(e)}")
            self.driver = None
    
    def scrape_product(self, url: str) -> Optional[Dict]:
        """Scrape product information from Flipkart URL
        
        Args:
            url (str): Flipkart product URL
            
        Returns:
            dict: Product data or None if scraping fails
        """
        if not self.driver:
            logger.error("WebDriver not initialized")
            return None
        
        try:
            # Load the page
            self.driver.get(url)
            time.sleep(2)  # Wait for dynamic content
            
            # Wait for main product element
            wait = WebDriverWait(self.driver, self.timeout)
            wait.until(EC.presence_of_element_located((By.CLASS_NAME, '_3wjZc')))
            
            # Extract product details
            product_data = self._extract_product_details()
            
            if product_data:
                product_data['url'] = url
                logger.info(f"Successfully scraped: {product_data.get('name')}")
                return product_data
            else:
                logger.warning(f"Could not extract details from {url}")
                return None
                
        except TimeoutException:
            logger.error(f"Timeout while loading {url}")
            return None
        except Exception as e:
            logger.error(f"Error scraping {url}: {str(e)}")
            return None
    
    def _extract_product_details(self) -> Optional[Dict]:
        """Extract product details from loaded page
        
        Returns:
            dict: Extracted product details or None
        """
        try:
            html = self.driver.page_source
            soup = BeautifulSoup(html, 'html.parser')
            
            # Extract product name
            name_elem = soup.find('span', class_='B_NuCI')
            name = name_elem.text if name_elem else 'Unknown'
            
            # Extract price
            price = self._extract_price(soup)
            
            # Extract stock status
            stock_status = self._extract_stock_status(soup)
            
            # Extract rating
            rating = self._extract_rating(soup)
            
            # Extract reviews count
            reviews_count = self._extract_reviews_count(soup)
            
            return {
                'name': name,
                'price': price,
                'stock_status': stock_status,
                'rating': rating,
                'reviews_count': reviews_count,
                'timestamp': time.time()
            }
            
        except Exception as e:
            logger.error(f"Error extracting product details: {str(e)}")
            return None
    
    def _extract_price(self, soup: BeautifulSoup) -> Optional[float]:
        """Extract price from soup"""
        try:
            price_elem = soup.find('div', class_='_30jeq')
            if price_elem:
                price_text = price_elem.text.strip()
                # Remove currency symbol and convert to float
                price_str = re.sub(r'[^0-9.]', '', price_text)
                return float(price_str) if price_str else None
        except Exception as e:
            logger.debug(f"Error extracting price: {str(e)}")
        return None
    
    def _extract_stock_status(self, soup: BeautifulSoup) -> str:
        """Extract stock status from soup"""
        try:
            stock_elem = soup.find('div', class_='_2p6bF')
            if stock_elem:
                return stock_elem.text.strip()
        except Exception as e:
            logger.debug(f"Error extracting stock status: {str(e)}")
        return 'Available'
    
    def _extract_rating(self, soup: BeautifulSoup) -> Optional[float]:
        """Extract rating from soup"""
        try:
            rating_elem = soup.find('div', class_='_3LWZlK')
            if rating_elem:
                rating_text = rating_elem.text.strip()
                return float(rating_text.split()[0])
        except Exception as e:
            logger.debug(f"Error extracting rating: {str(e)}")
        return None
    
    def _extract_reviews_count(self, soup: BeautifulSoup) -> int:
        """Extract reviews count from soup"""
        try:
            reviews_elem = soup.find('span', class_='_3nVJvd')
            if reviews_elem:
                count_text = reviews_elem.text.strip()
                count = re.sub(r'[^0-9]', '', count_text)
                return int(count) if count else 0
        except Exception as e:
            logger.debug(f"Error extracting reviews count: {str(e)}")
        return 0
    
    def close(self):
        """Close the WebDriver"""
        if self.driver:
            self.driver.quit()
    
    def __enter__(self):
        """Context manager entry"""
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit"""
        self.close()


def scrape_flipkart_product(url: str) -> Optional[Dict]:
    """Convenience function to scrape a single product
    
    Args:
        url (str): Flipkart product URL
        
    Returns:
        dict: Product data or None
    """
    with FlipkartScraper() as scraper:
        return scraper.scrape_product(url)
