import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiPlus, FiFilter, FiArrowLeft, FiEdit, FiCheck, FiX, FiSave, FiUpload, FiRefreshCw } from 'react-icons/fi';
import SideMenu from '../../Admin/SideMenu/Side_menu';
import Topbar from '../../Admin/Topbar/Topbar';
import './disbursement.css';
import '../../Admin/AnimationCircles/AnimationCircles.css';
import axios from 'axios';

const API_BASE_URL = `http://localhost:5000/api/disbursement`;

const Disbursement = () => {
  const navigate = useNavigate();
  const [isMinimized, setIsMinimized] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState({
    category: '',
    status: '',
    date: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    category: '',
    amount: 0,
    details: '',
    status: '',
    date: '',
    newAttachments: []
  });
  const [disbursements, setDisbursements] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ฟังก์ชันสำหรับจัดการ status class name
  const getStatusClass = (status) => {
    const statusMap = {
      'PENDING': 'pending',
      'APPROVED': 'approved', 
      'REJECTED': 'rejected'
    };
    return `status-badge ${statusMap[status] || 'pending'}`;
  };

  // ฟังก์ชันสำหรับดึงข้อมูลจาก localStorage อย่างปลอดภัย
  const getCurrentEmployeeId = () => {
  try {
    const item = localStorage.getItem('employee');
    if (!item) return null;

    const parsed = JSON.parse(item);
    return parsed.employee_id || null;
  } catch (error) {
    console.error('Error parsing localStorage employee:', error);
    return null;
  }
};

  // ฟังก์ชันสำหรับ debug และ log ข้อมูล
  const debugLog = (message, data = null) => {
    console.log(`[Disbursement Debug] ${message}`, data);
  };

  // ดึงข้อมูลจาก API
  const fetchDisbursements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ตรวจสอบ employee_id
      const currentEmployeeId = getCurrentEmployeeId();
      if (!currentEmployeeId) {
        setError('ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่');
        setLoading(false);
        return;
      }

      debugLog('Fetching disbursements for employee:', currentEmployeeId);

      // ลอง API endpoints ต่างๆ
      let response;
      let apiEndpoint;
      
      try {
        // ลองดึงข้อมูลเฉพาะ user ก่อน
        apiEndpoint = `${API_BASE_URL}/employee/${currentEmployeeId}`;
        debugLog('Trying user-specific endpoint:', apiEndpoint);
        response = await axios.get(apiEndpoint);
        debugLog('User-specific response:', response.data);
      } catch (userSpecificError) {
        debugLog('User-specific endpoint failed:', userSpecificError.response?.status);
        
        try {
          // ถ้าไม่ได้ ลองดึงข้อมูลทั้งหมด
          apiEndpoint = `${API_BASE_URL}/disbursements`;
          debugLog('Trying general endpoint:', apiEndpoint);
          response = await axios.get(apiEndpoint);
          debugLog('General response:', response.data);
        } catch (generalError) {
          debugLog('General endpoint failed:', generalError.response?.status);
          
          try {
            // ลอง endpoint แบบอื่น
            apiEndpoint = `${API_BASE_URL}`;
            debugLog('Trying base endpoint:', apiEndpoint);
            response = await axios.get(apiEndpoint);
            debugLog('Base response:', response.data);
          } catch (baseError) {
            debugLog('All endpoints failed:', baseError);
            throw new Error('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
          }
        }
      }

      // ประมวลผลข้อมูลที่ได้รับ
      if (response && response.data) {
        let allDisbursements = [];
        
        // จัดการข้อมูลตามรูปแบบที่ได้รับ
        if (response.data.success && response.data.data) {
          allDisbursements = Array.isArray(response.data.data) 
            ? response.data.data 
            : [response.data.data];
        } else if (Array.isArray(response.data)) {
          allDisbursements = response.data;
        } else if (response.data.disbursements) {
          allDisbursements = Array.isArray(response.data.disbursements) 
            ? response.data.disbursements 
            : [response.data.disbursements];
        } else if (typeof response.data === 'object') {
          // ถ้าเป็น object เดียว
          allDisbursements = [response.data];
        }

        debugLog('All disbursements found:', allDisbursements);
        
        // กรองเฉพาะการเบิกจ่ายของ user ปัจจุบัน
        const userDisbursements = allDisbursements.filter(item => {
          if (!item) return false;
          
          // ลองหาจาก field ต่างๆ ที่เป็นไปได้
          const itemEmployeeId = item.employeeId || item.employee_id || item.empId || item.emp_id;
          const match = String(itemEmployeeId) === String(currentEmployeeId);
          debugLog(`Filtering item ${item.id || 'unknown'}: employeeId=${itemEmployeeId}, match=${match}`);
          return match;
        });
        
        debugLog('Filtered user disbursements:', userDisbursements);
        
        if (userDisbursements.length === 0) {
          setError('ไม่พบข้อมูลการเบิกจ่ายสำหรับผู้ใช้นี้');
          setDisbursements([]);
        } else {
          // แปลงข้อมูลให้ตรงกับโครงสร้างเดิม
          const formattedDisbursements = userDisbursements.map(item => {
            const formatted = {
              id: item.id || item._id || Math.random().toString(36).substr(2, 9),
              employeeName: item.employeeName || item.employee_name || item.empName || item.emp_name || 'ไม่ระบุ',
              employeeId: item.employeeId || item.employee_id || item.empId || item.emp_id,
              category: item.category || item.type || 'OTHERS',
              amount: parseFloat(item.amount) || 0,
              status: (item.status || '').toUpperCase(),
              date: item.date ? 
                (item.date.includes('T') ? item.date.split('T')[0] : item.date) : 
                new Date().toISOString().split('T')[0],
              details: item.details || item.description || item.note || '',
              email: item.email || '',
              attachments: Array.isArray(item.attachments) ? item.attachments : (item.files || [])
            };
            debugLog(`Formatted disbursement ${formatted.id}:`, formatted);
            return formatted;
          });
          
          setDisbursements(formattedDisbursements);
          setError(null); // ล้าง error ถ้าสำเร็จ
        }
      } else {
        throw new Error('ไม่ได้รับข้อมูลจากเซิร์ฟเวอร์');
      }
    } catch (error) {
      debugLog('Fetch error:', error);
      
      // จัดการ error ต่างๆ
      let errorMessage = 'เกิดข้อผิดพลาดในการดึงข้อมูล';
      
      if (error.response) {
        // Server responded with error
        const status = error.response.status;
        const serverMessage = error.response.data?.message || error.response.data?.error;
        
        switch (status) {
          case 404:
            errorMessage = 'ไม่พบข้อมูลการเบิกจ่าย';
            break;
          case 401:
            errorMessage = 'ไม่ได้รับอนุญาต กรุณาเข้าสู่ระบบใหม่';
            break;
          case 403:
            errorMessage = 'ไม่มีสิทธิ์เข้าถึงข้อมูล';
            break;
          case 500:
            errorMessage = 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์';
            break;
          default:
            errorMessage = serverMessage || `เกิดข้อผิดพลาด (${status})`;
        }
      } else if (error.request) {
        // Network error
        errorMessage = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต';
      } else {
        // Other error
        errorMessage = error.message || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
      }
      
      setError(errorMessage);
      
      // ใช้ข้อมูลจำลองเมื่อเกิดข้อผิดพลาด (สำหรับการพัฒนา)
      if (process.env.NODE_ENV === 'development') {
        debugLog('Using mock data for development');
        const currentEmployeeId = getCurrentEmployeeId();
        const mockDisbursements = [
          {
            id: 1,
            employeeName: "John Doe",
            employeeId: "1047",
            category: "TRAVEL",
            amount: 2500,
            status: "PENDING",
            date: "2025-05-30",
            details: "Business trip to client meeting",
            email: "john.doe@company.com",
            attachments: []
          },
          {
            id: 2,
            employeeName: 'วิภา รักดี',
            employeeId: "1049",
            category: 'EQUIPMENT',
            amount: 3500,
            status: 'APPROVED',
            date: '2025-05-06',
            details: 'ซื้อโน้ตบุ๊กสำหรับทีมใหม่',
            email: 'wipah@company.com',
            attachments: []
          }
        ];
        
        if (currentEmployeeId) {
          const userDisbursements = mockDisbursements.filter(item => 
            String(item.employeeId) === String(currentEmployeeId)
          );
          setDisbursements(userDisbursements);
          if (userDisbursements.length > 0) {
            setError(null); // ล้าง error ถ้าใช้ mock data ได้
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // เรียกใช้เมื่อ component โหลด
  useEffect(() => {
    fetchDisbursements();
  }, []);

  // ฟังก์ชันสำหรับลองดึงข้อมูลใหม่
  const handleRetry = () => {
    fetchDisbursements();
  };

  // จัดการ filter
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterCriteria(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  // กรองข้อมูล
  const filteredDisbursements = disbursements.filter(item => {
    if (filterCriteria.category && item.category !== filterCriteria.category) return false;
    if (filterCriteria.status && item.status !== filterCriteria.status) return false;
    if (filterCriteria.date && item.date !== filterCriteria.date) return false;
    return true;
  });

  const handleEdit = (id) => {
    const disbursementToEdit = disbursements.find(item => item.id === id);
    const currentEmployeeId = localStorage.getItem('employeeId');
    
    // Only allow editing if this disbursement belongs to the current user
    if (String(disbursementToEdit.employeeId) === String(currentEmployeeId)) {
      setEditingId(id);
      setEditData({
        category: disbursementToEdit.category,
        amount: disbursementToEdit.amount,
        details: disbursementToEdit.details,
        status: disbursementToEdit.status,
        date: disbursementToEdit.date,
        newAttachments: []
      });
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: `temp_${Date.now()}_${file.name}`,
      file: file,
      name: file.name,
      url: URL.createObjectURL(file)
    }));
    setEditData(prev => ({
      ...prev,
      newAttachments: [...prev.newAttachments, ...newFiles]
    }));
  };

  const handleFileRemove = (index) => {
    setEditData(prev => ({
      ...prev,
      newAttachments: prev.newAttachments.filter((_, i) => i !== index)
    }));
  };

  const handleAttachmentRemove = (disbursementId, attachmentId) => {
    setDisbursements(prev => 
      prev.map(item => 
        item.id === disbursementId 
          ? {
              ...item,
              attachments: item.attachments.filter(att => att.id !== attachmentId)
            }
          : item
      )
    );
  };

  const handleSave = async (id) => {
    try {
      // ส่งข้อมูลไปอัปเดตที่ API
      const response = await axios.put(`${API_BASE_URL}/disbursements/${id}`, editData);
      
      if (response.data && response.data.success) {
        // อัปเดตข้อมูลใน state
        setDisbursements(prev => 
          prev.map(item => 
            item.id === id 
              ? { ...item, ...editData }
              : item
          )
        );
        setEditingId(null);
        alert('บันทึกข้อมูลเรียบร้อย');
      } else {
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    } catch (error) {
      console.error('Error updating disbursement:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      // ยกเลิกการแก้ไข
      setEditingId(null);
    }
  };

  const handleAddDisbursement = () => {
    navigate('/user/adddisburse');
  };

  const handleStatusUpdate = (id, newStatus) => {
    console.log(`Updating status for disbursement ${id} to ${newStatus}`);
  };

  if (loading) {
    return (
      <div className="app-container">
        <SideMenu 
          isMinimized={isMinimized} 
          onToggleMinimize={() => setIsMinimized(!isMinimized)}
          mobileOpen={mobileMenuOpen}
          onCloseMobileMenu={() => setMobileMenuOpen(false)}
        />
        <div className={`main-content ${isMinimized ? 'expanded' : ''}`}>
          <Topbar 
            pageTitle="Dashboard" 
            onMobileMenuClick={() => setMobileMenuOpen(true)}
          />
          <div className="content-wrapper">
            <div className="disbursement-container">
              <div className="loading-container" style={{ textAlign: 'center', padding: '50px' }}>
                <p>กำลังโหลดข้อมูล...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <SideMenu 
        isMinimized={isMinimized} 
        onToggleMinimize={() => setIsMinimized(!isMinimized)}
        mobileOpen={mobileMenuOpen}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
      />
      <div className={`main-content ${isMinimized ? 'expanded' : ''}`}>
        <Topbar 
          pageTitle="Dashboard" 
          onMobileMenuClick={() => setMobileMenuOpen(true)}
        />
        
        {/* Add circles animation */}
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>

        <div className="content-wrapper">
          <div className="disbursement-container">
            <div className="disbursement-header">
              <h2>Disbursement</h2>
              <div className="header-actions">
                <button className="add-disbursement-button" onClick={handleAddDisbursement}>
                  <FiPlus style={{ marginRight: '5px' }} /> Add
                </button>
                <button className="filter-button" onClick={toggleFilter}>
                  <FiFilter style={{ marginRight: '5px' }} /> Filter
                </button>
              </div>
            </div>

            {error && (
              <div className="error-message" style={{ 
                background: '#fee', 
                color: '#c33', 
                padding: '10px', 
                borderRadius: '5px', 
                margin: '10px 0' 
              }}>
                {error}
                <button 
                  onClick={handleRetry}
                  style={{
                    marginLeft: '10px',
                    padding: '5px 10px',
                    background: '#c33',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                >
                  <FiRefreshCw style={{ marginRight: '5px' }} />
                  ลองใหม่
                </button>
              </div>
            )}

            {showFilter && (
              <div className="filter-panel">
                <select
                  name="category"
                  value={filterCriteria.category}
                  onChange={handleFilterChange}
                  style={{ color: '#000000' }}
                >
                  <option value="" style={{ color: '#000000' }}>All Categories</option>
                  <option value="TRAVEL" style={{ color: '#000000' }}>Travel</option>
                  <option value="FOOD" style={{ color: '#000000' }}>Food</option>
                  <option value="EQUIPMENT" style={{ color: '#000000' }}>Equipment</option>
                  <option value="SOFTWARE" style={{ color: '#000000' }}>Software</option>
                  <option value="TRAINING" style={{ color: '#000000' }}>Training</option>
                  <option value="OTHERS" style={{ color: '#000000' }}>Others</option>
                </select>

                <select
                  name="status"
                  value={filterCriteria.status}
                  onChange={handleFilterChange}
                  style={{ color: '#000000' }}
                >
                  <option value="" style={{ color: '#000000' }}>All Status</option>
                  <option value="PENDING" style={{ color: '#000000' }}>Pending</option>
                  <option value="APPROVED" style={{ color: '#000000' }}>Approved</option>
                  <option value="REJECTED" style={{ color: '#000000' }}>Rejected</option>
                </select>

                <input
                  type="date"
                  name="date"
                  value={filterCriteria.date}
                  onChange={handleFilterChange}
                />
              </div>
            )}

            <div className="disbursement-list">
              {filteredDisbursements.length === 0 ? (
                <div className="no-data-message" style={{ 
                  textAlign: 'center', 
                  padding: '50px', 
                  color: '#666' 
                }}>
                  ไม่พบข้อมูลการเบิกจ่าย
                </div>
              ) : (
                filteredDisbursements.map((item) => (
                  <div key={item.id} className="disbursement-item">
                    <div className="disbursement-info">
                      <div className="disbursement-header-info">
                        <h3>{item.employeeName}</h3>
                        <span className={getStatusClass(item.status)}>
                          {item.status}
                        </span>
                      </div>
                      <div className="disbursement-details">
                        <div className="detail-row">
                          <span className="detail-label">Category:</span>
                          {editingId === item.id ? (
                            <input
                              type="text"
                              name="category"
                              value={editData.category}
                              onChange={handleEditChange}
                              className="edit-input"
                            />
                          ) : (
                            <span className="detail-value">{item.category}</span>
                          )}
                        </div>

                        <div className="detail-row">
                          <span className="detail-label">Amount:</span>
                          {editingId === item.id ? (
                            <input
                              type="number"
                              name="amount"
                              value={editData.amount}
                              onChange={handleEditChange}
                              className="edit-input"
                            />
                          ) : (
                            <span className="detail-value amount">{item.amount.toLocaleString()} บาท</span>
                          )}
                        </div>

                        <div className="detail-row">
                          <span className="detail-label">Details:</span>
                          {editingId === item.id ? (
                            <input
                              type="text"
                              name="details"
                              value={editData.details}
                              onChange={handleEditChange}
                              className="edit-input"
                            />
                          ) : (
                            <span className="detail-value">{item.details}</span>
                          )}
                        </div>

                        <div className="detail-row">
                          <span className="detail-label">Date:</span>
                          {editingId === item.id ? (
                            <input
                              type="date"
                              name="date"
                              value={editData.date}
                              onChange={handleEditChange}
                              className="edit-input"
                            />
                          ) : (
                            <span className="detail-value">{new Date(item.date).toLocaleDateString('th-TH')}</span>
                          )}
                        </div>

                        {editingId === item.id && (
                          <div className="detail-row">
                            <span className="detail-label">Status:</span>
                            <select
                              name="status"
                              value={editData.status}
                              onChange={handleEditChange}
                              className="edit-input status-select"
                            >
                              <option value="PENDING">Pending</option>
                              <option value="APPROVED">Approved</option>
                              <option value="REJECTED">Rejected</option>
                            </select>
                          </div>
                        )}

                        <div className="detail-row">
                          <span className="detail-label">Attachments:</span>
                          <div className="attachments-container">
                            <div className="attachment-header"></div>
                            
                            {(!item.attachments || item.attachments.length === 0) && !editingId && (
                              <span className="no-attachments">None</span>
                            )}
                            
                            {item.attachments && item.attachments.map((file) => (
                              <div key={file.id} className="attachment-item">
                                <span className="file-icon">📄</span>
                                <a href={`http://localhost:5000${file.url}`} target="_blank" rel="noopener noreferrer">
                                  {file.name}
                                </a>
                                {editingId === item.id && (
                                  <button
                                    className="remove-attachment-btn"
                                    onClick={() => handleAttachmentRemove(item.id, file.id)}
                                    title="Delete file"
                                  >
                                    <FiX />
                                  </button>
                                )}
                              </div>
                            ))}
                            
                            {editingId === item.id && editData.newAttachments.map((file, index) => (
                              <div key={file.id} className="attachment-item new-attachment">
                                <span className="file-icon">📄</span>
                                <a href={`http://localhost:5000${file.url}`} target="_blank" rel="noopener noreferrer">
                                  {file.name}
                                </a>
                                <button
                                  className="remove-attachment-btn"
                                  onClick={() => handleFileRemove(index)}
                                  title="ลบไฟล์"
                                >
                                  <FiX />
                                </button>
                              </div>
                            ))}
                            
                            {editingId === item.id && (
                              <div className="file-upload-container">
                                <input
                                  type="file"
                                  multiple
                                  onChange={handleFileChange}
                                  id={`file-upload-${item.id}`}
                                  className="file-input"
                                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                                />
                                <label htmlFor={`file-upload-${item.id}`} className="file-upload-label">
                                  <FiPlus /> Add file
                                </label>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="action-buttons">
                      {editingId === item.id ? (
                        <button 
                          className="save-button"
                          onClick={() => handleSave(item.id)}
                        >
                          <FiSave style={{ marginRight: '5px' }} /> Save
                        </button>
                      ) : (
                        <button 
                          className="edit-button"
                          onClick={() => handleEdit(item.id)}
                        >
                          <FiEdit style={{ marginRight: '5px' }} /> Edit
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disbursement;