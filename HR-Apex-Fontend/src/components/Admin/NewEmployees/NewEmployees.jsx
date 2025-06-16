import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiUser, FiUpload, FiFile, FiCheck, FiBriefcase, FiUsers, FiMoreHorizontal } from 'react-icons/fi'
import SideMenu from '../SideMenu/Side_menu'
import Topbar from '../Topbar/Topbar'
import './NewEmployees.css'
import '../AnimationCircles/AnimationCircles.css'
import axios from 'axios'
import { motion } from 'framer-motion'

const truncateFileName = (fileName) => {
  if (!fileName) return '';
  if (fileName.length <= 25) return fileName;
  const extension = fileName.split('.').pop();
  const name = fileName.substring(0, fileName.lastIndexOf('.'));
  return `${name.substring(0, 15)}...${extension}`;
};

const NewEmployees = () => {
 const [formData, setFormData] = useState({
    // ข้อมูลพื้นฐาน
    first_name: '',
    last_name: '',
    nickname: '',
    mobile_no: '',
    email_person: '',
    gender: 'MALE',
    birth_date: '2008-01-01',
    position: '',
    salary: '',
    start_date: '2008-01-01',
    status_employee: 'ACTIVE',
    create_name: '',
    modify_name: '',
    nationality: '',
    religion: '',
    marital_status: 'single',
    line_id: '',
    
    // ข้อมูลบัตรประชาชน
    id_card_number: '',
    id_card_issued_date: '2008-01-01',
    id_card_expiry_date: '2008-01-01',
    
    // ข้อมูลงาน
    probation_end_date: '2008-01-01',
    employee_type_id: 1,
    
    // ข้อมูลธนาคาร
    bank_name: '',
    account_number: '',
    account_name: '',
    
    // ข้อมูลครอบครัว
    father_name: '',
    father_birthdate: '2008-01-01',
    father_occupation: '',
    mother_name: '',
    mother_birthdate: '2008-01-01',
    mother_occupation: '',
    spouse_name: '',
    spouse_birthdate: '2008-01-01',
    spouse_occupation: '',
    
    // ข้อมูลพี่น้อง
    total_boys: 0,
    total_girls: 0,
    total_siblings: 0,
    order_of_siblings: 1,
    
    // ข้อมูลทักษะ
    language_speaking: '',
    language_reading: '',
    language_writing: '',
    
    // ข้อมูลอื่นๆ
    driving_license: false,
    have_own_car: false,
    military_status: '',
    criminal_record: 'no',
    upcountry_areas: '',
    total_children: 0,
    
    // ที่อยู่ตามบัตรประชาชน
    address_card_address: ''||null,
    address_card_sub_district: ''||null,
    address_card_district: '',
    address_card_province: '',
    address_card_postal_code: '',
    
    // ที่อยู่ปัจจุบัน
    address_house_address: '',
    address_house_sub_district: '',
    address_house_district: '',
    address_house_province: '',
    address_house_postal_code: '',
    
    // ข้อมูลผู้ติดต่อ
    contact_person1_name: '',
    contact_person1_relationship: '',
    contact_person1_mobile: '',
    contact_person1_address: '',
    contact_person2_name: '',
    contact_person2_relationship: '',
    contact_person2_mobile: '',
    contact_person2_address: '',
    
    // ข้อมูลบุตร (Array)
    children: [
      {
        child_name: '',
        child_birthdate: '2008-01-01'
      }
    ],
    
    // ข้อมูลพี่น้อง (Array)
    siblings_data: [
      {
        siblings_name: '',
        siblings_birthdate: '2008-01-01',
        siblings_occupation: '',
        siblings_mobile: ''
      }
    ],
    
    // ข้อมูลการศึกษา (Array)
    education_history_data: [
      {
        level: '',
        field: '',
        institution: '',
        year: ''
      }
    ],
    
    // ข้อมูลประสบการณ์ทำงาน (Array)
    work_experience_data: [
      {
        company: '',
        position: '',
        from_date: '2008-01-01',
        to_date: '2008-01-01',
        salary: '',
        detail: ''
      }
    ],
    
    // ไฟล์
    file_name: null, 
    father_age:'',
    mother_age:'', 
    profile_image:null
  });
  const [errors, setErrors] = useState({})
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      // Clear criminal details if hasCriminalRecord is set to 'no'
      if (name === 'hasCriminalRecord' && value === 'no') {
        return {
          ...prev,
          [name]: value,
          criminalDetails: ''
        }
      }
      return {
        ...prev,
        [name]: value
      }
    })
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }
  const addArrayItem = (arrayName, defaultItem) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], defaultItem]
    }));
  };

  // ฟังก์ชันสำหรับลบ item ใน array
  const removeArrayItem = (arrayName, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };
  const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    setFormData(prev => ({
      ...prev,
      profile_image: file
    }));
  }
};

  const handleFileUpload = (e, fieldName) => {
    const files = e.target.files
    if (files) {
      const fileArray = Array.from(files)
      setFormData(prev => ({
        ...prev,
        [fieldName]: prev[fieldName] ? [...prev[fieldName], ...fileArray] : fileArray
      }))
    }
  }

  const handleRemoveFile = (fieldName, index) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index)
    }))
  }

  const handleWorkHistoryChange = (idx, field, value) => {
    const updated = [...formData.work_experience_data]
    updated[idx][field] = value
    setFormData(prev => ({ ...prev,work_experience_data: updated }))
  }

  const handleEducationChange = (idx, field, value) => {
    const updated = [...formData.education_history_data]
    updated[idx][field] = value
    setFormData(prev => ({ ...prev, education_history_data: updated }))
  }
  const handleAddWorkHistory = () => {
    setFormData(prev => ({
      ...prev,
      work_experience_data: [...prev.work_experience_data, { company: '', position: '', to_date: '', from_date: '', salary: '', detail: '' }]
    }))
  }

  const handleAddEducation = () => {
    setFormData(prev => ({
      ...prev,
      educationHistory: [...prev.educationHistory, { level: '', field: '', institution: '', year: '' }]
    }))
  }

  const handleRemoveWorkHistory = (idx) => {
    setFormData(prev => ({
      ...prev,
      workHistory: prev.workHistory.filter((_, i) => i !== idx)
    }))
  }
