import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideMenu from '../SideMenu/Side_menu';
import Topbar from '../Topbar/Topbar';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import './Account.css';
import '../AnimationCircles/AnimationCircles.css';
import { useNavigate } from 'react-router-dom';

const MOCK_ACCOUNTS = [
  {
    id: "ACC001",
    employeeId: "EMP001",
    fullName: "Sarah Johnson",
    nickname: "Sara",
    username: "sarah.j",
    email: "sarah.j@company.com",
    status: "Active",
    imageUrl: "https://randomuser.me/api/portraits/women/32.jpg"
  },
  {
    id: "ACC002",
    employeeId: "EMP002",
    fullName: "Michael Chen",
    nickname: "Mike",
    username: "michael.c",
    email: "michael.c@company.com",
    status: "Active",
    imageUrl: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    id: "ACC003",
    employeeId: "EMP003",
    fullName: "Emma Wilson",
    nickname: "Em",
    username: "emma.w",
    email: "emma.w@company.com",
    status: "Active",
    imageUrl: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    id: "ACC004",
    employeeId: "EMP004",
    fullName: "David Thompson",
    nickname: "Dave",
    username: "david.t",
    email: "david.t@company.com",
    status: "Inactive",
    imageUrl: "https://randomuser.me/api/portraits/men/22.jpg"
  },
  {
    id: "ACC005",
    employeeId: "EMP005",
    fullName: "Lisa Garcia",
    nickname: "Lis",
    username: "lisa.g",
    email: "lisa.g@company.com",
    status: "Active",
    imageUrl: "https://randomuser.me/api/portraits/women/89.jpg"
  }
];

const Account = () => {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // ตรวจสอบ authentication
    const token = localStorage.getItem('token');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');

    // ถ้ายังไม่ล็อกอิน ให้กลับไปหน้า login
    if (!token || !isLoggedIn) {
      navigate('/login');
      return;
    }

    // ถ้า role ไม่ใช่ admin ไม่ให้เข้า
    if (userRole !== 'admin' && userRole !== 'superadmin') {
      navigate('/not-authorized');
      return;
    }




    const fetchAccounts = async () => {
      try {
        setIsLoading(true);
        // Replace API call with mock data
        setAccounts(MOCK_ACCOUNTS);
        setError(null);
      } catch (err) {
        console.error('Error fetching accounts:', err);
        setError('Failed to load accounts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const handleEdit = async (id) => {
    navigate(`/edit-account/${id}`);
  };

  const handleDelete = async (id) => {
    setAccountToDelete(accounts.find(account => account.id === id));
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    try {
      // Remove API call and just update state
      setAccounts(accounts.filter(account => account.id !== accountToDelete.id));
      setShowDeletePopup(false);
      setAccountToDelete(null);
    } catch (err) {
      console.error('Error deleting account:', err);
      alert('Failed to delete account');
    }
  };

  const filteredAccounts = accounts.filter(account =>
    Object.values(account).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="account dashboard-container">
      <ul className="circles">
        {[...Array(25)].map((_, i) => (
          <li key={i}></li>
        ))}
      </ul>
      <ul className="circles-bottom">
        {[...Array(25)].map((_, i) => (
          <li key={`bottom-${i}`}></li>
        ))}
      </ul>
      <SideMenu 
        isMinimized={isMinimized} 
        onToggleMinimize={setIsMinimized}
        mobileOpen={isMobileMenuOpen}
      />
      <div className="account dashboard-main">
        <div className="account dashboard-content">
          <Topbar 
            pageTitle="Account Management" 
            pageSubtitle="Manage user accounts" 
            onMobileMenuClick={handleMobileMenuToggle}
          />
          <div className="account-container">
            <div className="account-header">
              <div className="account-search-bar">
                <FaSearch className="account-search-icon" />
                <input
                  type="text"
                  placeholder="Search accounts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="account-table-container">
              <table className="account-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Employee ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.map((account) => (
                    <tr key={account.id}>
                      <td className="account-user-cell">
                        <img 
                          src={account.imageUrl}
                          alt={account.fullName}
                          onError={(e) => {e.target.src = '/src/assets/profile.png'}}
                          className="account-user-image"
                        />
                        <div className="account-user-info">
                          <span className="account-user-name">{account.fullName}</span>
                          {account.nickname !== '-' && 
                            <span className="account-user-nickname">({account.nickname})</span>
                          }
                        </div>
                      </td>
                      <td>{account.employeeId}</td>
                      <td>{account.username}</td>
                      <td>{account.email}</td>
                      <td>
                        <span className={`account-status-badge ${account.status.toLowerCase()}`}>
                          {account.status}
                        </span>
                      </td>
                      <td className="account-actions">
                        <button
                          className="account-edit-btn"
                          onClick={() => handleEdit(account.id)}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="account-delete-btn"
                          onClick={() => handleDelete(account.id)}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="delete-popup-overlay">
          <div className="delete-popup">
            <div className="delete-popup-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this leave type? This action cannot be undone.</p>
            <div className="delete-popup-buttons">
              <button 
                className="cancel-btn"
                onClick={() => setShowDeletePopup(false)}
              >
                Cancel
              </button>
              <button 
                className="delete-btn"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;