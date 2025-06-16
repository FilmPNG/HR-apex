import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FiSearch, FiBell, FiChevronDown, FiUser, FiLogOut, FiFileText, FiDollarSign, FiMenu } from 'react-icons/fi'
import './Topbar.css'
import userImage from '../../../assets/profile.png'
import SideMenu from '../SideMenu/Side_menu'

function Topbar({ pageTitle = "Dashboard", pageSubtitle = "", onMobileMenuClick }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
  const currentHour = new Date().getHours()
  const employee = JSON.parse(localStorage.getItem('employee') || '{}');
  const role = localStorage.getItem('userRole') || 'employee';
  const avatar = employee.pic_path
  ? `http://localhost:5000${employee.pic_path}`
  : `https://ui-avatars.com/api/?name=${encodeURIComponent((employee.first_name || '') + ' ' + (employee.last_name || ''))}&background=random&rounded=true`;


  
  const userInfo = {
  name: `${employee.first_name || ''} ${employee.last_name || ''}`.trim(),
  role: role.charAt(0).toUpperCase() + role.slice(1), // แปลง admin -> Admin
  avatar,
  employeeId: `EMP${employee.employee_id || '0000000000'}`
  };
    // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: "ข่าวสารใหม่",
      message: "มีประกาศสำคัญเกี่ยวกับวันหยุดพิเศษ",
      time: "10 นาทีที่แล้ว",
      isRead: false,
      type: "news"
    },
    {
      id: 2,
      title: "การเบิกจ่ายได้รับการอนุมัติ",
      message: "คำขอเบิกค่าเดินทางของคุณได้รับการอนุมัติแล้ว",
      time: "2 ชั่วโมงที่แล้ว",
      isRead: false,
      type: "disbursement"
    },
    {
      id: 3,
      title: "แจ้งเตือนการเบิกจ่าย",
      message: "คุณมีรายการเบิกจ่ายที่ต้องดำเนินการ",
      time: "1 วันที่แล้ว",
      isRead: true,
      type: "disbursement"
    },
    {
      id: 4,
      title: "ข่าวประชาสัมพันธ์",
      message: "กิจกรรม Team Building วันที่ 1 มิถุนายน 2025",
      time: "2 วันที่แล้ว",
      isRead: true,
      type: "news"
    }
  ]

  const getGreeting = () => {
    if (currentHour < 12) return 'Good Morning'
    if (currentHour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  const handleLogout = () => {
    localStorage.removeItem('auth')
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('employee');
    navigate('/login', { replace: true });
  }

  const handleProfileClick = () => {
    setIsDropdownOpen(false)
    navigate(`/employee/${userInfo.employeeId}`)
  }

  const handleNotificationClick = (notificationId) => {
    // Handle notification click - you can mark as read, navigate, etc.
    console.log('Notification clicked:', notificationId)
  }

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen)
  }

  return (
    <>
      <SideMenu isOpen={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)} />
      <div className="topbar">
        <div className="left-section">
          <button className="mobile-menu-toggle" onClick={toggleSideMenu}>
            <FiMenu />
          </button>
          <div className="page-info">
            <h1 className="greeting mobile-disbursement-title">{pageTitle}</h1>
            <p className="sub-greeting">{pageSubtitle || getGreeting()}</p>  
          </div>
        </div>

        <div className="right-section">
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="notification-container">
            <button 
              className="notification-btn"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <FiBell className="bell-icon" />
              <span className="notification-badge">
                {notifications.filter(n => !n.isRead).length}
              </span>
            </button>

            <AnimatePresence>
              {isNotificationOpen && (
                <motion.div 
                  className="notifications-dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="notifications-header">
                    <h3>Notifications</h3>
                    <button className="mark-all-read">Mark all as read</button>
                  </div>
                  <div className="notifications-list">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        <div className={`notification-icon ${notification.type}`}>
                          {notification.type === 'news' && <FiFileText />}
                          {notification.type === 'disbursement' && <FiDollarSign />}
                        </div>
                        <div className="notification-content">
                          <h4>{notification.title}</h4>
                          <p>{notification.message}</p>
                          <span className="notification-time">{notification.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>                  <div className="notifications-footer">
                    <button onClick={() => {
                      setIsNotificationOpen(false);
                      navigate('/admin/notifications');
                    }}>
                      View All Notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="profile-dropdown">
            <button 
              className="profile-trigger"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img src={userInfo.avatar} alt="User" className="user-avatar" />
              <div className="user-info">
                <h3 className="user-name">{userInfo.name}</h3>
                <p className="user-role">{userInfo.role}</p>
              </div>
              <FiChevronDown className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  className="dropdown-menu"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <button onClick={handleProfileClick}>
                    <FiUser />
                    My Profile
                  </button>
                  <button onClick={handleLogout}>
                    <FiLogOut />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  )
}

export default Topbar