useEffect(() => {
  const totalChildren = parseInt(formData.total_children) || 0;
  const currentChildren = formData.children || [];
  
  if (currentChildren.length !== totalChildren) {
    const newChildren = Array.from({ length: totalChildren }, (_, index) => ({
      child_name: currentChildren[index]?.child_name || '',
      child_birthdate: currentChildren[index]?.child_birthdate || '2010-01-15'
    }));
    
    setFormData(prev => ({ ...prev, children: newChildren }));
  }
  const totalSiblings = parseInt(formData.total_siblings) || 0;
  const currentSiblings = formData.siblings_data || [];
  if (currentSiblings.length !== totalSiblings) {
    const newChildren = Array.from({ length: totalSiblings }, (_, index) => ({
      siblings_name: currentChildren[index]?.siblings_name || '',
     siblings_birthdate: currentChildren[index]?.siblings_birthdate || '2010-01-15'
    }));
    
    setFormData(prev => ({ ...prev, siblings_data: newChildren }));
  }

}, [formData.total_siblings]);
  const handleRemoveEducation = (idx) => {
    setFormData(prev => ({
      ...prev,
      educationHistory: prev.educationHistory.filter((_, i) => i !== idx)
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Validate Personal Information
    // if (!formData.firstName) newErrors.firstName = 'First Name is required'
    // if (!formData.lastName) newErrors.lastName = 'Last Name is required'
    // if (!formData.email) newErrors.email = 'Email is required'
    // if (!formData.phone) newErrors.phone = 'Phone is required'
    // if (!formData.dob) newErrors.dob = 'Date of Birth is required'
    // if (!formData.gender) newErrors.gender = 'Gender is required'
    
    // Validate Professional Information
    // if (!formData.position) newErrors.position = 'Position is required'
    // if (!formData.type) newErrors.type = 'Type is required'
    // if (!formData.status) newErrors.status = 'Status is required'
    // if (!formData.startDate) newErrors.startDate = 'Start Date is required'
    // if (!formData.salary) newErrors.salary = 'Salary is required'
    
    // Validate Bank Information
    // if (!formData.bankName) newErrors.bankName = 'Bank Name is required'
    // if (!formData.accountNumber) newErrors.accountNumber = 'Account Number is required'
    // if (formData.accountNumber && !/^\d{10,12}$/.test(formData.accountNumber)) {
    //   newErrors.accountNumber = 'Account Number must be 10-12 digits'
    // }

    return newErrors
  }
const handleChildInputChange = (index, field, value) => {
  const updatedChildren = [...(formData.children || [])];
  
  // Ensure the array item exists
  if (!updatedChildren[index]) {
    updatedChildren[index] = {
      child_name: '',
      child_birthdate: ''
    };
  }
  

  
  updatedChildren[index] = {
    ...updatedChildren[index],
    [field]: value,
  };
  
  setFormData({ ...formData, children: updatedChildren });
};

const handleSiblingInputChange = (index, field, value) => {
  setFormData(prev => {
    const updatedSiblings = [...(prev.siblings_data || [])];
    
    // Ensure the array item exists
    if (!updatedSiblings[index]) {
      updatedSiblings[index] = {
        siblings_name: '',
        siblings_birthdate: '2010-01-15',
        siblings_occupation: '',
        siblings_mobile: ''
      };
    }
    
    // Update the specific field
    updatedSiblings[index] = {
      ...updatedSiblings[index],
      [field]: value
    };
    
    return {
      ...prev,
      siblings_data: updatedSiblings
    };
  });
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    
    // เพิ่มข้อมูลพื้นฐาน

     const allFiles = [];
  
  // รวบรวมไฟล์จากทุกประเภท
  ['jobApplication', 'certificate', 'nationalId', 'householdRegistration', 
   'bankBook', 'employmentContract'].forEach(documentType => {
    if (formData[documentType] && formData[documentType].length > 0) {
      allFiles.push(...formData[documentType]);
    }
  });
  
  // เพิ่มไฟล์ทั้งหมดลงใน file_name (key เดียวกัน - multiple files)
  allFiles.forEach((file) => {
    formDataToSend.append('file_name', file);
  });

    if (formData.children && formData.children.length > 0) {
    formData.children.forEach((child, index) => {
      if (child && child.child_name) { // Only add if child has a name
        formDataToSend.append(`children_data[${index}][child_name]`, child.child_name || '');
        
        // Handle birthdate - send null if undefined/empty
        const birthdate = child.child_birthdate;
        if (birthdate && birthdate !== 'undefined' && birthdate !== '') {
          formDataToSend.append(`children_data[${index}][child_birthdate]`, birthdate);
        } else {
          formDataToSend.append(`children_data[${index}][child_birthdate]`, ''); // or omit this line to send null
        }
      }
    });
  }
  
    Object.keys(formData).forEach(key => {
      if (key === 'children' || key === 'siblings_data' || 
          key === 'education_history_data' || key === 'work_experience_data') {
        // จัดการ array data
        formData[key].forEach((item, index) => {
          Object.keys(item).forEach(field => {
            formDataToSend.append(`${key}[${index}][${field}]`, item[field]);
          });
        });
      } else if (!['jobApplication', 'certificate', 'nationalId', 'householdRegistration', 
                 'bankBook', 'employmentContract', 'file_name'].includes(key)) {
      if (typeof formData[key] === 'boolean') {
        formDataToSend.append(key, formData[key] ? 'true' : 'false');
      } else if (formData[key] !== null && formData[key] !== undefined) {
        formDataToSend.append(key, formData[key]);
      }
    } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch('http://localhost:5000/api/employee/addemployee', {
        method: 'POST',
        body: formDataToSend
      });

       setShowSuccessPopup(true)
      if (response.ok) {
        console.log('Employee added successfully');
        // Reset form หรือทำอะไรต่อตามต้องการ
      } else {
        console.error('Failed to add employee');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const handleSuccessClose = () => {
    setShowSuccessPopup(false)
    navigate('/employees')
  }

  // Tab configuration
  const tabs = [
    {
      key: 'personal',
      label: 'Personal Info',
      icon: <FiUser />
    },
    {
      key: 'experience',
      label: 'Experience',
      icon: <FiBriefcase />
    },
    {
      key: 'family',
      label: 'Family Info',
      icon: <FiUsers />
    },
    {
      key: 'documents',
      label: 'Documents',
      icon: <FiFile />
    },
    {
      key: 'other',
      label: 'Other Info',
      icon: <FiMoreHorizontal />
    }
  ];

  return (
    <div className="dashboard-container">
      <SideMenu
        isMinimized={isMinimized}
        onToggleMinimize={setIsMinimized}
        mobileOpen={mobileOpen}
        onCloseMobileMenu={() => setMobileOpen(false)}
      />
      <div className="dashboard-main">
        <Topbar onMobileMenuClick={() => setMobileOpen(true)} />
        <div className="tabs-container">
          <div className="tabs">
            {tabs.map(tab => (
              <button
                key={tab.key}
                className={`tab${activeTab === tab.key ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
                type="button"
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        <motion.div 
          className="dashboard-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="employee-form">
            {/* Personal Information Section */}
            {activeTab === 'personal' && (
              <div className="form-section">
                <h2 className="section-title">Personal Information</h2>
                
                <div className="profile-upload">
                  <input
                    type="file"
                    id="profile-image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    hidden
                  />
                  <label htmlFor="profile-image" className="upload-area">
                    {formData.profile_image ? (
                      <img src={formData.profile_image} alt="Profile" />
                    ) : (
                      <FiUser />
                    )}
                  </label>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name <span className="required">*</span></label>
                    <input
                      type="text"
                      name="first_name"
                      placeholder="Enter first name"
                      value={formData.first_name}
                      onChange={handleChange}
                    />
                    {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                  </div>

                  <div className="form-group">
                    <label>Last Name <span className="required">*</span></label>
                    <input
                      type="text"
                      name="last_name"
                      placeholder="Enter last name"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                    {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                  </div>

                  <div className="form-group">
                    <label>Nickname</label>
                    <input
                      type="text"
                      name="nickname"
                      placeholder="Enter nickname"
                      value={formData.nickname}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email <span className="required">*</span></label>
                    <input
                      type="email"
                      name="email_person"
                      placeholder="Enter email"
                      value={formData.email_person}
                      onChange={handleChange}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label>Phone <span className="required">*</span></label>
                    <input
                      type="tel"
                      name="mobile_no"
                      placeholder="Enter phone number"
                      value={formData.mobile_no}
                      onChange={handleChange}
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label>Date of Birth <span className="required">*</span></label>
                    <input
                      type="date"
                      name="birth_date"
                      value={formData.birth_date}
                      onChange={handleChange}
                    />
                    {errors.dob && <span className="error-text">{errors.dob}</span>}
                  </div>

                  <div className="form-group">
                    <label>Gender <span className="required">*</span></label>
                    <select name="gender" value={formData.gender} onChange={handleChange}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
          
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Religion</label>
                    <select name="religion" value={formData.religion} onChange={handleChange}>
                      <option value="">Select religion</option>
                      <option value="พุทธศาสนา">พุทธศาสนา</option>
                      <option value="คริสต์ศาสนา">คริสต์ศาสนา</option>
                      <option value="อิสลาม">อิสลาม</option>
                      <option value="ศาสนาฮินดู">ศาสนาฮินดู</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Marital Status</label>
                    <select name="marital_status" value={formData.marital_status} onChange={handleChange}>
                      <option value="">Select status</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Nationality</label>
                    <input
                      type="text"
                      name="nationality"
                      placeholder="Enter nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>ID Card Number</label>
                    <input
                      type="text"
                      name="id_card_number"
                      placeholder="Enter ID card number"
                      value={formData.id_card_numbers}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Issue Date</label>
                    <input
                      type="date"
                      name="id_card_issued_date"
                      value={formData.id_card_issued_date}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Expiration Date</label>
                    <input
                      type="date"
                      name="id_card_expiry_date"
                      value={formData.id_card_expiry_date}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Personal Email</label>
                    <input
                      type="email"
                      name="email_person"
                      placeholder="Enter personal email"
                      value={formData.email_person}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Line ID</label>
                    <input
                      type="text"
                      name="line_id"
                      placeholder="Enter Line ID"
                      value={formData.line_id}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="form-group full-width">
                  <div className="addresses-container">
                    <div className="address-section">
                      <h3>ID Card Address</h3>
                      <div className="form-group full-width">
                        <label>Address</label>
                        <textarea
                          name="idCardAddress"
                          placeholder="Enter ID card address"
                          value={formData.address_card_address}
                          onChange={handleChange}
                          rows="3"
                        />
                      </div>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Subdistrict</label>
                          <input
                            type="text"
                            name="address_card_sub_district"
                            placeholder="Enter subdistrict"
                            value={formData.address_card_sub_district}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>District</label>
                          <input
                            type="text"
                            name="address_card_district"
                            placeholder="Enter district"
                            value={formData.address_card_district}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>Province</label>
                          <input
                            type="text"
                            name="address_card_province"
                            placeholder="Enter province"
                            value={formData.address_card_province}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>Zip Code</label>
                          <input
                            type="text"
                            name="address_card_postal_code"
                            placeholder="Enter zip code"
                            value={formData.address_card_postal_code}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="address-section">
                      <h3>Current Address</h3>
                      <div className="form-group full-width">
                        <label>Address</label>
                        <textarea
                          name="address_house_address"
                          placeholder="Enter current address"
                          value={formData.address_house_address}
                          onChange={handleChange}
                          rows="3"
                        />
                      </div>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Subdistrict</label>
                          <input
                            type="text"
                            name="address_house_sub_district"
                            placeholder="Enter subdistrict"
                            value={formData.address_house_sub_district}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>District</label>
                          <input
                            type="text"
                            name="address_house_district"
                            placeholder="Enter district"
                            value={formData.address_house_district}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>Province</label>
                          <input
                            type="text"
                            name="address_house_province"
                            placeholder="Enter province"
                            value={formData.address_house_province}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>Zip Code</label>
                          <input
                            type="text"
                            name="address_house_postal_code"
                            placeholder="Enter zip code"
                            value={formData.address_house_postal_code}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Professional Information Section */}
            {activeTab === 'personal' && (
              <div className="form-section">
                <h2 className="section-title">Professional Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Position <span className="required">*</span></label>
                    <input
                      type="text"
                      name="position"
                      placeholder="Enter position"
                      value={formData.position}
                      onChange={handleChange}
                    />
                    {errors.position && <span className="error-text">{errors.position}</span>}
                  </div>

                  <div className="form-group">
                    <label>Type <span className="required">*</span></label>
                    <select name="type" value={formData.employee_type_id} onChange={handleChange}>
                      <option value="">Select type</option>
                      <option value="1">Permanent</option>
                      <option value="2">Contract</option>
                      <option value="3">Intern</option>
                      <option value="4">Freelance</option>
                    </select>
                    {errors.type && <span className="error-text">{errors.type}</span>}
                  </div>

                  <div className="form-group">
                    <label>Status <span className="required">*</span></label>
                    <select name="status" value={formData.status} onChange={handleChange}>
                      <option value="">Select status</option>
                      <option value="Active">Active</option>
                      <option value="InActive">InActive</option>
                    </select>
                    {errors.status && <span className="error-text">{errors.status}</span>}
                  </div>

                  <div className="form-group">
                    <label>Start Date <span className="required">*</span></label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                    />
                    {errors.startDate && <span className="error-text">{errors.startDate}</span>}
                  </div>

                  <div className="form-group">
                    <label>Salary <span className="required">*</span></label>
                    <input
                      type="number"
                      name="salary"
                      placeholder="Enter salary"
                      value={formData.salary}
                      onChange={handleChange}
                    />
                    {errors.salary && <span className="error-text">{errors.salary}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Work History */}
            {activeTab === 'experience' && (
              <div className="work-history-section experience-bg" style={{ backgroundImage: 'url(/src/assets/bgdashboard.png)', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '12px', padding: '24px 16px', marginBottom: '24px', backgroundColor: 'rgba(255,255,255,0.85)' }}>
                <h3>Work History</h3>
                <table className="work-history-table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Position</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Salary</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>                    
                    {formData.work_experience_data.map((work, idx) => (
                      <React.Fragment key={idx}>
                        <tr>
                          <td>
                            <input
                              type="text"
                              placeholder="Company name"
                              value={work.company}
                              onChange={e => handleWorkHistoryChange(idx, 'company', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="Position"
                              value={work.position}
                              onChange={e => handleWorkHistoryChange(idx, 'position', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="month"
                              value={work.to_date}
                              onChange={e => handleWorkHistoryChange(idx, 'to_date', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="month"
                              value={work.from_date}
                              onChange={e => handleWorkHistoryChange(idx, 'from_date', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              placeholder="Salary"
                              value={work.salary}
                              onChange={e => handleWorkHistoryChange(idx, 'salary', e.target.value)}
                            />
                          </td>
                          <td>
                            {formData.work_experience_data.length > 1 && (
                              <button
                                type="button"
                                className="btn-remove-row"
                                onClick={() => handleRemoveWorkHistory(idx)}
                              >
                                ×
                              </button>
                            )}
                          </td>
                        </tr>
                        <tr className="description-row">
                          <td colSpan="6">
                            <textarea
                              placeholder="Job description"
                              value={work.detail}
                              onChange={e => handleWorkHistoryChange(idx, 'detail', e.target.value)}
                              rows="3"
                              className="work-description"
                            />
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
                <button type="button" className="btn-add-row" onClick={handleAddWorkHistory}>
                  + Add Work History
                </button>
              </div>
            )}

            {/* Education History */}
            {activeTab === 'experience' && (
              <div className="education-section experience-bg" style={{ backgroundImage: 'url(/src/assets/bgdashboard.png)', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '12px', padding: '24px 16px', marginBottom: '24px', backgroundColor: 'rgba(255,255,255,0.85)' }}>
                <h3>Education History</h3>
                <table className="work-history-table">
                  <thead>
                    <tr>
                      <th>Level</th>
                      <th>Field of Study</th>
                      <th>Institution</th>
                      <th>Year</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.education_history_data.map((edu, idx) => (
                      <tr key={idx}>
                        <td>
                          <select
                            value={edu.level}
                            onChange={e => handleEducationChange(idx, 'level', e.target.value)}
                          >
                            <option value="">Select Level</option>
                            <option value="high_school">High School</option>
                            <option value="vocational">Vocational Certificate</option>
                            <option value="high_vocational">Higher Vocational Certificate</option>
                            <option value="bachelor">Bachelor's Degree</option>
                            <option value="master">Master's Degree</option>
                            <option value="doctorate">Doctorate's Degree</option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="Field of study"
                            value={edu.field}
                            onChange={e => handleEducationChange(idx, 'field', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="Institution name"
                            value={edu.institution}
                            onChange={e => handleEducationChange(idx, 'institution', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            placeholder="Year"
                            value={edu.year}
                            onChange={e => handleEducationChange(idx, 'year', e.target.value)}
                            min="1950"
                            max="2025"
                          />
                        </td>
                        <td>
                          {formData.education_history_data.length > 1 && (
                            <button
                              type="button"
                              className="btn-remove-row"
                              onClick={() => handleRemoveEducation(idx)}
                            >
                              ×
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button type="button" className="btn-add-row" onClick={handleAddEducation}>
                  + Add Education
                </button>
              </div>
            )}

            {/* Bank Information Section */}
            {activeTab === 'personal' && (
              <div className="form-section">
                <h2 className="section-title">Bank Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Bank Name <span className="required">*</span></label>
                    <input
                      type="text"
                      name="bank_name"
                      placeholder="Enter bank name"
                      value={formData.bank_name}
                      onChange={handleChange}
                    />
                    {errors.bankName && <span className="error-text">{errors.bankName}</span>}
                  </div>

                  <div className="form-group">
                    <label>Account Holder Name</label>
                    <input
                      type="text"
                      name="account_name"
                      placeholder="Enter account holder name"
                      value={formData.account_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Account Number <span className="required">*</span></label>
                    <input
                      type="text"
                      name="account_number"
                      placeholder="Enter account number (10-12digits)"
                      value={formData.account_number}
                      onChange={handleChange}
                    />
                    {errors.accountNumber && <span className="error-text">{errors.accountNumber}</span>}
                  </div>
                </div>
              </div>
            )}

{activeTab === 'family' && (
              <div className="form-section">
                <h2 className="section-title">Family Information</h2>
                
                {/* Father's Information */}
                <div className="family-section">
                  <h3>Father's Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="father_name"
                        placeholder="Father's name"
                        value={formData.father_name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Occupation</label>
                      <input
                        type="text"
                        name="father_occupation"
                        placeholder="Father's occupation"
                        value={formData.father_occupation}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        name="father_birthdate"
                        value={formData.father_birthdate}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Age</label>
                      <input
                        type="number"
                        name="father_age"
                        placeholder="please enter ager"
                        value={formData.father_age}
                        onChange={handleChange}
                  
                      />
                    </div>
                  </div>
                </div>

                {/* Mother's Information */}
                <div className="family-section">
                  <h3>Mother's Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="mother_name"
                        placeholder="Mother's name"
                        value={formData.mother_name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Occupation</label>
                      <input
                        type="text"
                        name="mother_occupation"
                        placeholder="Mother's occupation"
                        value={formData.mother_occupation}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        name="mother_birthdate"
                        value={formData.mother_birthdate}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Age</label>
                      <input
                        type="number"
                        name="mother_age"
                        placeholder="-"
                        value={formData.mother_age}
                        onChange={handleChange}
                  
                      />
                    </div>
                  </div>
                </div>

                {/* Spouse Information */}
                <div className="family-section">
                  <h3>Spouse Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="spouse_name"
                        placeholder="Spouse's name"
                        value={formData.spouse_name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Occupation</label>
                      <input
                        type="text"
                        name="spouse_occupation"
                        placeholder="Spouse's occupation"
                        value={formData.spouse_occupation}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        name="spouse_birthdate"
                        value={formData.spouse_birthdate}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Age</label>
                      <input
                        type="number"
                        name="spouseAge"
                        placeholder="-"
                        value={formData.spouseAge}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                {/* Children's Information */}
                <div className="info-section">
                  <div className="section-title">Children's Information</div>
                  <div className="info-row">
                    <div className="info-item">
                      <label>Number of Children</label>
                      <input
                        type="number"
                        name="total_children"
                        value={formData.total_children}
                        onChange={handleChange}
                        className="edit-input"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="info-row">
                    <div className="info-item">
                      <label>Total number of Boy</label>
                      <input
                        type="number"
                        name="total_boys"
                        value={formData.total_boys}
                        onChange={handleChange}
                        className="edit-input"
                        min="0"
                      />
                    </div>
                    <div className="info-item">
                      <label>Total number of Girl</label>
                      <input
                        type="number"
                        name="total_girls"
                        value={formData.total_girls}
                        onChange={handleChange}
                        className="edit-input"
                        min="0"
                      />
                    </div>
                  </div>

            {formData.total_children > 0 && (
  <table className="siblings-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Date of Birth</th>
        <th>Age</th>
      </tr>
    </thead>
    <tbody>
      {Array.from({ length: parseInt(formData.total_children) || 0 }).map((_, index) => (
        <tr key={index}>
          <td>
            <input
              type="text"
              value={formData.children[index]?.child_name || ''}
              onChange={(e) => handleChildInputChange(index, 'child_name', e.target.value)}
              className="edit-input"
            />
          </td>
          <td>
            <input
              type="date"
              value={formData.children[index]?.child_birthdate || '2010-01-15'}
              onChange={(e) => handleChildInputChange(index, 'child_birthdate', e.target.value)}
              className="edit-input"
            />
          </td>
          <td>
            {formData.children[index]?.child_birthdate
              ? new Date().getFullYear() - new Date(formData.children[index].child_birthdate).getFullYear()
              : '-'}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)}
                </div>

                {/* Siblings Details */}
                <div className="info-section">
                  <div className="section-title">Siblings Details</div>
                  <div className="info-row">
                    <div className="info-item">
                      <label>Total Siblings (Including Employee)</label>
                      <input
                        type="number"
                        name="total_siblings"
                        value={formData.total_siblings}
                        onChange={handleChange}
                        className="edit-input"
                      />
                    </div>
                    <div className="info-item">
                      <label>Birth Order</label>
                      <input
                        type="number"
                        name="order_of_siblings"
                        value={formData.order_of_siblings}
                        onChange={handleChange}
                        className="edit-input"
                      />
                    </div>
                  </div>
                  <div className="info-row">
                    <div className="info-item">
                      <label>Number of Brothers</label>
                      <input
                        type="number"
                        name="numberOfBrothers"
                        value={formData.numberOfBrothers}
                        onChange={handleChange}
                        className="edit-input"
                      />
                    </div>
                    <div className="info-item">
                      <label>Number of Sisters</label>
                      <input
                        type="number"
                        name="numberOfSisters"
                        value={formData.numberOfSisters}
                        onChange={handleChange}
                        className="edit-input"
                      />
                    </div>
                  </div>
                  {formData.total_siblings > 1 && (
                    <table className="siblings-table">
                       <thead>
                        <tr>
                          <th>Name</th>
                          {/* <th>Lastname</th> */}
                          <th>Date of Birth</th>
                          <th>Age</th>
                        </tr>
                      </thead>
                      <tbody>
                      {Array.from({ length: (parseInt(formData.total_siblings, 10) || 0) - 1 }).map((_, index) => (
                          <tr key={index}>
                            <td>
  <input
    type="text"
    value={formData.siblings_data[index]?.siblings_name || ''}
    onChange={(e) => handleSiblingInputChange(index, 'siblings_name', e.target.value)}
    className="edit-input"
    placeholder="ชื่อพี่น้อง"
  />
</td>

<td>
  <input
    type="date"
    value={formData.siblings_data[index]?.siblings_birthdate || '2010-01-15'}
    onChange={(e) => handleSiblingInputChange(index, 'siblings_birthdate', e.target.value)}
    className="edit-input"
  />
</td>

<td>
  {formData.siblings_data[index]?.siblings_birthdate 
    ? new Date().getFullYear() - new Date(formData.siblings_data[index].siblings_birthdate).getFullYear() 
    : '-'
  }
</td>

<td>
  <input
    type="text"
    value={formData.siblings_data[index]?.siblings_occupation || ''}
    onChange={(e) => handleSiblingInputChange(index, 'siblings_occupation', e.target.value)}
    className="edit-input"
    placeholder="อาชีพ"
  />
</td>

<td>
  <input
    type="tel"
    value={formData.siblings_data[index]?.siblings_mobile || ''}
    onChange={(e) => handleSiblingInputChange(index, 'siblings_mobile', e.target.value)}
    className="edit-input"
    placeholder="เบอร์โทรศัพท์"
  />
</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* Documents Section */}
            {activeTab === 'documents' && (
              <div className="form-section">
                <h2 className="section-title">Required Documents</h2>
                <div className="file-upload-section">
                  <div className="documents-grid">                  {/* Job Application */}
                    <div className="document-upload-card">
                      <h3 className="document-title">
                        <FiFile /> Job Application
                      </h3>
                      <div className="upload-area-doc">
                        <input
                          type="file"
                          id="job-application"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileUpload(e, 'jobApplication')}
                          hidden
                          multiple
                        />
                        <label htmlFor="job-application" className="upload-label">
                          <div className="upload-icon">
                            <FiUpload />
                          </div>
                          <p>Drag & drop or <span className="choose-text">choose file</span> to upload</p>
                          <p className="supported-text">Supported files: PDF, DOC, DOCX</p>
                        </label>
                      </div>
                      {formData.jobApplication && formData.jobApplication.length > 0 && (
                        <div className="uploaded-files">
                          {formData.jobApplication.map((file, index) => (
                            <div key={index} className="uploaded-file">
                              <FiFile />
                              <span title={file.name}>{truncateFileName(file.name)}</span>
                              <button 
                                type="button" 
                                className="remove-file"
                                onClick={() => handleRemoveFile('jobApplication', index)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>                  {/* Certificate */}
                    <div className="document-upload-card">
                      <h3 className="document-title">
                        <FiFile /> Certificate
                      </h3>
                      <div className="upload-area-doc">
                        <input
                          type="file"
                          id="certificate"
                          accept=".pdf,.jpg,.jpeg"
                          onChange={(e) => handleFileUpload(e, 'certificate')}
                          hidden
                          multiple
                        />
                        <label htmlFor="certificate" className="upload-label">
                          <div className="upload-icon">
                            <FiUpload />
                          </div>
                          <p>Drag & drop or <span className="choose-text">choose file</span> to upload</p>
                          <p className="supported-text">Supported files: PDF, JPG, JPEG</p>
                        </label>
                      </div>
                      {formData.certificate && formData.certificate.length > 0 && (
                        <div className="uploaded-files">
                          {formData.certificate.map((file, index) => (
                            <div key={index} className="uploaded-file">
                              <FiFile />
                              <span title={file.name}>{truncateFileName(file.name)}</span>
                              <button 
                                type="button" 
                                className="remove-file"
                                onClick={() => handleRemoveFile('certificate', index)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* National ID */}
                    <div className="document-upload-card">
                      <h3 className="document-title">
                        <FiFile /> Copy of National ID Card
                      </h3>
                      <div className="upload-area-doc">
                        <input
                          type="file"
                          id="national-id"
                          accept=".pdf,.jpg,.jpeg"
                          onChange={(e) => handleFileUpload(e, 'nationalId')}
                          hidden
                          multiple
                        />
                        <label htmlFor="national-id" className="upload-label">
                          <div className="upload-icon">
                            <FiUpload />
                          </div>
                          <p>Drag & drop or <span className="choose-text">choose file</span> to upload</p>
                          <p className="supported-text">Supported files: PDF, JPG, JPEG</p>
                        </label>
                      </div>
                      {formData.nationalId && formData.nationalId.length > 0 && (
                        <div className="uploaded-files">
                          {formData.nationalId.map((file, index) => (
                            <div key={index} className="uploaded-file">
                              <FiFile />
                              <span title={file.name}>{truncateFileName(file.name)}</span>
                              <button
                                type="button"
                                className="remove-file"
                                onClick={() => handleRemoveFile('nationalId', index)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* House Registration */}
                    <div className="document-upload-card">
                      <h3 className="document-title">
                        <FiFile /> Copy of House Registration
                      </h3>
                      <div className="upload-area-doc">
                        <input
                          type="file"
                          id="house-registration"
                          accept=".pdf,.jpg,.jpeg"
                          onChange={(e) => handleFileUpload(e, 'householdRegistration')}
                          hidden
                          multiple
                        />
                        <label htmlFor="house-registration" className="upload-label">
                          <div className="upload-icon">
                            <FiUpload />
                          </div>
                          <p>Drag & drop or <span className="choose-text">choose file</span> to upload</p>
                          <p className="supported-text">Supported files: PDF, JPG, JPEG</p>
                        </label>
                      </div>
                      {formData.householdRegistration && formData.householdRegistration.length > 0 && (
                        <div className="uploaded-files">
                          {formData.householdRegistration.map((file, index) => (
                            <div key={index} className="uploaded-file">
                              <FiFile />
                              <span title={file.name}>{truncateFileName(file.name)}</span>
                              <button
                                type="button"
                                className="remove-file"
                                onClick={() => handleRemoveFile('householdRegistration', index)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bank Account */}
                    <div className="document-upload-card">
                      <h3 className="document-title">
                        <FiFile /> Copy of Bank Book
                      </h3>
                      <div className="upload-area-doc">
                        <input
                          type="file"
                          id="bank-book"
                          accept=".pdf,.jpg,.jpeg"
                          onChange={(e) => handleFileUpload(e, 'bankBook')}
                          hidden
                          multiple
                        />
                        <label htmlFor="bank-book" className="upload-label">
                          <div className="upload-icon">
                            <FiUpload />
                          </div>
                          <p>Drag & drop or <span className="choose-text">choose file</span> to upload</p>
                          <p className="supported-text">Supported files: PDF, JPG, JPEG</p>
                        </label>
                      </div>
                      {formData.bankBook && formData.bankBook.length > 0 && (
                        <div className="uploaded-files">
                          {formData.bankBook.map((file, index) => (
                            <div key={index} className="uploaded-file">
                              <FiFile />
                              <span title={file.name}>{truncateFileName(file.name)}</span>
                              <button
                                type="button"
                                className="remove-file"
                                onClick={() => handleRemoveFile('bankBook', index)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Employment Contract */}
                    <div className="document-upload-card">
                      <h3 className="document-title">
                        <FiFile /> Employment Contract
                      </h3>
                      <div className="upload-area-doc">
                        <input
                          type="file"
                          id="employment-contract"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileUpload(e, 'employmentContract')}
                          hidden
                          multiple
                        />
                        <label htmlFor="employment-contract" className="upload-label">
                          <div className="upload-icon">
                            <FiUpload />
                          </div>
                          <p>Drag & drop or <span className="choose-text">choose file</span> to upload</p>
                          <p className="supported-text">Supported files: PDF, DOC, DOCX</p>
                        </label>
                      </div>
                      {formData.employmentContract && formData.employmentContract.length > 0 && (
                        <div className="uploaded-files">
                          {formData.employmentContract.map((file, index) => (
                            <div key={index} className="uploaded-file">
                              <FiFile />
                              <span title={file.name}>{truncateFileName(file.name)}</span>
                              <button
                                type="button"
                                className="remove-file"
                                onClick={() => handleRemoveFile('employmentContract', index)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other sections... */}
            {activeTab === 'other' && (
              <div className="form-section">
                <h2 className="section-title">Other</h2>
                
                {/* Language Ability Section */}
                <div className="language-ability-section">
                  <h3>English Language Ability</h3>
                  <div className="language-grid">
                    {/* Speaking */}
                    <div className="language-row">
                      <div className="language-label">Speaking:</div>
                      <div className="language-options responsive-language-select">
                        <select
                          name="language_reading"
                          value={formData.language_reading}
                          onChange={handleChange}
                          className="language-select"
                        >
                          <option value="">Select</option>
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                          <option value="poor">Poor</option>
                        </select>
                      </div>
                    </div>
                    {/* Writing */}
                    <div className="language-row">
                      <div className="language-label">Writing:</div>
                      <div className="language-options responsive-language-select">
                        <select
                          name="language_writing"
                          value={formData.language_writing}
                          onChange={handleChange}
                          className="language-select"
                        >
                          <option value="">Select</option>
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                          <option value="poor">Poor</option>
                        </select>
                      </div>
                    </div>
                    {/* Reading */}
                    <div className="language-row">
                      <div className="language-label">Reading:</div>
                      <div className="language-options responsive-language-select">
                        <select
                          name="language_writing"
                          value={formData.language_writing}
                          onChange={handleChange}
                          className="language-select"
                        >
                          <option value="">Select</option>
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                          <option value="poor">Poor</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Criminal Record Section */}
                <div className="criminal-record-section">
                  <h3>Legal History</h3>
                  <div className="criminal-record-container">
                    <div className="criminal-record-question">
                      <p>Have you ever been convicted of a civil or criminal offense?</p>
                      <div className="criminal-options">
                        <label>
                          <input
                            type="radio"
                            name="criminal_record"
                            value="yes"
                            checked={formData.criminal_record === 'yes'}
                            onChange={handleChange}
                          />
                          Yes
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="hasCriminalRecord"
                            value="no"
                            checked={formData.hasCriminalRecord === 'no'}
                            onChange={handleChange}
                          />
                          No
                        </label>
                      </div>
                    </div>

                    {formData.hasCriminalRecord === 'yes' && (
                      <div className="criminal-details">
                        <label htmlFor="criminalDetails">Details:</label>
                        <textarea
                          id="criminalDetails"
                          name="criminalDetails"
                          value={formData.criminalDetails}
                          onChange={handleChange}
                          placeholder="Please provide details of the offense and penalty."
                          rows="3"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Work Relocation Section */}
                <div className="relocation-section">
                  <h3>Work in other provinces</h3>
                  <div className="relocation-container">
                    <p>Are you able to work in other provinces?</p>
                    <div className="relocation-options">
                      <label>
                        <input
                          type="radio"
                          name="upcountry_areas"
                          value="yes"
                          checked={formData.upcountry_areas === 'yes'}
                          onChange={handleChange}
                        />
                        Yes
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="upcountry_areas"
                          value="no"
                          checked={formData.upcountry_areas === 'no'}
                          onChange={handleChange}
                        />
                        No
                      </label>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact Section */}
                <div className="emergency-contact-section">
                  <h3>Emergency Contact</h3>
                  
                  {/* คนที่ 1 */}
                  <div className="emergency-contact-container">
                    <h4>Contact 1</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Full Name</label>
                        <input
                          type="text"
                          name="contact_person1_name"
                          placeholder="Enter full name"
                          value={formData.contact_person1_name}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group">
                        <label>Relationship to applicant</label>
                        <input
                          type="text"
                          name="contact_person1_relationship"
                          placeholder="Enter relationship"
                          value={formData.contact_person1_relationship}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group">
                        <label>Phone Number</label>
                        <input
                          type="tel"
                          name="contact_person1_mobile"
                          placeholder="Enter phone number"
                          value={formData.contact_person1_mobile}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label>Address</label>
                      <textarea
                        name="contact_person1_address"
                        placeholder="Enter address"
                        value={formData.contact_person1_address}
                        onChange={handleChange}
                        rows="3"
                      />
                    </div>
                  </div>

                  {/* คนที่ 2 */}
                  <div className="emergency-contact-container" style={{ marginTop: '20px' }}>
                    <h4>Contact 2</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Full Name</label>
                        <input
                          type="text"
                          name="contact_person2_name"
                          placeholder="Enter full name"
                          value={formData.contact_person2_name}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group">
                        <label>Relationship to applicant</label>
                        <input
                          type="text"
                          name="contact_person2_relationship"
                          placeholder="Enter relationship"
                          value={formData.contact_person2_relationship}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group">
                        <label>Phone Number</label>
                        <input
                          type="tel"
                          name="contact_person2_mobile"
                          placeholder="Enter phone number"
                          value={formData.contact_person2_mobile}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label>Address</label>
                      <textarea
                        name="contact_person2_address"
                        placeholder="Enter address"
                        value={formData.contact_person2_address}
                        onChange={handleChange}
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="new-employee-form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate('/admin/all-employees')}
              >
                Cancel
              </button>
              <button type="submit" className="btn-submit">
                Save
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {showSuccessPopup && (
        <>
          <div className="popup-overlay"></div>
          <div className="success-popup">
            <div className="success-icon">
              <FiCheck />
            </div>
            <h2 className="success-title">Success!</h2>
            <p className="success-message">Employee has been added successfully.</p>
            <button className="success-button" onClick={handleSuccessClose}>
              Continue
            </button>
          </div>
        </>
      )}

      <style>
        {`
          .uploaded-files {
            margin-top: 10px;
            max-height: 150px;
            overflow-y: auto;
            padding-right: 10px;
          }

          .uploaded-file {
            display: flex;
            align-items: center;
            background: #f5f5f5;
            padding: 8px 12px;
            border-radius: 4px;
            margin-bottom: 5px;
            transition: all 0.3s ease;
          }

          .uploaded-file:hover {
            background: #e9e9e9;
          }

          .uploaded-file svg {
            margin-right: 8px;
            color: #666;
          }

          .uploaded-file span {
            flex: 1;
            margin-right: 8px;
            font-size: 0.9em;
            color: #333;
          }

          .remove-file {
            background: none;
            border: none;
            color: #ff4444;
            cursor: pointer;
            font-size: 1.2em;
            padding: 0 4px;
            transition: color 0.2s ease;
          }

          .remove-file:hover {
            color: #cc0000;
          }
        `}
      </style>
    </div>
  )
}

export default NewEmployees