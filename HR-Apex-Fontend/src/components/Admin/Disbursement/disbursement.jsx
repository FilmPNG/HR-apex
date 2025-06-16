import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiPlus, FiFilter, FiArrowLeft, FiEdit, FiCheck, FiX, FiSave, FiUpload } from 'react-icons/fi';
import SideMenu from '../SideMenu/Side_menu';
import Topbar from '../Topbar/Topbar';
import './disbursement.css';
import '../AnimationCircles/AnimationCircles.css';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/disbursements`;

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
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedDisbursementId, setSelectedDisbursementId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Mock data for demonstration
  const mockDisbursements = [
    {
      id: "DISB20250530001",
      employeeName: "John Doe",
      employeeId: "1",
      category: "Travel",
      amount: 2500,
      status: "Pending",
      date: "2025-05-30",
      details: "Business trip to client meeting",
      email: "john.doe@company.com",
      attachments: [
        { id: 1, name: "taxi_receipt.pdf", url: "/uploads/taxi_receipt.pdf" },
        { id: 2, name: "hotel_receipt.pdf", url: "/uploads/hotel_receipt.pdf" }
      ]
    },
    {
      id: "DISB20250529001",
      employeeName: "Jane Smith",
      employeeId: "2",
      category: "Equipment",
      amount: 35000,
      status: "Approved",
      date: "2025-05-29",
      details: "New laptop for development team",
      email: "jane.smith@company.com",
      attachments: [
        { id: 3, name: "laptop_invoice.pdf", url: "/uploads/laptop_invoice.pdf" }
      ]
    },
    {
      id: "DISB20250528001",
      employeeName: "Admin System",
      employeeId: "EMP2025044861",
      category: "Software",
      amount: 15000,
      status: "Pending",
      date: "2025-05-28",
      details: "Annual software licenses renewal",
      email: "admin@company.com",
      attachments: [
        { id: 4, name: "license_invoice.pdf", url: "/uploads/license_invoice.pdf" },
        { id: 5, name: "quote.pdf", url: "/uploads/quote.pdf" }
      ]
    },
    {
      id: "DISB20250527001",
      employeeName: "John Doe",
      employeeId: "1",
      category: "Training",
      amount: 12000,
      status: "Rejected",
      date: "2025-05-27",
      details: "Advanced React Development Course",
      email: "john.doe@company.com",
      rejectReason: "Please provide more details about the course curriculum",
      attachments: [
        { id: 6, name: "course_details.pdf", url: "/uploads/course_details.pdf" }
      ]
    },
    {
      id: "DISB20250526001",
      employeeName: "Jane Smith",
      employeeId: "2",
      category: "Food",
      amount: 3500,
      status: "Approved",
      date: "2025-05-26",
      details: "Team lunch meeting - Project kickoff",
      email: "jane.smith@company.com",
      attachments: [
        { id: 7, name: "restaurant_bill.pdf", url: "/uploads/restaurant_bill.pdf" }
      ]
    },
    {
      id: "DISB20250525001",
      employeeName: "Admin System",
      employeeId: "EMP2025044861",
      category: "Others",
      amount: 8500,
      status: "Approved",
      date: "2025-05-25",
      details: "Office supplies and sanitizers",
      email: "admin@company.com",
      attachments: [
        { id: 8, name: "office_supplies.pdf", url: "/uploads/office_supplies.pdf" }
      ]
    },
    {
      id: 2,
      employeeName: 'วิภา รักดี',
      category: 'ค่าอุปกรณ์',
      amount: 3500,
      status: 'Approved',
      date: '2025-05-06',
      details: 'ซื้อโน้ตบุ๊กสำหรับทีมใหม่',
      attachments: [
        { id: 2, name: 'ใบเสร็จร้านคอมพิวเตอร์.pdf', url: '/uploads/receipt2.pdf' }
      ]
    },
    {
      id: 3,
      employeeName: 'ประพันธ์ มานะ',
      category: 'ค่าอาหาร',
      amount: 2800,
      status: 'Pending',
      date: '2025-05-07',
      details: 'ค่าอาหารประชุมทีม 10 คน',
      attachments: []
    },
    {
      id: 4,
      employeeName: 'นภา สดใส',
      category: 'อื่นๆ',
      amount: 5000,
      status: 'Rejected',
      date: '2025-05-05',
      details: 'ค่าอบรมออนไลน์',
      attachments: [
        { id: 3, name: 'ใบเสร็จค่าอบรม.pdf', url: '/uploads/receipt3.pdf' }
      ]
    },
    {
      id: 5,
      employeeName: 'สมศักดิ์ รุ่งเรือง',
      category: 'ค่าเดินทาง',
      amount: 4200,
      status: 'Pending',
      date: '2025-05-07',
      details: 'ค่าเดินทางไปพบลูกค้าต่างจังหวัด',
      attachments: []
    }
  ];
  useEffect(() => {
    // ใช้ mock data แทนการเรียก API
    setDisbursements(mockDisbursements);
  }, []);

  const handleApprove = (id) => {
    setDisbursements(prevDisbursements =>
      prevDisbursements.map(item =>
        item.id === id ? { ...item, status: 'Approved' } : item
      )
    );
  };

  const handleReject = (id) => {
    setDisbursements(prevDisbursements =>
      prevDisbursements.map(item =>
        item.id === id ? { ...item, status: 'Rejected' } : item
      )
    );
  };

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

  const filteredDisbursements = disbursements.filter(item => {
    if (filterCriteria.category && item.category !== filterCriteria.category) return false;
    if (filterCriteria.status && item.status !== filterCriteria.status) return false;
    if (filterCriteria.date && item.date !== filterCriteria.date) return false;
    return true;
  });
  const handleEdit = (id) => {
    const disbursementToEdit = disbursements.find(item => item.id === id);
    setEditingId(id);
    setEditData({
      category: disbursementToEdit.category,
      amount: disbursementToEdit.amount,
      details: disbursementToEdit.details,
      status: disbursementToEdit.status,
      date: disbursementToEdit.date,
      newAttachments: []
    });
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
    // สร้าง URL ชั่วคราวสำหรับพรีวิวทันทีที่เพิ่มไฟล์
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
  };  const handleSave = (id) => {
    // ใช้ไฟล์แนบที่มีอยู่แล้วในสถานะ editData
    const newFileAttachments = editData.newAttachments;

    setDisbursements(prevDisbursements =>
      prevDisbursements.map(item =>
        item.id === id 
          ? {
              ...item,
              ...editData,
              attachments: [
                ...(item.attachments || []),
                ...newFileAttachments
              ]
            }
          : item
      )
    );
    setEditingId(null);
  };

  const handleAddDisbursement = () => {
    navigate('/adddisburse');
  };

  const openRejectPopup = (id) => {
    setSelectedDisbursementId(id);
    setShowRejectPopup(true);
  };

  const handleRejectClick = (id) => {
    setSelectedDisbursementId(id);
    setShowRejectPopup(true);
  };
  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      alert('กรุณากรอกเหตุผลในการ Reject');
      return;
    }

    // หา disbursement ที่จะ reject
    const disbursement = disbursements.find(item => item.id === selectedDisbursementId);
    if (!disbursement) return;

    try {
      // ส่ง email แจ้งเตือน
      const response = await fetch('http://localhost:3001/api/disbursement/reject-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeName: disbursement.employeeName,
          category: disbursement.category,
          amount: disbursement.amount,
          rejectReason: rejectReason,
          employeeEmail: disbursement.email || 'test@example.com' // ในกรณีที่ยังไม่มี email ในข้อมูล
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // อัพเดทสถานะ
        setDisbursements(prevDisbursements =>
          prevDisbursements.map(item =>
            item.id === selectedDisbursementId 
              ? { ...item, status: 'Rejected', rejectReason: rejectReason }
              : item
          )
        );

        alert('ปฏิเสธการเบิกจ่ายและส่งอีเมลแจ้งเตือนเรียบร้อยแล้ว');
      } else {
        alert('เกิดข้อผิดพลาดในการส่งอีเมล: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('เกิดข้อผิดพลาดในการส่งอีเมล');
    }

    setShowRejectPopup(false);
    setRejectReason('');
    setSelectedDisbursementId(null);
  };

  const handleRejectCancel = () => {
    setShowRejectPopup(false);
    setRejectReason('');
    setSelectedDisbursementId(null);
  };

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

            {showFilter && (
              <div className="filter-panel">
                <select
                  name="category"
                  value={filterCriteria.category}
                  onChange={handleFilterChange}
                  style={{ color: '#000000' }}
                >                  <option value="" style={{ color: '#000000' }}>All Categories</option>
                  <option value="Travel" style={{ color: '#000000' }}>Travel</option>
                  <option value="Food" style={{ color: '#000000' }}>Food</option>
                  <option value="Equipment" style={{ color: '#000000' }}>Equipment</option>
                  <option value="Others" style={{ color: '#000000' }}>Others</option>
                </select>

                <select
                  name="status"
                  value={filterCriteria.status}
                  onChange={handleFilterChange}
                  style={{ color: '#000000' }}
                >
                  <option value="" style={{ color: '#000000' }}>All Status</option>
                  <option value="Pending" style={{ color: '#000000' }}>Pending</option>
                  <option value="Approved" style={{ color: '#000000' }}>Approved</option>
                  <option value="Rejected" style={{ color: '#000000' }}>Rejected</option>
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
              {filteredDisbursements.map((item) => (
                <div key={item.id} className="disbursement-item">
                  <div className="disbursement-info">
                    <div className="disbursement-header-info">
                      <h3>{item.employeeName}</h3>
                      <span className={`status-badge ${item.status.replace(/\s+/g, '-')}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="disbursement-details">                      <div className="detail-row">
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
                      </div>                      <div className="detail-row">
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
                      </div>                      <div className="detail-row">
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
                      </div>                      <div className="detail-row">
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
                      {editingId === item.id && (                      <div className="detail-row">
                        <span className="detail-label">Status:</span>
                        <select
                            name="status"
                            value={editData.status}
                            onChange={handleEditChange}
                            className="edit-input status-select"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                      )}                      <div className="detail-row">                        <span className="detail-label">Attachments:</span>
                        <div className="attachments-container">
                          <div className="attachment-header">
                          </div>
                          
                          {(!item.attachments || item.attachments.length === 0) && !editingId && (
                            <span className="no-attachments">None</span>
                          )}
                          
                          {item.attachments && item.attachments.map((file) => (
                            <div key={file.id} className="attachment-item">
                              <span className="file-icon">📄</span>
                              <a href={file.url} target="_blank" rel="noopener noreferrer">
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
                              <a href={file.url} target="_blank" rel="noopener noreferrer">
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
                    {item.status === 'Pending' && !editingId && (
                      <>
                        <button 
                          className="approve-button"
                          onClick={() => handleApprove(item.id)}
                        >
                          <FiCheck style={{ marginRight: '5px' }} /> Approve
                        </button>
                        <button 
                          className="reject-button"
                          onClick={() => openRejectPopup(item.id)}
                        >
                          <FiX />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showRejectPopup && (
        <div className="reject-popup">          <div className="popup-content">
            <h3>Rejection Reason</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Please enter rejection reason here"
            ></textarea>
            <div className="popup-actions">              <button className="confirm-reject-button" onClick={handleRejectConfirm}>
                Confirm
              </button>
              <button className="cancel-reject-button" onClick={handleRejectCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Disbursement;