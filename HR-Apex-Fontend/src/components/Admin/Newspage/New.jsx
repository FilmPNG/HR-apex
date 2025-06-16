import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiEdit, FiTrash2, FiEye, FiPlus, FiPaperclip, FiSearch, FiClock, FiFile, FiDownload, FiStar, FiBell, FiActivity, FiTerminal, FiLock, FiUnlock, FiMoreVertical, FiChevronDown } from 'react-icons/fi';
import './New.css';
import './EditNewsModal.css';
import SideMenu from "../SideMenu/Side_menu";
import Topbar from "../Topbar/Topbar";

const API_URL = `http://localhost:5000/api/news/getnewsbyadmin/`;
const API_URL2 = `http://localhost:5000/api/news/updatenews/`;
const CREATE_URL = `http://localhost:5000/api/news/createnews`;

// Updated helper function to convert category ID to category name
function getCategoryName(cateNewsId) {
  const categoryMap = {
    1: 'Announcement',
    2: 'Activity', 
    3: 'IT'
  };
  return categoryMap[cateNewsId] || 'Unknown';
}

// Get category ID from name (for form submission)
function getCategoryId(categoryName) {
  const categoryMap = {
    'Announcement': 1,
    'Activity': 2,
    'IT': 3
  };
  return categoryMap[categoryName] || 1;
}

// Updated function to map API data to UI format
function mapApiNewsData(apiData) {
  return apiData.map(item => ({
    NewsId: item.id,
    Title: item.topic || 'Untitled',
    Category: getCategoryName(item.cate_news_id),
    Content: item.content || '',
    CreatedAt: item.create_date,
    ModifyDate: item.modify_date,
    // Fix: Use file_name instead of attachment_id for the attachment filename
    Attachment: item.file_name || null,
    // Fix: Check for pin value of 1 (not boolean)
    isPinned: item.pin === 1,
    // Fix: Check for hide value of 1 (not boolean)  
    Hidenews: item.hide === 1,
    Status: item.status || 'ACTIVE',
    // Additional fields that might be useful
 
    AttachmentPath: item.file_path || null,
    AttachmentId: item.attachment_id || item.news_attachment_id || null,
    PinOrder: item.pin_order,
    PinnedAt: item.pinned_at
  }));
}

