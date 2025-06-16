import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import SideMenu from '../../Admin/SideMenu/Side_menu';
import Topbar from '../../Admin/Topbar/Topbar';
import { FiEdit2, FiUser, FiBriefcase, FiFileText, FiLock, FiUserCheck, FiCalendar, FiFolder, FiFile, FiCreditCard, FiEye, FiDownload, FiSave, FiMoreHorizontal, FiUpload, FiX } from 'react-icons/fi';
import { getEmployees } from '../../../database/employeeData';
import axios from 'axios';
import './ProfileDetail.css';
import '../../Admin/AnimationCircles/AnimationCircles.css';

const mainTabs = [
  { key: 'personal', label: 'Personal Information', icon: <FiUser /> },
  { key: 'family', label: 'Family Information', icon: <FiCreditCard /> },
  { key: 'professional', label: 'Experience & Education', icon: <FiBriefcase /> },
  { key: 'documents', label: 'Documents', icon: <FiFileText /> },
  { key: 'other', label: 'Other', icon: <FiMoreHorizontal /> }
];

const ProfileDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('personal');
  const [employeeData, setEmployeeData] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState('');
  

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };
  


  useEffect(() => {
    // Check user role
    const role = localStorage.getItem('userRole');
    const employeeData = localStorage.getItem('employee');
    setUserRole(role);

    const employee = JSON.parse(employeeData);
    // ดึง employee_id
    const employeeId = employee.employee_id;
    
    // If admin and trying to edit, redirect to view mode
    if (role === 'admin' && location.search.includes('edit=true')) {
      window.location.href = `/employee/${employeeId}`;
      return;
    }

    const fetchEmployeeData = async () => {
      try {        const mockEmployeeData = {
          "EMP2025044861": {
            EmployeeId: "EMP2025044861",
            FName: "Admin",
            LName: "System",
            Nickname: "Admin",
            Email: "admin@company.com",
            MobileNumber: "099-999-9999",
            Position: "System Administrator",
            Department: "IT",
            Type: "Full-time",
            Status: "Active",
            ImageUrl: "https://randomuser.me/api/portraits/men/85.jpg",
            DateOfBirth: "1990-01-01",
            Gender: "Male",
            Nationality: "Thai",
            MaritalStatus: "Single",
            Religion: "พุทธศาสนา",
            Address: "999 IT Square",
            City: "Bangkok",
            State: "Bangkok",
            ZIPCode: "10400",
            BankName: "Kasikorn Bank",
            AccountNumber: "xxx-x-xxxxx-x",
            AccountHolderName: "Admin System",
            Salary: 150000,
            StartDate: "2020-01-01",
            Username: "admin",
            Role: "admin",
            experience: [
              {
                company: "Tech Solutions Co., Ltd",
                position: "Senior System Administrator",
                fromDate: "2015-01",
                toDate: "2019-12",
                salary: "120000",
                jobDescription: "• Managed enterprise-level IT infrastructure\n• Led IT security implementations\n• Supervised team of 5 system administrators"
              },
              {
                company: "Digital Systems Corp",
                position: "System Administrator",
                fromDate: "2012-06",
                toDate: "2014-12",
                salary: "85000",
                jobDescription: "• Maintained server infrastructure\n• Implemented security protocols\n• Managed user access control systems"
              }
            ],
            education: [
              {
                level: "ปริญญาโท",
                institution: "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี",
                major: "วิศวกรรมคอมพิวเตอร์",
                graduationYear: "2012"
              },
              {
                level: "ปริญญาตรี",
                institution: "มหาวิทยาลัยเกษตรศาสตร์",
                major: "วิศวกรรมคอมพิวเตอร์",
                graduationYear: "2010"
              }
            ]
          },
          "1": {
            EmployeeId: "1",
            FName: "John",
            LName: "Doe",
            Nickname: "JD",
            Email: "john.doe@company.com",
            MobileNumber: "123-456-7890",
            Position: "Software Engineer",
            Department: "Engineering",
            Type: "Full-time",
            Status: "Active",
            ImageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
            DateOfBirth: "1995-05-15",
            Gender: "Male",
            Nationality: "Thai",
            MaritalStatus: "Single",
            Religion: "พุทธศาสนา",
            Address: "123 Main St",
            City: "Bangkok",
            State: "Bangkok",
            ZIPCode: "10110",
            BankName: "Kasikorn Bank",
            AccountNumber: "123-4-56789-0",
            AccountHolderName: "John Doe",
            Salary: 75000,
            StartDate: "2023-01-15",
            experience: [
              {
                company: "Previous Tech Co",
                position: "Junior Developer",
                fromDate: "2020-01",
                toDate: "2022-12",
                salary: "45000",
                jobDescription: "• Developed web applications using React\n• Worked with REST APIs\n• Participated in Agile development"
              }
            ],
            education: [
              {
                level: "ปริญญาตรี",
                institution: "มหาวิทยาลัยเกษตรศาสตร์",
                major: "วิศวกรรมคอมพิวเตอร์",
                graduationYear: "2020"
              }
            ]
          },
          "2": {
            EmployeeId: "2",
            FName: "Jane",
            LName: "Smith",
            Nickname: "JS",
            Email: "jane.smith@company.com",
            MobileNumber: "098-765-4321",
            Position: "Project Manager",
            Department: "Management",
            Type: "Full-time",
            Status: "Active",
            ImageUrl: "https://randomuser.me/api/portraits/women/1.jpg",
            DateOfBirth: "1992-08-20",
            Gender: "Female",
            Nationality: "Thai",
            MaritalStatus: "Married",
            Religion: "พุทธศาสนา",
            Address: "456 Side St",
            City: "Bangkok",
            State: "Bangkok",
            ZIPCode: "10120",
            BankName: "SCB",
            AccountNumber: "098-7-65432-1",
            AccountHolderName: "Jane Smith",
            Salary: 95000,
            StartDate: "2022-03-01",
            experience: [
              {
                company: "Old Tech Ltd",
                position: "Team Lead",
                fromDate: "2018-06",
                toDate: "2022-02",
                salary: "85000",
                jobDescription: "• Led team of 5 developers\n• Managed project timelines and deliverables\n• Implemented Agile methodologies"
              }
            ],
            education: [
              {
                level: "ปริญญาโท",
                institution: "จุฬาลงกรณ์มหาวิทยาลัย",
                major: "บริหารธุรกิจ",
                graduationYear: "2018"
              }
            ]
          }
        };

        // Get employee data from mock data
        const mockEmployee = mockEmployeeData[id];
        if (mockEmployee) {
          setEmployeeData(mockEmployee);
          setEditData(mockEmployee);
        } else {
          console.error('Employee not found with ID:', id);
        }
      } catch (error) {
        console.error('Error fetching employee:', error);
      }
    };

    fetchEmployeeData();
  }, [id]);

  useEffect(() => {
    if (employeeData) {
      setEditData({
        ...employeeData,
        experience: Array.isArray(employeeData.experience) ? employeeData.experience : [],
        education: Array.isArray(employeeData.education) ? employeeData.education : [],
      });
    }
  }, [employeeData]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('edit') === 'true') {
      setIsEditing(true);
    }
  }, [location.search]);

  const handleEditClick = () => setIsEditing(true);

  const handleCancelEdit = () => {
    setEditData(employeeData);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // ตรวจสอบว่าเป็น field array หรือไม่ เช่น education.0.level
    const match = name.match(/^(education|experience)\.(\d+)\.(\w+)$/);
    if (match) {
      const [_, field, idx, key] = match;
      setEditData(prev => {
        const arr = prev[field] ? [...prev[field]] : [];
        arr[parseInt(idx)] = { ...arr[parseInt(idx)], [key]: value };
        return { ...prev, [field]: arr };
      });
    } else {
      setEditData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setShowSaveConfirm(true);
  };
  const handleConfirmSave = async () => {
    try {
      // Mock successful update
      setEmployeeData(editData);
      setIsEditing(false);
      setShowSaveConfirm(false);
      alert('Employee data updated successfully!');
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Failed to update employee. Please try again.');
    }
  };

  // เพิ่มฟังก์ชันสำหรับเพิ่มแถว Education
  const handleAddEducation = () => {
    setEditData(prev => ({
      ...prev,
      education: prev.education ? [...prev.education, { level: '', institution: '', major: '', fromDate: '', toDate: '' }] : [{ level: '', institution: '', major: '', fromDate: '', toDate: '' }]
    }));
  };
  // เพิ่มฟังก์ชันสำหรับเพิ่มแถว Experience
  const handleAddExperience = () => {
    setEditData(prev => ({
      ...prev,
      experience: prev.experience ? [...prev.experience, { company: '', position: '', fromDate: '', toDate: '', salary: '', jobDescription: '' }] : [{ company: '', position: '', fromDate: '', toDate: '', salary: '', jobDescription: '' }]
    }));
  };
  const handleRemoveEducation = (idx) => {
    setEditData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== idx)
    }));
  };
  const handleRemoveExperience = (idx) => {
    setEditData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== idx)
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploadFile(null);
            setUploadProgress(0);
            setIsUploadModalOpen(false);
          }, 500);
        }
      }, 300);
    }
  };

  // Personal Information
  const renderPersonalInformation = () => {
    return (
      <div className="info-section personal-info-section">
        <div className="info-row">
          <div className="info-item">
            <label>First Name</label>
            {isEditing ? (
              <input
                type="text"
                name="FName"
                value={editData.FName || ''}
                onChange={handleInputChange}
                className="edit-input"
              />
            ) : (
              <span className="info-value">{employeeData?.FName || '-'}</span>
            )}
          </div>
          <div className="info-item">
            <label>Last Name</label>
            {isEditing ? (
              <input
                type="text"
                name="LName"
                value={editData.LName || ''}
                onChange={handleInputChange}
                className="edit-input"
              />
            ) : (
              <span className="info-value">{employeeData?.LName || '-'}</span>
            )}
          </div>
        </div>
        <div className="info-row">
          <div className="info-item">
            <label>Nickname</label>
            {isEditing ? (
              <input
                type="text"
                name="Nickname"
                value={editData.Nickname || ''}
                onChange={handleInputChange}
                className="edit-input"
              />
            ) : (
              <span className="info-value">{employeeData?.Nickname || '-'}</span>
            )}
          </div>
          <div className="info-item">
            <label>Mobile Number</label>
            {isEditing ? (
              <input
                type="tel"
                name="MobileNumber"
                value={editData.MobileNumber || ''}
                onChange={handleInputChange}
                className="edit-input"
              />
            ) : (
              <span className="info-value">{employeeData?.MobileNumber || '-'}</span>
            )}
          </div>
        </div>
        <div className="info-row">
          <div className="info-item">
            <label>Date of Birth</label>
            {isEditing ? (
              <input
                type="date"
                name="DateOfBirth"
                value={editData.DateOfBirth || ''}
                onChange={handleInputChange}
                className="edit-input"
              />
            ) : (
              <span className="info-value">
                {employeeData?.DateOfBirth
                  ? (new Date(employeeData.DateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))
                  : '-'}
              </span>
            )}
          </div>
          <div className="info-item">
            <label>Age</label>
            <span className="info-value">{employeeData?.DateOfBirth ? calculateAge(employeeData.DateOfBirth) : '-'}</span>
          </div>
          <div className="info-item">
            <label>Gender</label>
            {isEditing ? (
              <select
                name="Gender"
                value={editData.Gender || ''}
                onChange={handleInputChange}
                className="edit-input"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <span className="info-value">{employeeData?.Gender || '-'}</span>
            )}
          </div>
          <div className="info-item">
            <label>Nationality</label>
            {isEditing ? (
              <input
                type="text"
                name="Nationality"
                value={editData.Nationality || ''}
                onChange={handleInputChange}
                className="edit-input"
              />
            ) : (
              <span className="info-value">{employeeData?.Nationality || '-'}</span>
            )}
          </div>
        </div>
        <div className="info-row">
          <div className="info-item">
            <label>Marital Status</label>
            {isEditing ? (
              <select
                name="MaritalStatus"
                value={editData.MaritalStatus || ''}
                onChange={handleInputChange}
                className="edit-input"
              >
                <option value="">Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
              </select>
            ) : (
              <span className="info-value">{employeeData?.MaritalStatus || '-'}</span>
            )}
          </div>
          <div className="info-item">
            <label>Religion</label>
            {isEditing ? (
              <select
                name="Religion"
                value={editData.Religion || ''}
                onChange={handleInputChange}
                className="edit-input"
              >
                <option value="">Select religion</option>
                <option value="พุทธศาสนา">พุทธศาสนา</option>
                <option value="คริสต์ศาสนา">คริสต์ศาสนา</option>
                <option value="อิสลาม">อิสลาม</option>
                <option value="ศาสนาฮินดู">ศาสนาฮินดู</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <span className="info-value">{employeeData?.Religion || '-'}</span>
            )}
          </div>        </div>
        <div className="info-section">
          <h3>ที่อยู่ตามบัตรประชาชน</h3>
          <div className="info-row">
            <div className="info-item">
              <label>ที่อยู่</label>
              {isEditing ? (
                <textarea
                  name="idCardAddress"
                  value={editData.idCardAddress || ''}
                  onChange={handleInputChange}
                  rows="3"
                  className="edit-input"
                  placeholder="กรุณากรอกที่อยู่ตามบัตรประชาชน"
                />
              ) : (
                <span className="info-value">{employeeData?.idCardAddress || '-'}</span>
              )}
            </div>
          </div>
          <div className="info-row">
            <div className="info-item">
              <label>แขวง/ตำบล</label>
              {isEditing ? (
                <input
                  type="text"
                  name="idCardSubdistrict"
                  value={editData.idCardSubdistrict || ''}
                  onChange={handleInputChange}
                  className="edit-input"
                  placeholder="กรุณากรอกแขวง/ตำบล"
                />
              ) : (
                <span className="info-value">{employeeData?.idCardSubdistrict || '-'}</span>
              )}
            </div>
            <div className="info-item">
              <label>เขต/อำเภอ</label>
              {isEditing ? (
                <input
                  type="text"
                  name="idCardDistrict"
                  value={editData.idCardDistrict || ''}
                  onChange={handleInputChange}
                  className="edit-input"
                  placeholder="กรุณากรอกเขต/อำเภอ"
                />
              ) : (
                <span className="info-value">{employeeData?.idCardDistrict || '-'}</span>
              )}
            </div>
          </div>
          <div className="info-row">
            <div className="info-item">
              <label>จังหวัด</label>
              {isEditing ? (
                <input
                  type="text"
                  name="idCardProvince"
                  value={editData.idCardProvince || ''}
                  onChange={handleInputChange}
                  className="edit-input"
                  placeholder="กรุณากรอกจังหวัด"
                />
              ) : (
                <span className="info-value">{employeeData?.idCardProvince || '-'}</span>
              )}
            </div>
            <div className="info-item">
              <label>รหัสไปรษณีย์</label>
              {isEditing ? (
                <input
                  type="text"
                  name="idCardZipCode"
                  value={editData.idCardZipCode || ''}
                  onChange={handleInputChange}
                  className="edit-input"
                  placeholder="กรุณากรอกรหัสไปรษณีย์"
                />
              ) : (
                <span className="info-value">{employeeData?.idCardZipCode || '-'}</span>
              )}
            </div>
          </div>
        </div>
        <div className="info-section">
          <h3>ที่อยู่ปัจจุบัน</h3>
          <div className="info-row">
            <div className="info-item">
              <label>ที่อยู่</label>
              {isEditing ? (
                <textarea
                  name="currentAddress"
                  value={editData.currentAddress || ''}
                  onChange={handleInputChange}
                  rows="3"
                  className="edit-input"
                  placeholder="กรุณากรอกที่อยู่ปัจจุบัน"
                />
              ) : (
                <span className="info-value">{employeeData?.currentAddress || '-'}</span>
              )}
            </div>
          </div>
          <div className="info-row">
            <div className="info-item">
              <label>แขวง/ตำบล</label>
              {isEditing ? (
                <input
                  type="text"
                  name="currentSubdistrict"
                  value={editData.currentSubdistrict || ''}
                  onChange={handleInputChange}
                  className="edit-input"
                  placeholder="กรุณากรอกแขวง/ตำบล"
                />
              ) : (
                <span className="info-value">{employeeData?.currentSubdistrict || '-'}</span>
              )}
            </div>
            <div className="info-item">
              <label>เขต/อำเภอ</label>
              {isEditing ? (
                <input
                  type="text"
                  name="currentDistrict"
                  value={editData.currentDistrict || ''}
                  onChange={handleInputChange}
                  className="edit-input"
                  placeholder="กรุณากรอกเขต/อำเภอ"
                />
              ) : (
                <span className="info-value">{employeeData?.currentDistrict || '-'}</span>
              )}
            </div>
          </div>
          <div className="info-row">
            <div className="info-item">
              <label>จังหวัด</label>
              {isEditing ? (
                <input
                  type="text"
                  name="currentProvince"
                  value={editData.currentProvince || ''}
                  onChange={handleInputChange}
                  className="edit-input"
                  placeholder="กรุณากรอกจังหวัด"
                />
              ) : (
                <span className="info-value">{employeeData?.currentProvince || '-'}</span>
              )}
            </div>
            <div className="info-item">
              <label>รหัสไปรษณีย์</label>
              {isEditing ? (
                <input
                  type="text"
                  name="currentZipCode"
                  value={editData.currentZipCode || ''}
                  onChange={handleInputChange}
                  className="edit-input"
                  placeholder="กรุณากรอกรหัสไปรษณีย์"
                />
              ) : (
                <span className="info-value">{employeeData?.currentZipCode || '-'}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Employee Information
  const renderEmployeeInfo = () => (
    <div className="info-container">
      <div className="info-row">
        <div className="info-item">
          <label>Employee ID</label>
          <span className="info-value">{employeeData?.EmployeeId || '-'}</span>
        </div>
        <div className="info-item">
          <label>Position</label>
          <span className="info-value">{employeeData?.Position || '-'}</span>
        </div>
      </div>
      <div className="info-row">
        <div className="info-item">
          <label>Type</label>
          <span className="info-value">{employeeData?.Type || '-'}</span>
        </div>
        <div className="info-item">
          <label>Salary</label>
          <span className="info-value">{employeeData?.Salary ? `฿${employeeData.Salary.toLocaleString()}` : '-'}</span>
        </div>
      </div>
      <div className="info-row">
        <div className="info-item">
          <label>Start Date</label>
          <span className="info-value">{employeeData?.StartDate ? new Date(employeeData.StartDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</span>
        </div>
        <div className="info-item">
          <label>Probation End Date</label>
          <span className="info-value">{employeeData?.StartDate ? new Date(new Date(employeeData.StartDate).setMonth(new Date(employeeData.StartDate).getMonth() + 4)).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</span>
        </div>
      </div>
      <div className="info-row">
        <div className="info-item">
          <label>Employee Status</label>
          <span className="info-value">{employeeData?.Status || '-'}</span>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => {
    return (
      <div className="documents-container">
        <div className="documents-header">
          <button className="add-file-btn" onClick={() => setIsUploadModalOpen(true)}>
            <FiUpload />
            ADD FILE
          </button>
        </div>
        {/* Document list section */}
        <div className="document-list">
          <div className="document-row">
            <div className="document-item">
              <span>Job application form.pdf</span>
              <div className="document-actions">
                <button className="button-view">
                  <svg
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    height="24"
                    width="24"
                    className="button-view__icon"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span>View</span>
                </button>
                <button className="button-download">
                  <svg
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    height="24"
                    width="24"
                    className="button-download__icon"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fill="none" d="M0 0h24v24H0z" stroke="none"></path>
                    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"></path>
                    <path d="M7 11l5 5l5 -5"></path>
                    <path d="M12 4l0 12"></path>
                  </svg>
                  <span>Download</span>
                </button>
                <button className="button-delete">
                  <svg
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    height="24"
                    width="24"
                    className="button-delete__icon"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"></path>
                    <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                    <path d="M10 11v6"></path>
                    <path d="M14 11v6"></path>
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
          <div className="document-row">
            <div className="document-item">
              <span>Employment contract.jpg</span>
              <div className="document-actions">
                <button className="button-view">
                  <svg
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    height="24"
                    width="24"
                    className="button-view__icon"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span>View</span>
                </button>
                <button className="button-download">
                  <svg
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    height="24"
                    width="24"
                    className="button-download__icon"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fill="none" d="M0 0h24v24H0z" stroke="none"></path>
                    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"></path>
                    <path d="M7 11l5 5l5 -5"></path>
                    <path d="M12 4l0 12"></path>
                  </svg>
                  <span>Download</span>
                </button>
                <button className="button-delete">
                  <svg
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    height="24"
                    width="24"
                    className="button-delete__icon"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"></path>
                    <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                    <path d="M10 11v6"></path>
                    <path d="M14 11v6"></path>
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
          <div className="document-row">
            <div className="document-item">
              <span>Certificate.pdf</span>
              <div className="document-actions">
                <button className="button-view">
                  <svg
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    height="24"
                    width="24"
                    className="button-view__icon"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span>View</span>
                </button>
                <button className="button-download">
                  <svg
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    height="24"
                    width="24"
                    className="button-download__icon"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fill="none" d="M0 0h24v24H0z" stroke="none"></path>
                    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"></path>
                    <path d="M7 11l5 5l5 -5"></path>
                    <path d="M12 4l0 12"></path>
                  </svg>
                  <span>Download</span>
                </button>
                <button className="button-delete">
                  <svg
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    height="24"
                    width="24"
                    className="button-delete__icon"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"></path>
                    <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                    <path d="M10 11v6"></path>
                    <path d="M14 11v6"></path>
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
          <div className="document-row">
            <div className="document-item">
              <span>Copy of ID Card.pdf</span>
              <div className="document-actions">
                <button className="button-view">
                  <svg
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    height="24"
                    width="24"
                    className="button-view__icon"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span>View</span>
                </button>
                <button className="button-download">
                  <svg
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    height="24"
                    width="24"
                    className="button-download__icon"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fill="none" d="M0 0h24v24H0z" stroke="none"></path>
                    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"></path>
                    <path d="M7 11l5 5l5 -5"></path>
                    <path d="M12 4l0 12"></path>
                  </svg>
                  <span>Download</span>
                </button>
                <button className="button-delete">
                  <svg
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    height="24"
                    width="24"
                    className="button-delete__icon"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"></path>
                    <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                    <path d="M10 11v6"></path>
                    <path d="M14 11v6"></path>
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
          <div className="document-row">
            <div className="document-item">
              <span>House Registration.png</span>
              <div className="document-actions">
                <button className="button-view">
                  <svg
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    height="24"
                    width="24"
                    className="button-view__icon"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span>View</span>
                </button>
                <button className="button-download">
                  <svg
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    height="24"
                    width="24"
                    className="button-download__icon"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fill="none" d="M0 0h24v24H0z" stroke="none"></path>
                    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"></path>
                    <path d="M7 11l5 5l5 -5"></path>
                    <path d="M12 4l0 12"></path>
                  </svg>
                  <span>Download</span>
                </button>
                <button className="button-delete">
                  <svg
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    height="24"
                    width="24"
                    className="button-delete__icon"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"></path>
                    <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                    <path d="M10 11v6"></path>
                    <path d="M14 11v6"></path>
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
          <div className="document-row">
            <div className="document-item">
              <span>Bank Account Book.pdf</span>
              <div className="document-actions">
                <button className="button-view">
                  <svg
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    height="24"
                    width="24"
                    className="button-view__icon"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span>View</span>
                </button>
                <button className="button-download">
                  <svg
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    height="24"
                    width="24"
                    className="button-download__icon"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fill="none" d="M0 0h24v24H0z" stroke="none"></path>
                    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"></path>
                    <path d="M7 11l5 5l5 -5"></path>
                    <path d="M12 4l0 12"></path>
                  </svg>
                  <span>Download</span>
                </button>
                <button className="button-delete">
                  <svg
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    height="24"
                    width="24"
                    className="button-delete__icon"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"></path>
                    <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                    <path d="M10 11v6"></path>
                    <path d="M14 11v6"></path>
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* File Upload Modal */}
        {isUploadModalOpen && (
          <div className="modal-overlay">
            <div className="upload-modal">
              <div className="upload-modal-header">
                <h3>Upload Document</h3>
                <button className="close-btn" onClick={() => setIsUploadModalOpen(false)}>
                  <FiX />
                </button>
              </div>
              <div className="upload-modal-content">
                <div className="upload-area">
                  <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileUpload}
                    className="file-input"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <label htmlFor="file-upload" className="upload-label">
                    <FiUpload className="upload-icon" />
                    <p>Drag & drop your file here or <span>browse</span></p>
                    <p className="upload-hint">Supported formats: PDF, DOC, DOCX, JPG, PNG</p>
                  </label>
                </div>
                {uploadFile && (
                  <div className="upload-progress">
                    <div className="file-info">
                      <FiUpload />
                      <span>{uploadFile.name}</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{uploadProgress}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderBankInfo = () => {
    return (
      <div className="info-container">
        <div className="info-row">
          <div className="info-item">
            <label>Bank Name</label>
            {isEditing ? (
              <input
                type="text"
                name="BankName"
                value={editData.BankName || ''}
                onChange={handleInputChange}
                className="edit-input"
              />
            ) : (
              <p>{employeeData.BankName || '-'}</p>
            )}
          </div>
          <div className="info-item">
            <label>Account Holder Name</label>
            {isEditing ? (
              <input
                type="text"
                name="AccountHolderName"
                value={editData.AccountHolderName || ''}
                onChange={handleInputChange}
                className="edit-input"
              />
            ) : (
              <p>{employeeData.AccountHolderName || '-'}</p>
            )}
          </div>
        </div>
        <div className="info-row">
          <div className="info-item">
            <label>Account Number</label>
            {isEditing ? (
              <input
                type="text"
                name="AccountNumber"
                value={editData.AccountNumber || ''}
                onChange={handleInputChange}
                className="edit-input"
              />
            ) : (
              <p>{employeeData.AccountNumber || '-'}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAccountAccess = () => (
    <div className="info-container">
      <div className="info-row">
        <div className="info-item">
          <label>Email Address</label>
          {isEditing ? (
            <input
              type="email"
              name="Email"
              value={editData.Email || ''}
              onChange={handleInputChange}
              className="edit-input"
            />
          ) : (
            <p>{employeeData.Email || '-'}</p>
          )}
        </div>
        <div className="info-item">
          <label>Slack ID</label>
          {isEditing ? (
            <input
              type="text"
              name="SlackID"
              value={editData.SlackID || ''}
              onChange={handleInputChange}
              className="edit-input"
            />
          ) : (
            <p>{employeeData.SlackID || '-'}</p>
          )}
        </div>
      </div>
      <div className="info-row">
        <div className="info-item">
          <label>Skype ID</label>
          {isEditing ? (
            <input
              type="text"
              name="SkypeID"
              value={editData.SkypeID || ''}
              onChange={handleInputChange}
              className="edit-input"
            />
          ) : (
            <p>{employeeData.SkypeID || '-'}</p>
          )}
        </div>
        <div className="info-item">
          <label>Github ID</label>
          {isEditing ? (
            <input
              type="text"
              name="GithubID"
              value={editData.GithubID || ''}
              onChange={handleInputChange}
              className="edit-input"
            />
          ) : (
            <p>{employeeData.GithubID || '-'}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderAttendanceTable = () => (
    <div className="attendance-table-container">
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Break</th>
            <th>Working Hours</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData?.length > 0 ? (
            attendanceData.map((row, idx) => (
              <tr key={idx}>
                <td>
                  {new Date(row.Date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                  })}
                </td>
                <td>{row.CheckInTime}</td>
                <td>{row.CheckOutTime}</td>
                <td>{row.Break || '00:00'} Hrs</td>
                <td>{row.WorkingHours || '00:00'} Hrs</td>
                <td>
                  <span
                    className={`status-badge ${
                      row.Status?.toLowerCase() === 'ontime'
                        ? 'on-time'
                        : 'late'
                    }`}
                  >
                    {row.Status?.toLowerCase() === 'ontime' ? 'On Time' : row.Status}
                  </span>
                </td>
              </tr>
            ))
           ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '1rem', color: '#666' }}>
                No attendance records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderProjectsTable = () => (
    <div className="attendance-table-container">
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Project Name</th>
            <th>Start Date</th>
            <th>Finish Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {projectData && projectData.length > 0 ? projectData.map((row, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{row.ProjectName}</td>
              <td>
                {row.StartDate ? 
                  new Date(row.StartDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: '2-digit' 
                  }) 
                  : '-'
                }
              </td>
              <td>
                {row.EndDate ? 
                  new Date(row.EndDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: '2-digit' 
                  }) 
                  : '-'
                }
              </td>
              <td>
                <span 
                  className={`status-badge ${row.Status === 'Completed' ? 'on-time' : 'late'}`}
                  style={row.Status === 'Completed'
                    ? { background: '#d1fae5', color: '#10b981' }
                    : { background: '#fff7e6', color: '#eab308' }
                  }
                >
                  {row.Status || '-'}
                </span>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', color: '#aaa' }}>No project data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderLeaveTable = () => {
    const calculateDays = (startDate, endDate) => {
      if (!startDate || !endDate) return 0;
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 เพื่อรวมวันเริ่มต้น
    };

    return (
      <div className="attendance-table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Duration</th>
              <th>Days</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaveData.length > 0 ? leaveData.map((row, idx) => (
              <tr key={idx}>
                <td>{new Date(row.StartDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit'
                })}</td>
                <td>{`${new Date(row.StartDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: '2-digit'
                })} - ${new Date(row.EndDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: '2-digit'
                })}`}</td>
                <td>{calculateDays(row.StartDate, row.EndDate)} Days</td>
                <td>{row.Reason || '-'}</td>
                <td>
                  <span
                    className={`status-badge ${
                      row.Status === 'Approved'
                        ? 'on-time'
                        : row.Status === 'Pending'
                        ? 'late'
                        : 'rejected'
                    }`}
                    style={
                      row.Status === 'Approved'
                        ? { background: '#d1fae5', color: '#10b981' }
                        : row.Status === 'Pending'
                        ? { background: '#fff7e6', color: '#eab308' }
                        : { background: '#fee2e2', color: '#ef4444' }
                    }
                  >
                    {row.Status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: '#aaa' }}>No leave data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const renderProfessionalInfo = () => {
    const experienceList = isEditing ? (editData.experience || []) : (employeeData?.experience || []);
    const educationList = isEditing ? (editData.education || []) : (employeeData?.education || []);
    return (
      <>
        <div className="info-section">
          <div className="section-header">
            <div className="section-title">Working Experience</div>
            {isEditing && (
              <button className="add-button btn-add-row" type="button" onClick={handleAddExperience}>
                + Add more
              </button>
            )}
          </div>
          <div className="work-history-section">
            <table className="work-history-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Position</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Salary</th>
                  {isEditing && <th></th>}
                </tr>
              </thead>
              <tbody>
                {experienceList.map((row, idx) => (
                  <React.Fragment key={idx}>
                    <tr>
                      <td>{isEditing ? (
                        <input type="text" name={`experience.${idx}.company`} value={row.company || ''} onChange={handleInputChange} />
                      ) : row.company || '-'}</td>
                      <td>{isEditing ? (
                        <input type="text" name={`experience.${idx}.position`} value={row.position || ''} onChange={handleInputChange} />
                      ) : row.position || '-'}</td>
                      <td>{isEditing ? (
                        <input type="month" name={`experience.${idx}.fromDate`} value={row.fromDate || ''} onChange={handleInputChange} />
                      ) : row.fromDate || '-'}</td>
                      <td>{isEditing ? (
                        <input type="month" name={`experience.${idx}.toDate`} value={row.toDate || ''} onChange={handleInputChange} />
                      ) : row.toDate || '-'}</td>
                      <td>{isEditing ? (
                        <input type="number" name={`experience.${idx}.salary`} value={row.salary || ''} onChange={handleInputChange} min="0" />
                      ) : (row.salary ? `฿${row.salary}` : '-')}</td>
                      {isEditing && (
                        <td>
                          {editData.experience.length > 1 && (
                            <button type="button" className="btn-remove-row" onClick={() => handleRemoveExperience(idx)} title="Remove">&times;</button>
                          )}
                        </td>
                      )}
                    </tr>
                    <tr>
                      <td colSpan={isEditing ? "6" : "5"} style={{ padding: "8px 16px", background: "#f8fafc" }}>
                        {isEditing ? (
                          <textarea
                            name={`experience.${idx}.jobDescription`}
                            value={row.jobDescription || ''}
                            onChange={handleInputChange}
                            rows="3"
                            placeholder="Enter job responsibilities and achievements..."
                            style={{
                              width: '100%',
                              padding: '8px',
                              borderRadius: '4px',
                              border: '1px solid #e2e8f0',
                              resize: 'vertical',
                              minHeight: '80px',
                            }}
                          />
                        ) : row.jobDescription || '-'}</td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="info-section">
          <div className="section-header">
            <div className="section-title">Educational Level</div>
            {isEditing && (
              <button className="add-button btn-add-row" type="button" onClick={handleAddEducation}>
                + Add more
              </button>
            )}
          </div>
          <div className="education-section">
            <table className="work-history-table">
              <thead>
                <tr>
                  <th>Education Level</th>
                  <th>Field of Study</th>
                  <th>Institution</th>
                  <th>Graduation Year</th>
                  {isEditing && <th></th>}
                </tr>
              </thead>
              <tbody>
                {educationList.map((edu, idx) => (
                  <tr key={idx}>
                    <td>
                      {isEditing ? (
                        <select name={`education.${idx}.level`} value={edu.level || ''} onChange={handleInputChange}>
                          <option value="">Select Education Level</option>
                          <option value="มัธยมศึกษาตอนปลาย">มัธยมศึกษาตอนปลาย</option>
                          <option value="ปวช.">ปวช.</option>
                          <option value="ปวท./ปวส.">ปวท./ปวส.</option>
                          <option value="ปริญญาตรี">ปริญญาตรี</option>
                          <option value="ปริญญาโท">ปริญญาโท</option>
                          <option value="ปริญญาเอก">ปริญญาเอก</option>
                        </select>
                      ) : edu.level || '-'}
                    </td>
                    <td>
                      {isEditing ? (
                        <input type="text" name={`education.${idx}.major`} value={edu.major || ''} onChange={handleInputChange} placeholder="Field of Study" />
                      ) : edu.major || '-'}
                    </td>
                    <td>
                      {isEditing ? (
                        <input type="text" name={`education.${idx}.institution`} value={edu.institution || ''} onChange={handleInputChange} placeholder="Institution" />
                      ) : edu.institution || '-'}
                    </td>
                    <td>
                      {isEditing ? (
                        <input type="number" name={`education.${idx}.graduationYear`} value={edu.graduationYear || ''} onChange={handleInputChange} placeholder="Year" min="1950" max="2025" />
                      ) : edu.graduationYear || '-'}
                    </td>
                    {isEditing && (
                      <td>
                        {editData.education.length > 1 && (
                          <button type="button" className="btn-remove-row" onClick={() => handleRemoveEducation(idx)} title="Remove">&times;</button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  const renderFamilyInfo = () => {
    return (
      <div className="info-container">
        <div className="info-section">
          <div className="section-title">Father's Information</div>
          <div className="info-row">
            <div className="info-item">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="FatherName"
                  value={editData.FatherName || ''}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              ) : (
                <span className="info-value">{employeeData?.FatherName || '-'}</span>
              )}
            </div>
            <div className="info-item">
              <label>Age</label>
              {isEditing ? (
                <input
                  type="number"
                  name="FatherAge"
                  value={editData.FatherAge || ''}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              ) : (
                <span className="info-value">{employeeData?.FatherAge || '-'}</span>
              )}
            </div>
          </div>
          <div className="info-row">
            <div className="info-item">
              <label>Occupation</label>
              {isEditing ? (
                <input
                  type="text"
                  name="FatherOccupation"
                  value={editData.FatherOccupation || ''}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              ) : (
                <span className="info-value">{employeeData?.FatherOccupation || '-'}</span>
              )}
            </div>
          </div>
        </div>

        <div className="info-section">
          <div className="section-title">Mother's Information</div>
          <div className="info-row">
            <div className="info-item">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="MotherName"
                  value={editData.MotherName || ''}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              ) : (
                <span className="info-value">{employeeData?.MotherName || '-'}</span>
              )}
            </div>
            <div className="info-item">
              <label>Age</label>
              {isEditing ? (
                <input
                  type="number"
                  name="MotherAge"
                  value={editData.MotherAge || ''}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              ) : (
                <span className="info-value">{employeeData?.MotherAge || '-'}</span>
              )}
            </div>
          </div>
          <div className="info-row">
            <div className="info-item">
              <label>Occupation</label>
              {isEditing ? (
                <input
                  type="text"
                  name="MotherOccupation"
                  value={editData.MotherOccupation || ''}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              ) : (
                <span className="info-value">{employeeData?.MotherOccupation || '-'}</span>
              )}
            </div>
          </div>
        </div>

        <div className="info-section">
          <div className="section-title">Spouse Information</div>
          <div className="info-row">
            <div className="info-item">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="SpouseName"
                  value={editData.SpouseName || ''}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              ) : (
                <span className="info-value">{employeeData?.SpouseName || '-'}</span>
              )}
            </div>
            <div className="info-item">
              <label>Age</label>
              {isEditing ? (
                <input
                  type="number"
                  name="SpouseAge"
                  value={editData.SpouseAge || ''}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              ) : (
                <span className="info-value">{employeeData?.SpouseAge || '-'}</span>
              )}
            </div>
          </div>
          <div className="info-row">
            <div className="info-item">
              <label>Occupation</label>
              {isEditing ? (
                <input
                  type="text"
                  name="SpouseOccupation"
                  value={editData.SpouseOccupation || ''}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              ) : (
                <span className="info-value">{employeeData?.SpouseOccupation || '-'}</span>
              )}
            </div>
          </div>
        </div>

        <div className="info-section">
          <div className="section-title">Family Details</div>
          <div className="info-row">
            <div className="info-item">
              <label>Number of Children</label>
              {isEditing ? (
                <input
                  type="number"
                  name="NumberOfChildren"
                  value={editData.NumberOfChildren || ''}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              ) : (
                <span className="info-value">{employeeData?.NumberOfChildren || '0'}</span>
              )}
            </div>
            <div className="info-item">
              <label>Birth Order</label>
              {isEditing ? (
                <input
                  type="number"
                  name="BirthOrder"
                  value={editData.BirthOrder || ''}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              ) : (
                <span className="info-value">{employeeData?.BirthOrder ? `${employeeData.BirthOrder}${getOrdinalSuffix(employeeData.BirthOrder)} Child` : '-'}</span>
              )}
            </div>
          </div>
          <div className="info-row">
            <div className="info-item">
              <label>Total Siblings (Including Employee)</label>
              {isEditing ? (
                <input
                  type="number"
                  name="TotalSiblings"
                  value={editData.TotalSiblings || ''}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              ) : (
                <span className="info-value">{employeeData?.TotalSiblings || '0'}</span>
              )}
            </div>
          </div>
          <div className="info-row">
            <div className="info-item">
              <label>Number of Brothers</label>
              {isEditing ? (
                <input
                  type="number"
                  name="NumberOfBrothers"
                  value={editData.NumberOfBrothers || ''}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              ) : (
                <span className="info-value">{employeeData?.NumberOfBrothers || '0'}</span>
              )}
            </div>
            <div className="info-item">
              <label>Number of Sisters</label>
              {isEditing ? (
                <input
                  type="number"
                  name="NumberOfSisters"
                  value={editData.NumberOfSisters || ''}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              ) : (
                <span className="info-value">{employeeData?.NumberOfSisters || '0'}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOtherInfo = () => {
    return (
      <div className="info-container">
        {/* Language Ability Section */}
        <div className="info-section">
          <div className="section-title">Language Ability</div>
          <div className="language-grid">
            <div className="language-row">
              <div className="language-label">Speaking:</div>
              <div className="language-options">
                {isEditing ? (
                  ['good', 'fair', 'poor'].map((value) => (
                    <label key={value}>
                      <input
                        type="radio"
                        name="speaking"
                        value={value}
                        checked={editData.speaking === value}
                        onChange={handleInputChange}
                      />
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </label>
                  ))
                ) : (
                  <span className="info-value">
                    {employeeData?.speaking ? 
                      employeeData.speaking.charAt(0).toUpperCase() + employeeData.speaking.slice(1) 
                      : '-'}
                  </span>
                )}
              </div>
            </div>

            <div className="language-row">
              <div className="language-label">Writing:</div>
              <div className="language-options">
                {isEditing ? (
                  ['good', 'fair', 'poor'].map((value) => (
                    <label key={value}>
                      <input
                        type="radio"
                        name="writing"
                        value={value}
                        checked={editData.writing === value}
                        onChange={handleInputChange}
                      />
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </label>
                  ))
                ) : (
                  <span className="info-value">
                    {employeeData?.writing ? 
                      employeeData.writing.charAt(0).toUpperCase() + employeeData.writing.slice(1) 
                      : '-'}
                  </span>
                )}
              </div>
            </div>

            <div className="language-row">
              <div className="language-label">Reading:</div>
              <div className="language-options">
                {isEditing ? (
                  ['good', 'fair', 'poor'].map((value) => (
                    <label key={value}>
                      <input
                        type="radio"
                        name="reading"
                        value={value}
                        checked={editData.reading === value}
                        onChange={handleInputChange}
                      />
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </label>
                  ))
                ) : (
                  <span className="info-value">
                    {employeeData?.reading ? 
                      employeeData.reading.charAt(0).toUpperCase() + employeeData.reading.slice(1) 
                      : '-'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Criminal Record Section */}
        <div className="info-section">
          <div className="section-title">ประวัติทางกฎหมาย</div>
          <div className="criminal-record-container">
            <div className="criminal-record-question">
              <div className="info-row">
                <div className="info-item">
                  <label>เคยต้องโทษทางแพ่งหรืออาญาหรือไม่</label>
                  {isEditing ? (
                    <div className="criminal-options">
                      <label>
                        <input
                          type="radio"
                          name="hasCriminalRecord"
                          value="yes"
                          checked={editData.hasCriminalRecord === 'yes'}
                          onChange={handleInputChange}
                        />
                        เคย
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="hasCriminalRecord"
                          value="no"
                          checked={editData.hasCriminalRecord === 'no'}
                          onChange={handleInputChange}
                        />
                        ไม่เคย
                      </label>
                    </div>
                  ) : (
                    <span className="info-value">
                      {employeeData?.hasCriminalRecord === 'yes' ? 'เคย' : 
                       employeeData?.hasCriminalRecord === 'no' ? 'ไม่เคย' : '-'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {(isEditing ? editData.hasCriminalRecord === 'yes' : employeeData?.hasCriminalRecord === 'yes') && (
              <div className="criminal-details">
                <div className="info-row">
                  <div className="info-item full-width">
                    <label>รายละเอียด</label>
                    {isEditing ? (
                      <textarea
                        name="criminalDetails"
                        value={editData.criminalDetails || ''}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="โปรดระบุรายละเอียดความผิดและโทษที่ได้รับ"
                      />
                    ) : (
                      <span className="info-value">{employeeData?.criminalDetails || '-'}</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Work Relocation Section */}
        <div className="info-section">
          <div className="section-title">การปฏิบัติงานต่างจังหวัด</div>
          <div className="info-row">
            <div className="info-item">
              <label>สามารถไปปฏิบัติงานต่างจังหวัดได้หรือไม่</label>
              {isEditing ? (
                <div className="relocation-options">
                  <label>
                    <input
                      type="radio"
                      name="canRelocate"
                      value="yes"
                      checked={editData.canRelocate === 'yes'}
                      onChange={handleInputChange}
                    />
                    ได้
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="canRelocate"
                      value="no"
                      checked={editData.canRelocate === 'no'}
                      onChange={handleInputChange}
                    />
                    ไม่ได้
                  </label>
                </div>
              ) : (
                <span className="info-value">
                  {employeeData?.canRelocate === 'yes' ? 'ได้' : 
                   employeeData?.canRelocate === 'no' ? 'ไม่ได้' : '-'}
                </span>
              )}
            </div>
          </div>
        </div>        {/* Emergency Contact Section */}
        <div className="info-section">
          <div className="section-title">บุคคลที่ติดต่อได้กรณีฉุกเฉิน</div>
          <div className="emergency-contacts-container">
            {/* บุคคลที่ติดต่อได้กรณีฉุกเฉิน บุคคลที่ 1 */}
            <div className="emergency-contact-card">
              <div className="contact-card-header">
                <div className="contact-number-badge">1</div>
                <div className="contact-card-title">บุคคลที่ติดต่อได้กรณีฉุกเฉิน คนที่ 1</div>
              </div>
              <div className="contact-info-grid">
                <div className="contact-info-item">
                  <div className="contact-info-label">ชื่อ-นามสกุล</div>
                  {isEditing ? (
                    <input
                      type="text"
                      name="emergencyContactName1"
                      value={editData.emergencyContactName1 || ''}
                      onChange={handleInputChange}
                      className="contact-info-input"
                      placeholder="กรุณากรอกชื่อ-นามสกุล"
                    />
                  ) : (
                    <div className="contact-info-value">{employeeData?.emergencyContactName1 || '-'}</div>
                  )}
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-label">ความเกี่ยวข้องกับผู้สมัคร</div>
                  {isEditing ? (
                    <input
                      type="text"
                      name="emergencyContactRelation1"
                      value={editData.emergencyContactRelation1 || ''}
                      onChange={handleInputChange}
                      className="contact-info-input"
                      placeholder="กรุณาระบุความเกี่ยวข้อง"
                    />
                  ) : (
                    <div className="contact-info-value">{employeeData?.emergencyContactRelation1 || '-'}</div>
                  )}
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-label">เบอร์โทรศัพท์</div>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="emergencyContactPhone1"
                      value={editData.emergencyContactPhone1 || ''}
                      onChange={handleInputChange}
                      className="contact-info-input"
                      placeholder="กรุณากรอกเบอร์โทรศัพท์"
                    />
                  ) : (
                    <div className="contact-info-value">{employeeData?.emergencyContactPhone1 || '-'}</div>
                  )}
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-label">ที่อยู่</div>
                  {isEditing ? (
                    <textarea
                      name="emergencyContactAddress1"
                      value={editData.emergencyContactAddress1 || ''}
                      onChange={handleInputChange}
                      className="contact-info-textarea"
                      placeholder="กรุณากรอกที่อยู่"
                    />
                  ) : (
                    <div className="contact-info-value">{employeeData?.emergencyContactAddress1 || '-'}</div>
                  )}
                </div>
              </div>
            </div>

            {/* บุคคลที่ติดต่อได้กรณีฉุกเฉิน บุคคลที่ 2 */}
            <div className="emergency-contact-card">
              <div className="contact-card-header">
                <div className="contact-number-badge">2</div>
                <div className="contact-card-title">บุคคลที่ติดต่อได้กรณีฉุกเฉิน คนที่ 2</div>
              </div>
              <div className="contact-info-grid">
                <div className="contact-info-item">
                  <div className="contact-info-label">ชื่อ-นามสกุล</div>
                  {isEditing ? (
                    <input
                      type="text"
                      name="emergencyContactName2"
                      value={editData.emergencyContactName2 || ''}
                      onChange={handleInputChange}
                      className="contact-info-input"
                      placeholder="กรุณากรอกชื่อ-นามสกุล"
                    />
                  ) : (
                    <div className="contact-info-value">{employeeData?.emergencyContactName2 || '-'}</div>
                  )}
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-label">ความเกี่ยวข้องกับผู้สมัคร</div>
                  {isEditing ? (
                    <input
                      type="text"
                      name="emergencyContactRelation2"
                      value={editData.emergencyContactRelation2 || ''}
                      onChange={handleInputChange}
                      className="contact-info-input"
                      placeholder="กรุณาระบุความเกี่ยวข้อง"
                    />
                  ) : (
                    <div className="contact-info-value">{employeeData?.emergencyContactRelation2 || '-'}</div>
                  )}
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-label">เบอร์โทรศัพท์</div>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="emergencyContactPhone2"
                      value={editData.emergencyContactPhone2 || ''}
                      onChange={handleInputChange}
                      className="contact-info-input"
                      placeholder="กรุณากรอกเบอร์โทรศัพท์"
                    />
                  ) : (
                    <div className="contact-info-value">{employeeData?.emergencyContactPhone2 || '-'}</div>
                  )}
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-label">ที่อยู่</div>
                  {isEditing ? (
                    <textarea
                      name="emergencyContactAddress2"
                      value={editData.emergencyContactAddress2 || ''}
                      onChange={handleInputChange}
                      className="contact-info-textarea"
                      placeholder="กรุณากรอกที่อยู่"
                    />
                  ) : (
                    <div className="contact-info-value">{employeeData?.emergencyContactAddress2 || '-'}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Helper function for ordinal suffixes
  const getOrdinalSuffix = (number) => {
    const j = number % 10,
          k = number % 100;
    if (j == 1 && k != 11) return "st";
    if (j == 2 && k != 12) return "nd";
    if (j == 3 && k != 13) return "rd";
    return "th";
  };

  // Define the calculateAge function
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return '-';
    const dob = new Date(dateOfBirth);
    const today = new Date('2025-06-06'); // Use current date
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  // Add the Other tab case in renderActiveTabContent
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <>
            <div className="info-section">
              <div className="section-title">Personal Information</div>
              {renderPersonalInformation()}
            </div>

            <div className="info-section">
              <div className="section-title">Employee Information</div>
              {renderEmployeeInfo()}
            </div>

            <div className="info-section">
              <div className="section-title">Bank Information</div>
                           <div className="info-container">
                <div className="info-row">
                  <div className="info-item">
                    <label>Bank Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="BankName"
                        value={editData.BankName || ''}
                        onChange={handleInputChange}
                        className="edit-input"
                      />
                    ) : (
                      <span className="info-value">{employeeData?.BankName || '-'}</span>
                    )}
                  </div>
                  <div className="info-item">
                    <label>Account Holder Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="AccountHolderName"
                        value={editData.AccountHolderName || ''}
                        onChange={handleInputChange}
                        className="edit-input"
                      />
                    ) : (
                      <span className="info-value">{employeeData?.AccountHolderName || '-'}</span>
                    )}
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-item">
                    <label>Account Number</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="AccountNumber"
                        value={editData.AccountNumber || ''}
                        onChange={handleInputChange}
                        className="edit-input"
                      />
                    ) : (
                      <span className="info-value">{employeeData?.AccountNumber || '-'}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 'family':
        return renderFamilyInfo();
      case 'documents':
        return (
          <div className="info-section">
            <div className="section-title">Documents</div>
            {renderDocuments()}
          </div>
        );
      case 'professional':
        return renderProfessionalInfo();
      case 'other':
        return renderOtherInfo();
      default:
        return null;
    }
  };

  if (!employeeData) {
    return (
      <div className="dashboard-container">
        <SideMenu isMinimized={isMinimized} onToggleMinimize={() => setIsMinimized(!isMinimized)} />
        <div className="dashboard-main">
          <Topbar pageTitle="Employee Profile" pageSubtitle="Loading..." />
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <SideMenu isMinimized={isMinimized} onToggleMinimize={() => setIsMinimized(!isMinimized)} />
      <div className={`dashboard-main ${isMinimized ? 'expanded' : ''}`}>
        <ul className="circles">
          <li></li><li></li><li></li><li></li><li></li>
          <li></li><li></li><li></li><li></li><li></li>
          <li></li><li></li><li></li><li></li><li></li>
        </ul>
        <ul className="circles-bottom">
          <li></li><li></li><li></li><li></li><li></li>
          <li></li><li></li><li></li><li></li><li></li>
          <li></li><li></li><li></li><li></li><li></li>
        </ul>

        <Topbar 
          pageTitle={id === currentEmployeeId ? 'My Profile' : `All Employees > ${employeeData?.FName || ''} ${employeeData?.LName || ''}`}
          pageSubtitle="" 
        />
        <div className="profile-header-section">
          <div className="profile-header-info">
            <div className="profile-image-wrapper">
              <img
                src={isEditing ? (editData.ImageUrl || '/src/assets/profile.png') : (employeeData.ImageUrl || '/src/assets/profile.png')}
                alt="Profile"
                className={`profile-image${isEditing ? ' editable' : ''}`}
                onClick={isEditing ? () => document.getElementById('profile-image-input').click() : undefined}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/src/assets/profile.png';
                }}
              />
              {isEditing && (
                <>
                  <input
                    id="profile-image-input"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleProfileImageChange}
                  />
                  <div className="profile-image-overlay">
                    <svg width="32" height="32" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/><path d="M2 7.5V17a2.5 2.5 0 0 1 2.5 2.5h15A2.5 2.5 0 0 1 22 17V7.5M16.5 7.5l-1.38-2.07A2 2 0 0013.5 4.5h-3a2 2 0 00-1.62.93L7.5 7.5"/></svg>
                  </div>
                </>
              )}
            </div>
            <div>
              <h2 className="profile-name">
                {`${employeeData.FName} ${employeeData.LName}`}
                {employeeData.Nickname && ` (${employeeData.Nickname})`}
              </h2>
              <span className="profile-role">
                <svg width="18" height="18" style={{verticalAlign: 'middle', marginRight: 4}} fill="none" stroke="#22223b" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 21v-2a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2h-2v-2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2H3z"/><circle cx="12" cy="7" r="4"/></svg>
                {employeeData.Position || '-'}
              </span>
              <span className="profile-email">
                <svg width="18" height="18" style={{verticalAlign: 'middle', marginRight: 4}} fill="none" stroke="#22223b" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 6-10 7L2 6"/></svg>
                {employeeData.Email || '-'}
              </span>
            </div>
          </div>          {isEditing ? (
            <div className="edit-action-group">
              <button className="edit-profile-btn save" onClick={handleSave} type="button">
                <FiSave className="save-icon" />
                Save
              </button>
              <button className="edit-profile-btn cancel" onClick={handleCancelEdit} type="button">
                Cancel
              </button>
            </div>          ) : (
            (userRole === 'superadmin' || id === currentEmployeeId) && (
              <button className="edit-profile-btn" onClick={handleEditClick} disabled={isEditing}>
                <FiEdit2 className="edit-icon" />
                Edit Profile
              </button>
            )
          )}
        </div>
        <div className="profile-main-content">
          <div className="profile-tabs">
            {mainTabs.map(tab => (
              <button
                key={tab.key}
                className={`tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.icon}
                <span style={{ marginLeft: 8 }}>{tab.label}</span>
              </button>
            ))}
          </div>
          <div className="profile-content">
            {renderActiveTabContent()}
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Save */}
      {showSaveConfirm && (
        <div className="save-confirm-overlay">
          <div className="save-confirm-modal">
            <div className="save-confirm-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </div>
            <h3>Save Changes?</h3>
            <p>Are you sure you want to save these changes?</p>
            <div className="save-confirm-buttons">
              <button className="btn-cancel" onClick={() => setShowSaveConfirm(false)}>
                Cancel
              </button>
              <button className="btn-save" onClick={handleConfirmSave}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ฟังก์ชันสำหรับอัปโหลดและ preview รูปโปรไฟล์
function handleProfileImageChange(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditData(prev => ({ ...prev, ImageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  }
}

export default ProfileDetail;