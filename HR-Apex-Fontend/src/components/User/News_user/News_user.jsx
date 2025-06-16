import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiClock, FiFile, FiDownload, FiStar, FiBell, FiActivity, FiTerminal } from 'react-icons/fi';
import axios from 'axios';
import SideMenu from "../../Admin/SideMenu/Side_menu";
import Topbar from "../../Admin/Topbar/Topbar";
import './News_user.css';

const API_URL = `${import.meta.env.VITE_API_URL}/api/news`;

// Mock news data for user role
const mockNews = [
  {
    NewsId: "NEWS001",
    Title: "Company Annual Team Building Event",
    Category: "Activity",
    Content: "Get ready for an exciting day of team building and fun! Our annual company event will be held at Paradise Beach Resort.\n\nDate: July 15th, 2025\nTime: 9:00 AM - 5:00 PM\n\nActivities include:\n- Team building exercises\n- Beach sports\n- Group lunch\n- Awards ceremony\n\nPlease RSVP by July 1st through the HR portal.",
    CreatedAt: "2025-06-08T10:00:00",
    Attachment: "team_building_2025.jpg",
    isPinned: 1,
    Hidenews: 0
  },
  {
    NewsId: "NEWS002",
    Title: "New Health Insurance Benefits",
    Category: "Announcement",
    Content: "We are pleased to announce improvements to our health insurance coverage starting July 1st, 2025.\n\nKey updates:\n- Increased dental coverage\n- New mental health support services\n- Extended family coverage options\n- Improved prescription benefits\n\nPlease review the attached documentation for full details.",
    CreatedAt: "2025-06-07T14:30:00",
    Attachment: "health_benefits_2025.pdf",
    isPinned: 1,
    Hidenews: 0
  },
  {
    NewsId: "NEWS003",
    Title: "Office Software Updates",
    Category: "IT",
    Content: "Important system updates will be installed this weekend.\n\nUpdate Schedule:\n- Start: Saturday, June 14th, 22:00\n- End: Sunday, June 15th, 04:00\n\nAction Required:\n- Save all work before leaving on Friday\n- Keep your laptops powered on and connected to the network\n\nNew features include improved security and performance enhancements.",
    CreatedAt: "2025-06-06T09:15:00",
    Attachment: "system_update_guide.pdf",
    isPinned: 0,
    Hidenews: 0
  },
  {
    NewsId: "NEWS004",
    Title: "Quarterly Town Hall Meeting",
    Category: "Announcement",
    Content: "Join us for our Q2 2025 Town Hall Meeting!\n\nDate: June 20th, 2025\nTime: 2:00 PM - 4:00 PM\nLocation: Main Conference Room & Virtual\n\nAgenda:\n- Q2 Performance Review\n- New Project Announcements\n- Employee Recognition\n- Q&A Session\n\nVirtual meeting link will be sent 1 hour before the event.",
    CreatedAt: "2025-06-05T11:20:00",
    Attachment: "town_hall_agenda.pdf",
    isPinned: 0,
    Hidenews: 0
  },
  {
    NewsId: "NEWS005",
    Title: "New Office Layout",
    Category: "Announcement",
    Content: "We're excited to announce our new office layout plan starting next month.\n\nChanges include:\n- New collaborative spaces\n- Updated meeting rooms\n- Improved break areas\n- Additional quiet zones\n\nPlease check the attached map for your new seating arrangement.",
    CreatedAt: "2025-06-04T15:45:00",
    Attachment: "new_office_layout.pdf",
    isPinned: 0,
    Hidenews: 0
  }
];

function mapApiNewsData(apiData) {
  return apiData.map(item => ({
    NewsId: item.newsId,
    Title: item.title,
    Category: item.category,
    Content: item.content,
    CreatedAt: item.created_at,
    Attachment: item.attachment,
    isPinned: item.isPinned === true || item.isPinned === 1 ? 1 : 0,
    Hidenews: item.Hidenews === true || item.Hidenews === 1 ? 1 : 0
  }));
}

export default function News_user() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [search, setSearch] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [pinnedNews, setPinnedNews] = useState(new Set());

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
      // Sort news to show pinned items first, then by date
      const sortedNews = mockNews
        .filter(item => !item.Hidenews) // Only show non-hidden news for users
        .sort((a, b) => {
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

  // Filter news based on search
  const filteredNews = news.filter(item => 
    item.Title?.toLowerCase().includes(search.toLowerCase()) ||
    item.Category?.toLowerCase().includes(search.toLowerCase()) ||
    item.Content?.toLowerCase().includes(search.toLowerCase())
  );

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
                      <td colSpan="3" className="no-news">No news found</td>
                    </tr>
                  ) : filteredNews.map(item => (
                    <tr 
                      key={item.NewsId} 
                      className={pinnedNews.has(item.NewsId) ? 'pinned' : ''}
                      onClick={() => handleView(item)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>{item.Title}</td>
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
                      <td>{item.CreatedAt ? new Date(item.CreatedAt).toLocaleDateString() : '-'}</td>
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
                <div className={`button ${selectedItem.Category.toLowerCase()}`}>
                  {selectedItem.Category === 'Announcement' ? (
                    <FiBell className="category-icon" />
                  ) : selectedItem.Category === 'Activity' ? (
                    <FiActivity className="category-icon" />
                  ) : (
                    <FiTerminal className="category-icon" />
                  )}
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
                  {new Date(selectedItem.CreatedAt).toLocaleDateString('en-US', {
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
                    Attachment
                  </div>
                  <div className="attachment-preview">
                    {isImageFile(selectedItem.Attachment) ? (
                      <div className="image-preview-container">
                        <img 
                          src={`/uploads/${selectedItem.Attachment}`} 
                          alt="News attachment"
                          className="attachment-image"
                        />
                      </div>
                    ) : (
                      <a 
                        href={`/uploads/${selectedItem.Attachment}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="attachment-link"
                      >
                        <span className="filename">{selectedItem.Attachment}</span>
                        <FiDownload style={{ marginLeft: '8px' }} />
                      </a>
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
