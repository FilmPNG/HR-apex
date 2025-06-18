import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiClock, FiFile, FiDownload, FiStar, FiBell, FiActivity, FiTerminal } from 'react-icons/fi';
import axios from 'axios';
import SideMenu from "../../Admin/SideMenu/Side_menu";
import Topbar from "../../Admin/Topbar/Topbar";
import './News_user.css';

const API_URL = 'http://localhost:5000/api/news/getnewsbyuser/';

function mapApiNewsData(apiData) {
  return apiData.map(item => ({
    NewsId: item.id.toString(),
    Title: item.topic,
    Category: getCategoryName(item.cate_news_id),
    Content: item.content,
    CreatedAt: item.create_date,
    AttachmentId: item.attachment_id || item.news_attachment_id || null,
    AttachmentPath: item.file_path || null,
    Attachment: item.file_name || null,
    isPinned: item.pin === 1 ? 1 : 0,
    Hidenews: item.hide === 1 ? 1 : 0
  }));
}

// Helper function to get category name based on cate_news_id
function getCategoryName(cateNewsId) {
  const categories = {
    1: 'Announcement',
    2: 'Activity', 
    3: 'IT',
    // เพิ่มหมวดหมู่อื่นๆ ตามต้องการ
  };
  return categories[cateNewsId] || 'General';
}

// Helper function to get attachment name (คุณอาจต้องปรับแต่งตามระบบไฟล์ของคุณ)
function getAttachmentName(attachmentId) {
  // ถ้ามี API สำหรับดึงข้อมูล attachment สามารถเรียกใช้ได้ที่นี่
  // หรือส่ง attachment name มาจาก API เลย
  return `attachment_${attachmentId}`;
}