function New() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    title: '',
    category: '',
    content: '',
    file_name : null
  });
  const [preview, setPreview] = useState(null);
  const [search, setSearch] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [hiddenNews, setHiddenNews] = useState(new Set());
  const [pinnedNews, setPinnedNews] = useState(new Set());
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const categories = [
    { value: 'Announcement', label: 'Announcement' },
    { value: 'Activity', label: 'Activity' },
    { value: 'IT', label: 'IT' }
  ];

  useEffect(() => {
    fetchNews();
  }, []);

  // Updated fetchNews function with better error handling
  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(API_URL);
      console.log('API Response:', response.data); // Debug log

      if (response.data && Array.isArray(response.data)) {
        const mappedNews = mapApiNewsData(response.data);
        console.log('Mapped News:', mappedNews); // Debug log

        // Sort by pinned first, then by creation date (newest first)
        const sortedNews = mappedNews.sort((a, b) => {
          // First sort by pinned status
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          
          // Then sort by creation date (newest first)
          return new Date(b.CreatedAt) - new Date(a.CreatedAt);
        });

        setNews(sortedNews);

        // Update hidden and pinned sets
        const hiddenSet = new Set(
          mappedNews.filter(item => item.Hidenews === true).map(item => item.NewsId)
        );
        const pinnedSet = new Set(
          mappedNews.filter(item => item.isPinned === true).map(item => item.NewsId)
        );

        setHiddenNews(hiddenSet);
        setPinnedNews(pinnedSet);

      } else {
        throw new Error('Invalid data format received from API');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setError(error.message || 'Failed to fetch news');
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const getMySQLDateTime = () => {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
  };

  const handleTogglePin = async (newsId) => {
    try {
      const isCurrentlyPinned = pinnedNews.has(newsId);

      const payload = {
        isPinned: isCurrentlyPinned ? 0 : 1,
        pinOrder: isCurrentlyPinned ? null : getMySQLDateTime(),
      };

      const response = await axios.patch(`http://localhost:5000/api/news/pin/${newsId}`, payload);

      if (response.data.success) {
        await fetchNews(); // ดึงข้อมูลใหม่
      } else {
        throw new Error(response.data.message || 'Failed to update pin status');
      }
    } catch (error) {
      console.error('Error toggling pin status:', error);
      alert(error.response?.data?.error || error.message || 'Failed to update pin status. Please try again.');
    }
  };

  const handleOpenModal = (item = null) => {
    setEditItem(item);
    if (item) {
      setForm({
        title: item.Title,
        category: item.Category,
        content: item.Content,
        file_name: null
      });
      // Updated preview logic
      setPreview(getAttachmentPath(item));
    } else {
      setForm({ title: '', category: '', content: '', file_name: null });
      setPreview(null);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditItem(null);
    setForm({ title: '', category: '', content: '', file_name: null });
    setPreview(null);
  };

  const handleChange = e => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setForm(f => ({ ...f, [name]: checked }));
    } else if (type === 'file') {
      setForm(f => ({ ...f, attachment: files[0] }));
      if (files[0]) {
        setPreview(URL.createObjectURL(files[0]));
      }
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleToggleVisibility = async (id) => {
    try {
      if (hiddenNews.has(id)) {
        // ถ้าข่าวนี้อยู่ใน hiddenNews (ซ่อนอยู่) ให้เรียก unhide API
        await fetch(`http://localhost:5000/api/news/unhide/${id}`, {
          method: 'PUT',
        });
        // อัปเดตสถานะใน hiddenNews ว่าไม่ซ่อนแล้ว
        setHiddenNews((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      } else {
        // ถ้าข่าวนี้ไม่อยู่ใน hiddenNews (แสดงอยู่) ให้เรียก hide API
        await fetch(`http://localhost:5000/api/news/hide/${id}`, {
          method: 'PUT',
        });
        // อัปเดตสถานะใน hiddenNews ว่าซ่อนแล้ว
        setHiddenNews((prev) => new Set(prev).add(id));
      }
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
    }
  };

  // Updated handleSubmit function to handle form data properly
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('topic', form.title); // API expects 'topic'
      formData.append('cate_news_id', getCategoryId(form.category));
      formData.append('content', form.content);
      
      if (form.flie_name) {
        formData.append('flie_name', form.flie_name);
      }

      let response;
      if (editItem) {
        // Update existing news
        response = await axios.put(`http://localhost:5000/api/news/updatenews/${editItem.NewsId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Create new news
        response = await axios.post(CREATE_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      if (response.data.success || response.status === 200 || response.status === 201) {
        await fetchNews();
        handleCloseModal();
        alert(editItem ? 'News updated successfully!' : 'News created successfully!');
      } else {
        throw new Error(response.data.message || 'Failed to save news');
      }
    } catch (error) {
      console.error('Error saving news:', error);
      alert(error.response?.data?.message || error.message || 'Failed to save news. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    setSelectedNews(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/news/deletenews/${selectedNews}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const result = await response.json();
        console.log('ลบสำเร็จ', result);
        alert('ลบเรียบร้อยแล้ว');
        await fetchNews(); // Use fetchNews instead of window.location.reload()
      } else {
        throw new Error('ลบไม่สำเร็จ');
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาด', error);
      alert('ลบไม่สำเร็จ');
    } finally {
      setDeleteModalOpen(false);
      setSelectedNews(null);
    }
  };

  const filteredNews = news.filter(item =>
    item.Title?.toLowerCase().includes(search.toLowerCase()) ||
    item.Category?.toLowerCase().includes(search.toLowerCase()) ||
    item.Content?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddNews = () => {
    navigate('/addnews');
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setViewModalOpen(true);
  };

  // Click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.action-dropdown')) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (newsId, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setOpenDropdownId(currentId => currentId === newsId ? null : newsId);
  };

  // Updated attachment path helper function
  const getAttachmentPath = (item) => {
    // Try file_path first, then construct from file_name
    if (item.AttachmentPath) {
      return `http://localhost:5000${item.AttachmentPath}`;
    } else if (item.AttachmentPath) {
      return `http://localhost:5000${item.Attachment}`;
    }
    return null;
  };

  // Helper function to check if file is an image
  const isImageFile = (file) => {
    const filename = typeof file === 'string' ? file : file?.name;
    if (typeof filename !== 'string') return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    return imageExtensions.includes(extension);
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return '-';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-main">
          <SideMenu />
          <div className="dashboard-content">
            <Topbar pageTitle="News" pageSubtitle="Company News & Announcements" />
            <div className="news-card">
              <div className="loading-state">
                <p>Loading news...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-main">
          <SideMenu />
          <div className="dashboard-content">
            <Topbar pageTitle="News" pageSubtitle="Company News & Announcements" />
            <div className="news-card">
              <div className="error-state">
                <p>Error: {error}</p>
                <button onClick={fetchNews} className="retry-btn">
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
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
              <button className="btn-add-news" onClick={handleAddNews}>
                <FiPlus />
                <span>Add News</span>
              </button>
            </div>
            
            <div className="news-list-table">
              <table className="news-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Created</th>
                    <th className="action-col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNews.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="no-news">
                        {search ? 'No news found matching your search' : 'No news available'}
                      </td>
                    </tr>
                  ) : (
                    filteredNews.map(item => (
                      <tr
                        key={item.NewsId}
                        className={`
                          ${pinnedNews.has(item.NewsId) ? 'pinned' : ''} 
                          ${hiddenNews.has(item.NewsId) ? 'hidden-row' : ''}
                        `}
                      >
                        <td className="title-cell">
                          <div className="title-content">
                            <span className="title-text">{item.Title}</span>
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
                            <span className="lable">{item.Category}</span>
                          </div>
                        </td>
                        <td>{formatDate(item.CreatedAt)}</td>
                        <td className="action-col">
                          <div className="desktop-actions">
                            <button
                              className={`icon-btn action-pin ${pinnedNews.has(item.NewsId) ? 'pinned' : ''}`}
                              onClick={() => handleTogglePin(item.NewsId)}
                              title={pinnedNews.has(item.NewsId) ? 'Unpin News' : 'Pin News'}
                            >
                              <FiStar />
                            </button>

                            <button
                              className="icon-btn action-view"
                              title="View"
                              onClick={() => handleView(item)}
                            >
                              <FiEye />
                            </button>

                            <button
                              className="icon-btn action-edit"
                              title="Edit"
                              onClick={() => handleOpenModal(item)}
                            >
                              <FiEdit />
                            </button>

                            <button
                              className="icon-btn action-hide"
                              title={!hiddenNews.has(item.NewsId) ? "Hide" : "Show"}
                              onClick={() => handleToggleVisibility(item.NewsId)}
                            >
                              {!hiddenNews.has(item.NewsId) ? <FiUnlock /> : <FiLock />}
                            </button>

                            <button
                              className="icon-btn action-delete"
                              title="Delete"
                              onClick={() => handleDelete(item.NewsId)}
                            >
                              <FiTrash2 />
                            </button>
                          </div>

                          <div className="mobile-actions">
                            <button
                              type="button"
                              className="action-dropdown-toggle"
                              onClick={(e) => toggleDropdown(item.NewsId, e)}
                              title="Actions menu"
                            >
                              <FiMoreVertical size={20} />
                            </button>

                            <div className={`action-dropdown-content ${openDropdownId === item.NewsId ? 'show' : ''}`}>
                              <button
                                className="action-dropdown-item"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTogglePin(item.NewsId);
                                  setOpenDropdownId(null);
                                }}
                              >
                                <FiStar size={18} />
                                {pinnedNews.has(item.NewsId) ? 'Unpin' : 'Pin'}
                              </button>

                              <button
                                className="action-dropdown-item"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleView(item);
                                  setOpenDropdownId(null);
                                }}
                              >
                                <FiEye size={18} />
                                View
                              </button>

                              <button
                                className="action-dropdown-item"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenModal(item);
                                  setOpenDropdownId(null);
                                }}
                              >
                                <FiEdit size={18} />
                                Edit
                              </button>

                              <button
                                className="action-dropdown-item"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleVisibility(item.NewsId);
                                  setOpenDropdownId(null);
                                }}
                              >
                                {hiddenNews.has(item.NewsId) ? <FiUnlock size={18} /> : <FiLock size={18} />}
                                {hiddenNews.has(item.NewsId) ? 'Show' : 'Hide'}
                              </button>

                              <button
                                className="action-dropdown-item delete"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(item.NewsId);
                                  setOpenDropdownId(null);
                                }}
                              >
                                <FiTrash2 size={18} />
                                Delete
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <div className="edit-modal-header">
              <h3>{editItem ? 'Edit News' : 'Add News'}</h3>
              <button className="edit-close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="edit-news-form">
              <div className="edit-form-group">
                <label>Title</label>
                <input 
                  name="title" 
                  value={form.title} 
                  onChange={handleChange} 
                  required 
                  placeholder="Enter news title"
                />
              </div>
              <div className="edit-form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="edit-form-group">
                <label>Content</label>
                <textarea 
                  name="content" 
                  value={form.content} 
                  onChange={handleChange} 
                  required 
                  placeholder="Enter news content"
                  rows="6"
                />
              </div>
              <div className="edit-form-group">
                <label>Attachment</label>
                
          <div className="edit-file-preview">
  {preview ? (
    <a href={preview} target="_blank" rel="noopener noreferrer" className="has-preview">
      <FiFile />
      <span>Current attachment - Click to preview</span>
    </a>
  ) : (
    <div className="no-preview">
      <FiFile />
      <span>No attachment available</span>
    </div>
  )}
