import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile, getUserProfile } from '../services/api';
import './UserProfile.css';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    joinDate: '',
    totalTrackedProducts: 0,
    totalAlerts: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserProfile();
      setProfile(response.data || {});
      setError('');
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateUserProfile(profile);
      setSaved(true);
      setIsEditing(false);
      setError('');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError('Failed to save profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchProfile();
  };

  const handleLogout = () => {
    logout();
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      // Call API to delete account
      // await deleteUserAccount();
      logout();
    } catch (err) {
      setError('Failed to delete account');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="user-profile">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  if (loading && !profile.email) {
    return (
      <div className="user-profile">
        <div className="loading-spinner">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="profile-info">
          <h2>{profile.fullName || 'User Profile'}</h2>
          <p>{profile.email}</p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {saved && <div className="success-message">Profile updated successfully!</div>}

      <div className="profile-content">
        <div className="profile-section">
          <h3>Personal Information</h3>

          {isEditing ? (
            <div className="edit-form">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  disabled={loading}
                />
              </div>

              <div className="form-actions">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="save-btn"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-display">
              <div className="info-row">
                <span className="label">Full Name:</span>
                <span className="value">{profile.fullName || 'Not set'}</span>
              </div>
              <div className="info-row">
                <span className="label">Email:</span>
                <span className="value">{profile.email}</span>
              </div>
              <div className="info-row">
                <span className="label">Phone:</span>
                <span className="value">{profile.phoneNumber || 'Not set'}</span>
              </div>
              <div className="info-row">
                <span className="label">Member Since:</span>
                <span className="value">
                  {profile.joinDate ? new Date(profile.joinDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="profile-section">
          <h3>Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{profile.totalTrackedProducts || 0}</div>
              <div className="stat-label">Tracked Products</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{profile.totalAlerts || 0}</div>
              <div className="stat-label">Alerts Received</div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-actions">
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            disabled={loading}
            className="edit-btn"
          >
            Edit Profile
          </button>
        )}
        <button
          onClick={handleLogout}
          disabled={loading}
          className="logout-btn"
        >
          Logout
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          disabled={loading}
          className="delete-btn"
        >
          Delete Account
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Delete Account?</h3>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="confirm-delete-btn"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
                className="cancel-modal-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