export default function News_user() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [search, setSearch] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [pinnedNews, setPinnedNews] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    fetchNews();
  }, [navigate]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(API_URL);
      console.log('API Response:', response.data);
      
      // กรองข้อมูลที่ไม่ซ่อน (hide === 0) และแปลงข้อมูล
      const visibleNews = response.data.filter(item => item.hide === 0);
      const mappedNews = mapApiNewsData(visibleNews);
      
      // เรียงลำดับข่าวให้แสดง pin ก่อน แล้วเรียงตามวันที่
      const sortedNews = mappedNews.sort((a, b) => {
        if (a.isPinned !== b.isPinned) {
          return b.isPinned - a.isPinned;
        }
        return new Date(b.CreatedAt) - new Date(a.CreatedAt);
      });

      setNews(sortedNews);
      
      // Initialize pinned news state
      const pinnedSet = new Set(
        sortedNews.filter(item => item.isPinned === 1).map(item => item.NewsId)
      );
      setPinnedNews(pinnedSet);
      
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('ไม่สามารถดึงข้อมูลข่าวได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setViewModalOpen(true);
  };

  const isImageFile = (filename) => {
    if (!filename) return false;
    const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    return extensions.some(ext => filename.toLowerCase().endsWith(ext));
  };
  const getAttachmentPath = (item) => {
    // Try file_path first, then construct from file_name
    if (item.AttachmentPath) {
      return `http://localhost:5000${item.AttachmentPath}`;
    } else if (item.AttachmentPath) {
      return `http://localhost:5000${item.Attachment}`;
    }
    return null;
  };

  // Filter news based on search
  const filteredNews = news.filter(item => 
    item.Title?.toLowerCase().includes(search.toLowerCase()) ||
    item.Category?.toLowerCase().includes(search.toLowerCase()) ||
    item.Content?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="dashboard-container" data-user-role="user">
        <div className="dashboard-main">
          <SideMenu />
          <div className="dashboard-content">
            <Topbar pageTitle="News" pageSubtitle="Company News & Announcements" />
            <div className="news-card">
              <div className="loading-message">กำลังโหลดข้อมูล...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container" data-user-role="user">
        <div className="dashboard-main">
          <SideMenu />
          <div className="dashboard-content">
            <Topbar pageTitle="News" pageSubtitle="Company News & Announcements" />
            <div className="news-card">
              <div className="error-message">
                <p>{error}</p>
                <button onClick={fetchNews}>ลองใหม่อีกครั้ง</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container" data-user-role="user">
      <div className="dashboard-main">
        <ul className="circles">
          {[...Array(15)].map((_, i) => (
            <li key={i}></li>
          ))}
        </ul>
        
        <SideMenu />
        <div className="dashboard-content">
          <Topbar pageTitle="News" pageSubtitle="Company News & Announcements" />
          
          <div className="news-card">
            <div className="news-toolbar">
              <div className="news-search-wrap">
                <FiSearch className="news-search-icon" />
                <input
                  className="news-search"
                  type="text"
                  placeholder="Search news..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
            
            <div className="news-list-table">
              <table className="news-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNews.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="no-news">ไม่พบข่าวสาร</td>
                    </tr>
                  ) : filteredNews.map(item => (
                    <tr 
                      key={item.NewsId} 
                      className={pinnedNews.has(item.NewsId) ? 'pinned' : ''}
                      onClick={() => handleView(item)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {pinnedNews.has(item.NewsId) && (
                            <FiStar style={{ marginRight: '8px', color: '#F59E0B' }} />
                          )}
                          {item.Title}
                        </div>
                      </td>
                      <td>
                        <div className={`button ${item.Category.toLowerCase()}`}>
                          {item.Category === 'Announcement' ? (
                            <FiBell className="category-icon" />
                          ) : item.Category === 'Activity' ? (
                            <FiActivity className="category-icon" />
                          ) : (
                            <FiTerminal className="category-icon" />
                          )}
                          <span className="label">{item.Category}</span>
                        </div>
                      </td>
                      <td>{item.CreatedAt ? new Date(item.CreatedAt).toLocaleDateString('th-TH') : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {viewModalOpen && selectedItem && (
        <div className="modal-overlay">
          <div className="modal view-modal">
            <div className="modal-header">
              <div className="modal-title">
                <h3>{selectedItem.Title}</h3> 
                <div className={`button ${selectedItem.Category ? selectedItem.Category.toLowerCase() : 'default'}`}> 
                  {selectedItem.Category === 'Announcement' ? ( 
                    <FiBell className="category-icon" /> 
                  ) : selectedItem.Category === 'Activity' ? ( 
                    <FiActivity className="category-icon" /> 
                  ) : ( 
                    <FiTerminal className="category-icon" /> 
                  )} 
                  <span className="label">{selectedItem.Category || 'ไม่ระบุประเภท'}</span>
                  {pinnedNews.has(selectedItem.NewsId) && ( 
                    <FiStar style={{ marginLeft: '8px', color: '#F59E0B' }} /> 
                  )} 
                </div>
              </div>
              <button 
                className="close-btn" 
                onClick={() => {
                  setViewModalOpen(false);
                  setSelectedItem(null);
                }}
              >×</button>
            </div>
            <div className="view-content">
              <div className="view-meta">
                <div className="created-at">
                  <FiClock className="meta-icon" />
                  {new Date(selectedItem.CreatedAt).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              
              <div className="content-section">
                <div className="content-box">
                  {selectedItem.Content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
              

                            
              {selectedItem.Attachment && (
                <div className="attachment-section">
                  <div className="attachment-header">
                    <FiFile className="attachment-icon" />
                    ไฟล์แนบ
                  </div>
                  <div className="attachment-preview">
                    {isImageFile(selectedItem.file_name) ? (
                      <div className="image-preview-container">
                        <img 
                          src={getAttachmentPath(selectedItem)} 
                          alt="News attachment"
                          className="attachment-image"
                          onError={(e) => {
                            // Fallback if image fails to load
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div style={{ display: 'none' }} className="image-error">
                          <FiFile className="attachment-icon" />
                          <span>ไม่สามารถแสดงรูปภาพได้</span>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={async () => {
                          try {
                            const attachmentPath = getAttachmentPath(selectedItem);
                            if (!attachmentPath) {
                              console.error('No attachment path found');
                              alert('ไม่พบไฟล์แนบ');
                              return;
                            }

                            const response = await fetch(attachmentPath, {
                              method: 'GET',
                              // เพิ่ม headers ถ้าจำเป็น
                              // headers: {
                              //   'Authorization': 'Bearer ' + token,
                              // }
                            });

                            if (!response.ok) {
                              throw new Error(`HTTP error! status: ${response.status}`);
                            }

                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = selectedItem.Attachment || 'download';
                            link.style.display = 'none';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            window.URL.revokeObjectURL(url);
                            
                            console.log('Download completed'); // debug
                          } catch (error) {
                            console.error('Download failed:', error);
                            alert('ไม่สามารถดาวน์โหลดไฟล์ได้');
                          }
                        }}
                        className="attachment-link"
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '8px',
                          textDecoration: 'underline',
                          color: '#007bff'
                        }}
                      >
                        <span className="filename">
                          {selectedItem.Attachment || selectedItem.AttachmentPath?.split('/').pop() || 'ไฟล์แนบ'}
                        </span>
                        <FiDownload style={{ marginLeft: '8px' }} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}