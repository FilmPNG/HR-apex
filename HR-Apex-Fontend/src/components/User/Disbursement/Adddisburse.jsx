import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiFile, FiX } from 'react-icons/fi';
import SideMenu from '../../Admin/SideMenu/Side_menu';
import Topbar from '../../Admin/Topbar/Topbar';
import './Adddisburse.css';

const Adddisburse = () => {
  const navigate = useNavigate();
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    employeeName: '',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0], // Set current date as default
    details: '',
    attachments: []
  });

  // ดึงข้อมูล user จาก localStorage เมื่อ component mount
  useEffect(() => {
    const userData = localStorage.getItem('employee');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      setFormData(prev => ({
        ...prev,
        employeeName: user.employee_id?.toString() || ''
      }));
    }
  }, []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...files]
      }));
    }
  };

  const handleRemoveFile = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.employeeName.trim()) {
      newErrors.employeeName = 'Employee Name is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    // Remove validation for 'Details'
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      const firstErrorField = document.querySelector('.error-text');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setIsSubmitting(true);

    try {
      // ใช้ URL ใหม่ที่ระบุ
      const API_URL = 'http://localhost:5000';
      
      // สร้าง FormData สำหรับส่งข้อมูลและไฟล์
      const formDataToSend = new FormData();
      
      // เพิ่มข้อมูลเบื้องต้น
      formDataToSend.append('employee_id', formData.employeeName); // ส่ง employee_id จาก localStorage
      formDataToSend.append('category', formData.category);
      formDataToSend.append('amount', formData.amount);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('details', formData.details || '');
      formDataToSend.append('create_name', currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : ''); // ใช้ชื่อจริงจาก localStorage
      
      // เพิ่มไฟล์แนบ (ถ้امี)
      formData.attachments.forEach((file, index) => {
        formDataToSend.append('file_name', file);
      });

      // ส่งข้อมูลไปยัง API
      const response = await fetch(`${API_URL}/api/disbursement/add-disbursement`, {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to save disbursement: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Disbursement saved successfully:', result);

      // แสดงข้อความสำเร็จ
      alert('เพิ่มข้อมูลการเบิกเงินสำเร็จ');
      
      // ถ้าบันทึกสำเร็จ redirect ไปหน้า disbursement
      navigate('/user/disbursement');
      
    } catch (error) {
      console.error('Error:', error);
      alert(`เกิดข้อผิดพลาด: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to truncate long file names
  const truncateFileName = (fileName) => {
    if (fileName.length > 25) {
      return fileName.substring(0, 20) + '...' + fileName.substring(fileName.lastIndexOf('.'));
    }
    return fileName;
  };

  return (
    <div className="dashboard-container">
      <SideMenu 
        isMinimized={isMinimized} 
        onToggleMinimize={() => setIsMinimized(!isMinimized)}
      />
      <div className={`dashboard-main ${isMinimized ? 'expanded' : ''}`}>
        <Topbar pageTitle="Create Disbursement" pageSubtitle="Add new disbursement record" />
        
        <div className="form-content-wrapper">
          <ul className="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
          <ul className="circles-bottom">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
          <div className="adddisburse-form-container">
            <div className="form-header">
              <button 
                className="back-button"
                onClick={() => navigate('/user/disbursement')}
              >
                ← Back
              </button>
            </div>

            <form onSubmit={handleSubmit} className="adddisburse-form">
              <div className="form-grid">
                <div className="form-group">
            <label>Employee <span style={{ color: 'red' }}>*</span></label>

            {/* ช่องแสดงข้อมูลแบบแก้ไขไม่ได้ */}
            <input
              type="text"
              name="employeeDisplay"
              value={currentUser ? `${currentUser.employee_id}` : ''}
              className="input-field"
              disabled
              style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
            />

            {/* ช่องซ่อน เพื่อให้ส่งค่า employee_id ไปกับ form */}
            <input
              type="hidden"
              name="employee_id"
              value={currentUser?.employee_id || ''}
            />
          </div>

                <div className="form-group">
                  <label>Category <span style={{ color: 'red' }}>*</span></label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={errors.category ? 'input-field error' : 'input-field'}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="TRAVEL">ค่าเดินทาง</option>
                    <option value="FOOD">ค่าอาหาร</option>
                    <option value="EQUIPMENT">ค่าอุปกรณ์</option>
                    <option value="OTHER">อื่นๆ</option>
                  </select>
                  {errors.category && <span className="error-text">{errors.category}</span>}
                </div>

                <div className="form-group">
                  <label>Amount <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className={errors.amount ? 'input-field error' : 'input-field'}
                    required
                  />
                  {errors.amount && <span className="error-text">{errors.amount}</span>}
                </div>

                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Details</label>
                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    placeholder="Enter disbursement details"
                    rows="3"
                    // Remove 'required' attribute
                  />
                </div>

                <div className="form-group full-width">
                  <label>Attachments</label>
                  <div className="upload-area-doc">
                    <input
                      type="file"
                      id="file-attachments"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleFileUpload}
                      hidden
                      multiple
                    />
                    <label htmlFor="file-attachments" className="upload-label">
                      <div className="upload-icon">
                        <FiUpload />
                      </div>
                      <p>Drag and drop or <span className="choose-text">choose files</span> to upload</p>
                      <p className="supported-text">Supported files: PDF, DOC, DOCX, JPG, JPEG, PNG</p>
                    </label>
                  </div>
                  {formData.attachments.length > 0 && (
                    <div className="uploaded-files">
                      {formData.attachments.map((file, index) => (
                        <div key={index} className="uploaded-file">
                          <FiFile />
                          <span title={file.name}>{truncateFileName(file.name)}</span>
                          <button 
                            type="button" 
                            className="remove-file"
                            onClick={() => handleRemoveFile(index)}
                          >
                            <FiX />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-group full-width">
                  <button type="submit" className="save-button" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Adddisburse;