import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUserSettings, getUserSettings } from '../services/api';
import './NotificationSettings.css';

const NotificationSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    priceDropAlert: true,
    priceIncreaseAlert: false,
    weeklyReport: true,
    alertThreshold: 5, // percentage
    email: user?.email || '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSettings();
  }, [user]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await getUserSettings();
      setSettings(prev => ({
        ...prev,
        ...response.data,
      }));
      setError('');
    } catch (err) {
      setError('Failed to load settings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateUserSettings(settings);
      setSaved(true);
      setError('');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError('Failed to save settings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="notification-settings">
        <p>Please log in to manage notification settings.</p>
      </div>
    );
  }

  return (
    <div className="notification-settings">
      <h2>Notification Settings</h2>

      {error && <div className="error-message">{error}</div>}
      {saved && <div className="success-message">Settings saved successfully!</div>}

      <div className="settings-section">
        <h3>Notification Channels</h3>

        <div className="setting-item">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="emailNotifications"
              name="emailNotifications"
              checked={settings.emailNotifications}
              onChange={handleChange}
              disabled={loading}
            />
            <label htmlFor="emailNotifications">Email Notifications</label>
          </div>
          <p className="setting-description">Receive alerts via email</p>
        </div>

        <div className="setting-item">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="smsNotifications"
              name="smsNotifications"
              checked={settings.smsNotifications}
              onChange={handleChange}
              disabled={loading}
            />
            <label htmlFor="smsNotifications">SMS Notifications</label>
          </div>
          <p className="setting-description">Receive alerts via SMS (premium feature)</p>
        </div>
      </div>

      <div className="settings-section">
        <h3>Alert Preferences</h3>

        <div className="setting-item">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="priceDropAlert"
              name="priceDropAlert"
              checked={settings.priceDropAlert}
              onChange={handleChange}
              disabled={loading}
            />
            <label htmlFor="priceDropAlert">Price Drop Alerts</label>
          </div>
          <p className="setting-description">Get notified when prices decrease</p>
        </div>

        <div className="setting-item">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="priceIncreaseAlert"
              name="priceIncreaseAlert"
              checked={settings.priceIncreaseAlert}
              onChange={handleChange}
              disabled={loading}
            />
            <label htmlFor="priceIncreaseAlert">Price Increase Alerts</label>
          </div>
          <p className="setting-description">Get notified when prices increase</p>
        </div>

        <div className="setting-item">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="weeklyReport"
              name="weeklyReport"
              checked={settings.weeklyReport}
              onChange={handleChange}
              disabled={loading}
            />
            <label htmlFor="weeklyReport">Weekly Report</label>
          </div>
          <p className="setting-description">Receive weekly summary of tracked products</p>
        </div>

        <div className="setting-item">
          <label htmlFor="alertThreshold">Price Alert Threshold (%)</label>
          <input
            type="number"
            id="alertThreshold"
            name="alertThreshold"
            min="1"
            max="50"
            value={settings.alertThreshold}
            onChange={handleChange}
            disabled={loading}
            className="threshold-input"
          />
          <p className="setting-description">Alert when price changes by this percentage</p>
        </div>
      </div>

      <div className="settings-section">
        <h3>Contact Information</h3>

        <div className="setting-item">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={settings.email}
            onChange={handleChange}
            disabled={loading}
            className="contact-input"
          />
        </div>

        <div className="setting-item">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={settings.phoneNumber}
            onChange={handleChange}
            disabled={loading}
            placeholder="+1 (555) 000-0000"
            className="contact-input"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="save-button"
      >
        {loading ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
};

export default NotificationSettings;