</div>
              </div>
              <div className="edit-modal-actions">
                <button type="button" onClick={handleCloseModal} className="edit-modal-btn edit-btn-cancel">
                  Cancel
                </button> 
                <button type="submit" className="edit-modal-btn edit-btn-save">
                  {editItem ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <div className="delete-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 4.44772 8.44772 4 9 4H15C15.5523 4 16 4.44772 16 5V7M8 7H16" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2>Delete News</h2>
            <p>Are you sure you want to delete this news? This action cannot be undone.</p>
            <div className="modal-buttons">
              <button className="cancel-button" onClick={() => setDeleteModalOpen(false)}>Cancel</button>
              <button className="delete-button" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

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
                  <span className="label">{selectedItem.Category}</span>
                  {selectedItem.isPinned === true && (
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
                    <FiPaperclip className="attachment-icon" />
                    Attachment
                  </div>
                
<div className="attachment-preview">
  <button
    onClick={async () => {
      try {
        const attachmentPath = getAttachmentPath(selectedItem);
        if (!attachmentPath) {
          console.error('No attachment path found');
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
        alert('ไม่มีรูปอยู่ ในฐานข้อมูล');
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
    <span className="filename">{selectedItem.Attachment}</span>
    <FiDownload style={{ marginLeft: '8px' }} />
  </button>
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

export default New;