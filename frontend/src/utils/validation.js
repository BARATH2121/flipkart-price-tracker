import { VALIDATION } from './constants'

// Validate email
export const validateEmail = (email) => {
  return VALIDATION.EMAIL.test(email)
}

// Validate password
export const validatePassword = (password) => {
  return password && password.length >= VALIDATION.PASSWORD_MIN_LENGTH
}

// Validate Flipkart URL
export const validateFlipkartURL = (url) => {
  if (!url) return false
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.includes('flipkart.com')
  } catch {
    return false
  }
}

// Validate form data for login
export const validateLoginForm = (email, password) => {
  const errors = {}
  
  if (!email) {
    errors.email = 'Email is required'
  } else if (!validateEmail(email)) {
    errors.email = 'Invalid email address'
  }
  
  if (!password) {
    errors.password = 'Password is required'
  } else if (!validatePassword(password)) {
    errors.password = `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`
  }
  
  return { isValid: Object.keys(errors).length === 0, errors }
}

// Validate form data for registration
export const validateRegisterForm = (username, email, password, confirmPassword, phone) => {
  const errors = {}
  
  if (!username || username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters'
  }
  
  if (!email) {
    errors.email = 'Email is required'
  } else if (!validateEmail(email)) {
    errors.email = 'Invalid email address'
  }
  
  if (!password) {
    errors.password = 'Password is required'
  } else if (!validatePassword(password)) {
    errors.password = `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`
  }
  
  if (!confirmPassword || confirmPassword !== password) {
    errors.confirmPassword = 'Passwords do not match'
  }
  
  if (phone && !/^[0-9]{10}$/.test(phone)) {
    errors.phone = 'Phone must be a valid 10-digit number'
  }
  
  return { isValid: Object.keys(errors).length === 0, errors }
}
