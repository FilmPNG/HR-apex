import React, { useState } from 'react';
import { FiUser, FiLock, FiMonitor, FiBell, FiMail, FiShield } from 'react-icons/fi';
import SideMenu from '../SideMenu/Side_menu';
import Topbar from '../Topbar/Topbar';
import { useTheme } from '../../../context/ThemeContext';
import './setting.css';

const Setting = () => {
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('account');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const settingTabs = [
    { id: 'account', label: 'Account Settings', icon: <FiUser /> },
    { id: 'security', label: 'Security', icon: <FiLock /> },
    { id: 'appearance', label: 'Appearance', icon: <FiMonitor /> },
    { id: 'notifications', label: 'Notifications', icon: <FiBell /> },
    { id: 'email', label: 'Email Settings', icon: <FiMail /> },
    { id: 'privacy', label: 'Privacy', icon: <FiShield /> },
  ];

  return (
    <div className="dashboard-container">
      <SideMenu 
        isMinimized={isMinimized} 
        onToggleMinimize={() => setIsMinimized(!isMinimized)}
        mobileOpen={isMobileMenuOpen}
        onMobileMenuToggle={handleMobileMenuToggle}
      />
      <div className="dashboard-main">
        <ul className="circles">
          {[...Array(15)].map((_, i) => (
            <li key={`top-${i}`}></li>
          ))}
        </ul>
        
        <ul className="circles-bottom">
          {[...Array(15)].map((_, i) => (
            <li key={`bottom-${i}`}></li>
          ))}
        </ul>

        <div className="dashboard-content">
          <Topbar 
            pageTitle="Settings" 
            pageSubtitle="Manage your account settings and preferences"
            onMobileMenuClick={handleMobileMenuToggle}
          />
          
          <div className="settings-container">
            <div className="settings-sidebar">
              {settingTabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`setting-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="settings-content">
              {activeTab === 'account' && (
                <div className="settings-section">
                  <h2>Account Settings</h2>
                  <div className="settings-form">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" placeholder="John Doe" />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" placeholder="john@example.com" />
                    </div>
                    <div className="form-group">
                      <label>Position</label>
                      <input type="text" placeholder="Software Developer" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="settings-section">
                  <h2>Appearance Settings</h2>
                  <div className="settings-form">
                    <div className="theme-setting">
                      <span>Theme Mode</span>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={isDark}
                          onChange={toggleTheme}
                        />
                        <span className="slider"></span>
                      </label>
                      <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="settings-section">
                  <h2>Security Settings</h2>
                  <div className="settings-form">
                    <div className="form-group">
                      <label>Current Password</label>
                      <input type="password" placeholder="Enter current password" />
                    </div>
                    <div className="form-group">
                      <label>New Password</label>
                      <input type="password" placeholder="Enter new password" />
                    </div>
                    <div className="form-group">
                      <label>Confirm Password</label>
                      <input type="password" placeholder="Confirm new password" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="settings-section">
                  <h2>Notification Preferences</h2>
                  <div className="settings-form">
                    <div className="notification-setting">
                      <label className="checkbox-container">
                        <span>Email Notifications</span>
                        <input type="checkbox" defaultChecked />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                    <div className="notification-setting">
                      <label className="checkbox-container">
                        <span>Push Notifications</span>
                        <input type="checkbox" defaultChecked />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                    <div className="notification-setting">
                      <label className="checkbox-container">
                        <span>Leave Request Updates</span>
                        <input type="checkbox" defaultChecked />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;