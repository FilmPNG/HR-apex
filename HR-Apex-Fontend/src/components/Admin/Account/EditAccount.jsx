import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import SideMenu from '../SideMenu/Side_menu';
import Topbar from '../Topbar/Topbar';
import './EditAccount.css';
import '../AnimationCircles/AnimationCircles.css';

// Add mock data
const MOCK_USER_DATA = {
  "ACC001": {
    EmployeeId: "ACC001",
    FName: "Sarah",
    LName: "Johnson", 
    username: "sarah.j",
    email: "sarah.j@company.com"
  },
  "ACC002": {
    EmployeeId: "ACC002", 
    FName: "Michael",
    LName: "Chen",
    username: "michael.c",
    email: "michael.c@company.com"
  }
};

const EditAccount = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState('Active');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [userData, setUserData] = useState(null);
  const [createDate] = useState(new Date().toISOString().split('T')[0]); // เพิ่ม create date

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Use mock data instead of API call
        const mockUser = MOCK_USER_DATA[id];
        if (mockUser) {
          setUserData(mockUser);
          setUsername(mockUser.username || '');
        } else {
          throw new Error('User not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setMessage({ type: 'error', text: 'Failed to load user data' });
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simulate API success
      setMessage({ type: 'success', text: 'Account updated successfully!' });
      setTimeout(() => navigate('/account'), 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update account' });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match!' });
      return;
    }
    try {
      // Simulate API success
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => navigate('/account'), 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update password' });
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="account dashboard-container">
      <ul className="circles">
        {[...Array(25)].map((_, i) => <li key={i}></li>)}
      </ul>
      <ul className="circles-bottom">
        {[...Array(25)].map((_, i) => <li key={`bottom-${i}`}></li>)}
      </ul>
      
      <SideMenu 
        isMinimized={isMinimized} 
        onToggleMinimize={() => setIsMinimized(!isMinimized)} 
      />
      
      <div className="account dashboard-main">
        <div className="account dashboard-content">
          <Topbar pageTitle="Account Settings" pageSubtitle="Manage your account security" />
          
          <div className="security-container">
            {/* Information Section - Centered at top */}
            <div className="security-section information-section">
              <h3>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Information
              </h3>
              <div className="information-content">
                <div className="info-item">
                  <span className="info-label">ID:</span>
                  <span className="info-value">{userData?.EmployeeId}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Create Date:</span>
                  <span className="info-value">{createDate}</span>
                </div>
              </div>
            </div>

            {/* Container for Edit Account and Password sections */}
            <div className="account-password-container">
              {/* Edit Account Section */}
              <div className="security-section">
                <h3>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Edit Account for {userData.FName} {userData.LName}
                </h3>
                <form onSubmit={handleUsernameSubmit} className="security-form">
                  <div className="form-group">
                    <label>New Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter new username"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <select 
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="status-select"
                    >
                      <option value="" disabled>Select Role</option>
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select 
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="status-select"
                    >
                      <option value="" disabled>Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">InActive</option>
                    </select>
                  </div>
                  <button type="submit">Update Username</button>
                </form>
              </div>

              {/* Password Section */}
              <div className="security-section">
                <h3>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Password
                </h3>
                <form onSubmit={handlePasswordSubmit} className="security-form">
                  <div className="form-group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                  <button type="submit">Update Password</button>
                </form>
              </div>
            </div>

            {message.text && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAccount;
