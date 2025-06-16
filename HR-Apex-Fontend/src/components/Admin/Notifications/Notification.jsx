import { useState } from 'react';
import { FiCheckCircle, FiFileText, FiDollarSign, FiClock } from 'react-icons/fi';
import SideMenu from '../SideMenu/Side_menu.jsx';
import Topbar from '../Topbar/Topbar.jsx';
import './Notification.css';

const Notification = () => {
  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: "ข่าวสารใหม่",
      message: "มีประกาศสำคัญเกี่ยวกับวันหยุดพิเศษประจำปี 2025",
      time: "10 นาทีที่แล้ว",
      isRead: false,
      type: "news"
    },
    {
      id: 2,
      title: "การเบิกจ่ายได้รับการอนุมัติ",
      message: "คำขอเบิกค่าเดินทางของคุณ #REQ-20250528-001 ได้รับการอนุมัติแล้ว",
      time: "2 ชั่วโมงที่แล้ว",
      isRead: false,
      type: "disbursement"
    },
    {
      id: 3,
      title: "แจ้งเตือนการเบิกจ่าย",
      message: "คุณมีรายการเบิกจ่ายที่รอการดำเนินการ 3 รายการ",
      time: "1 วันที่แล้ว",
      isRead: true,
      type: "disbursement"
    },
    {
      id: 4,
      title: "ข่าวประชาสัมพันธ์",
      message: "กิจกรรม Team Building ประจำปี 2025 วันที่ 1 มิถุนายน 2025 ณ โรงแรม...",
      time: "2 วันที่แล้ว",
      isRead: true,
      type: "news"
    },
    {
      id: 5,
      title: "แจ้งเตือนการประชุม",
      message: "การประชุมทีมประจำเดือนพฤษภาคม 2025 จะเริ่มในอีก 30 นาที",
      time: "3 วันที่แล้ว",
      isRead: true,
      type: "reminder"
    }
  ];

  const [activeTab, setActiveTab] = useState('all');  const filterNotifications = (tab) => {
    switch (tab) {
      case 'unread':
        return notifications.filter(n => !n.isRead);
      case 'news':
        return notifications.filter(n => n.type === 'news');
      case 'disbursement':
        return notifications.filter(n => n.type === 'disbursement');
      default:
        return notifications;
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'news':
        return <FiFileText className="notification-icon news" />;
      case 'disbursement':
        return <FiDollarSign className="notification-icon disbursement" />;
      case 'reminder':
        return <FiClock className="notification-icon reminder" />;
      default:
        return <FiCheckCircle className="notification-icon" />;
    }
  };
  return (
    <div className="notification dashboard-container">
      <SideMenu />
      <div className="notification dashboard-main">
        <Topbar pageTitle="การแจ้งเตือน" pageSubtitle="จัดการการแจ้งเตือนทั้งหมด" />
        
        <div className="notifications-page">
          <div className="notification-tabs">
            <button 
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              ทั้งหมด
              <span className="count">{notifications.length}</span>
            </button>
            <button 
              className={`tab ${activeTab === 'unread' ? 'active' : ''}`}
              onClick={() => setActiveTab('unread')}
            >
              ยังไม่ได้อ่าน
              <span className="count">{notifications.filter(n => !n.isRead).length}</span>
            </button>
            <button 
              className={`tab ${activeTab === 'news' ? 'active' : ''}`}
              onClick={() => setActiveTab('news')}
            >
              ข่าวสาร
            </button>
            <button 
              className={`tab ${activeTab === 'disbursement' ? 'active' : ''}`}
              onClick={() => setActiveTab('disbursement')}
            >
              การเบิกจ่าย
            </button>
          </div>

          <div className="notifications-container">
            <div className="notifications-list">
              {filterNotifications(activeTab).map(notification => (                <div 
                  key={notification.id}
                  className={`notification-card ${notification.isRead ? 'read' : 'unread'}`}
                >
                  <div className="notification-header">
                    {getIcon(notification.type)}
                    <div className="notification-info">
                      <h3>{notification.title}</h3>
                      <span className="time">{notification.time}</span>
                    </div>
                  </div>
                  <p className="notification-message">{notification.message}</p>
                  {!notification.isRead && <div className="unread-indicator" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;