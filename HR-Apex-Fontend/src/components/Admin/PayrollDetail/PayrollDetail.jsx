import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './PayrollDetail.css';
import SideMenu from '../SideMenu/Side_menu';
import Topbar from '../Topbar/Topbar';
import { FiDollarSign, FiMinusCircle, FiPlusCircle, FiFile, FiEdit2, FiSave, FiX, FiPlus } from 'react-icons/fi';

const mainTabs = [
  { key: 'salary', label: 'เงินเดือนพื้นฐาน', icon: <FiDollarSign /> },
  { key: 'deductions', label: 'รายการหัก', icon: <FiMinusCircle /> },
  { key: 'additions', label: 'รายได้เพิ่มเติม', icon: <FiPlusCircle /> },
  { key: 'documents', label: 'เอกสาร', icon: <FiFile /> },
];

const PayrollDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('salary');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [employeeData, setEmployeeData] = useState({
    id: id,
    name: "John Doe",
    position: "Software Engineer",
    department: "Development",
    baseSalary: 50000,
    deductions: {
      socialSecurity: 750,
      withHoldingTax: 5000,
      withoutPay: 0
    },
    additionalIncome: {
      overtime: 2000,
      travel: 1000,
      food: 500,
      other: 0
    },    documents: {
      n550: [],
      paySlip: []
    }
  });
  const [showNewItemForm, setShowNewItemForm] = useState({
    deductions: false,
    additionalIncome: false
  });
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    setEditData(employeeData);
  }, [employeeData]);

  const handleToggleMinimize = (minimized) => {
    setIsMinimized(minimized);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // TODO: Add API call to save data
    setEmployeeData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(employeeData);
    setIsEditing(false);
  };

  const handleInputChange = (category, field, value) => {
    setEditData(prev => {
      if (category === 'base') {
        return { ...prev, [field]: value };
      }
      return {
        ...prev,
        [category]: {
          ...prev[category],
          [field]: parseFloat(value) || 0
        }
      };
    });
  };  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Update the file input's parent div to show success state
      const fileInput = e.target.parentElement;
      fileInput.classList.add('has-file');
      
      // Update state with new files
      setEditData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [type]: [...(prev.documents[type] || []), ...files]
        }
      }));
      
      // Update the actual employee data
      setEmployeeData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [type]: [...(prev.documents[type] || []), ...files]
        }
      }));
    }
  };

  const handleDeleteFile = (type, index) => {
    setEditData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [type]: prev.documents[type].filter((_, i) => i !== index)
      }
    }));
    
    setEmployeeData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [type]: prev.documents[type].filter((_, i) => i !== index)
      }
    }));
  };  const handleDeductionInputChange = (field, value, inputType) => {
    const numericValue = parseFloat(value) || 0;
    const baseSalary = editData.baseSalary;
    let newDeductions = { ...editData.deductions };

    if (inputType === 'percentage') {
      // Clamp percentage between 0 and 100
      const clampedPercentage = Math.min(Math.max(numericValue, 0), 100);
      const calculatedAmount = (baseSalary * clampedPercentage) / 100;
      newDeductions[field] = calculatedAmount;
    } else {
      // Clamp amount to be non-negative and not exceed base salary
      newDeductions[field] = Math.min(Math.max(numericValue, 0), baseSalary);
    }

    setEditData(prev => ({
      ...prev,
      deductions: newDeductions
    }));
  };
  const renderEditableField = (category, field, label, value) => {
    if (category === 'deductions' && isEditing) {
      // คำนวณเปอร์เซ็นต์จากค่าใน editData แทน employeeData
      const percentage = ((editData.deductions[field] / editData.baseSalary) * 100).toFixed(2);
      return (
        <div className="payroll-detail__info-item">
          <label>{label}</label>          <div className="payroll-detail__edit-group">
            <div className="payroll-detail__input-wrapper">
              <input
                type="number"
                value={editData.deductions[field]}
                onChange={(e) => handleDeductionInputChange(field, e.target.value, 'value')}
                className="payroll-detail__edit-input"
                min="0"
                max={editData.baseSalary}
                placeholder="0"
              />
              <span className="payroll-detail__input-label-bottom">จำนวนเงิน (บาท)</span>
            </div>
            <div className="payroll-detail__input-wrapper">
              <input
                type="number"
                value={percentage}
                onChange={(e) => handleDeductionInputChange(field, e.target.value, 'percentage')}
                className="payroll-detail__edit-input"
                min="0"
                max="100"
                placeholder="0"
              />
              <span className="payroll-detail__input-label-bottom">เปอร์เซ็นต์ (%)</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="payroll-detail__info-item">
        <label>{label}</label>
        {isEditing ? (
          <input
            type="text"
            value={category === 'base' ? editData[field] : editData[category][field]}
            onChange={(e) => handleInputChange(category, field, e.target.value)}
            className="payroll-detail__edit-input"
          />
        ) : (
          <span className={category === 'deductions' ? 'deduction' : category === 'additionalIncome' ? 'addition' : ''}>
            {category === 'base' ? value : (category === 'deductions' ? '-' : '+') + '฿' + value.toLocaleString()}
            {category === 'deductions' && ` (${((value / employeeData.baseSalary) * 100).toFixed(2)}%)`}
          </span>
        )}
      </div>
    );
  };

  const handleAddItem = (category) => {
    setShowNewItemForm(prev => ({
      ...prev,
      [category]: true
    }));
    setNewItemName('');
  };

  const handleSubmitNewItem = (category, e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    setEditData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [newItemName]: 0
      }
    }));

    setShowNewItemForm(prev => ({
      ...prev,
      [category]: false
    }));
    setNewItemName('');
  };

  const renderAddItemButton = (category) => (
    <>
      <button 
        className="payroll-detail__add-item-button"
        onClick={() => handleAddItem(category)}
      >
        <FiPlus />
        เพิ่มรายการ
      </button>
      
      {showNewItemForm[category] && (
        <form 
          className="payroll-detail__new-item-form"
          onSubmit={(e) => handleSubmitNewItem(category, e)}
        >
          <div className="payroll-detail__form-group">
            <input
              type="text"
              className="payroll-detail__form-input"
              placeholder="ชื่อรายการ"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              autoFocus
            />
            <button type="submit" className="payroll-detail__form-submit">
              เพิ่ม
            </button>
            <button 
              type="button" 
              className="payroll-detail__form-cancel"
              onClick={() => setShowNewItemForm(prev => ({
                ...prev,
                [category]: false
              }))}
            >
              ยกเลิก
            </button>
          </div>
        </form>
      )}
    </>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'salary':
        return (
          <div className="payroll-detail__tab-content">
            <div className="payroll-detail__card">
              <div className="payroll-detail__info-grid">
                {renderEditableField('base', 'name', 'ชื่อ-นามสกุล', employeeData.name)}
                {renderEditableField('base', 'position', 'ตำแหน่ง', employeeData.position)}
                {renderEditableField('base', 'department', 'แผนก', employeeData.department)}
                <div className="payroll-detail__info-item highlight">
                  <label>เงินเดือนพื้นฐาน</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editData.baseSalary}
                      onChange={(e) => handleInputChange('base', 'baseSalary', e.target.value)}
                      className="payroll-detail__edit-input"
                    />
                  ) : (
                    <span style={{ color: '#ffffff' }}>฿{employeeData.baseSalary.toLocaleString()}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'deductions':
        return (
          <div className="payroll-detail__tab-content">
            <div className="payroll-detail__card">
              <div className="payroll-detail__info-grid">
                {isEditing && renderAddItemButton('deductions')}
                {renderEditableField('deductions', 'socialSecurity', 'ประกันสังคม', employeeData.deductions.socialSecurity)}
                {renderEditableField('deductions', 'withHoldingTax', 'หัก ณ ที่จ่าย (WHT)', employeeData.deductions.withHoldingTax)}
                {renderEditableField('deductions', 'withoutPay', 'ขาด/ลาไม่รับค่าจ้าง', employeeData.deductions.withoutPay)}
                {/* Map any additional custom deductions */}
                {Object.entries(editData.deductions)
                  .filter(([key]) => !['socialSecurity', 'withHoldingTax', 'withoutPay'].includes(key))
                  .map(([key, value]) => renderEditableField('deductions', key, key, value))
                }
                <div className="payroll-detail__info-item highlight">
                  <label>รวมรายการหัก</label>
                  <span className="deduction">-฿{(
                    Object.values(isEditing ? editData.deductions : employeeData.deductions)
                      .reduce((a, b) => a + b, 0)
                  ).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'additions':
        return (
          <div className="payroll-detail__tab-content">
            <div className="payroll-detail__card">
              <div className="payroll-detail__info-grid">
                {isEditing && renderAddItemButton('additionalIncome')}
                {renderEditableField('additionalIncome', 'overtime', 'ค่าล่วงเวลา (OT)', employeeData.additionalIncome.overtime)}
                {renderEditableField('additionalIncome', 'travel', 'ค่าเดินทาง', employeeData.additionalIncome.travel)}
                {renderEditableField('additionalIncome', 'food', 'ค่าอาหาร', employeeData.additionalIncome.food)}
                {renderEditableField('additionalIncome', 'other', 'อื่นๆ', employeeData.additionalIncome.other)}
                {/* Map any additional custom income items */}
                {Object.entries(editData.additionalIncome)
                  .filter(([key]) => !['overtime', 'travel', 'food', 'other'].includes(key))
                  .map(([key, value]) => renderEditableField('additionalIncome', key, key, value))
                }
                <div className="payroll-detail__info-item highlight">
                  <label>รวมรายได้เพิ่มเติม</label>
                  <span className="addition">+฿{(
                    Object.values(isEditing ? editData.additionalIncome : employeeData.additionalIncome)
                      .reduce((a, b) => a + b, 0)
                  ).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        );      case 'documents':
        return (
          <div className="payroll-detail__tab-content">
            <div className="payroll-detail__card">
              <div className="payroll-detail__document-section">
                <div className="payroll-detail__document-item">
                  <h4>แบบ ภ.ง.ด.1 (N550)</h4>
                  <div className="payroll-detail__upload-area">
                    <div className="payroll-detail__file-input">
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        id="n550" 
                        multiple
                        onChange={(e) => handleFileChange(e, 'n550')} 
                      />
                      <label htmlFor="n550" className="payroll-detail__upload-button">
                        <FiFile /> อัพโหลดเอกสาร
                      </label>
                    </div>
                    {employeeData.documents.n550.length > 0 && (
                      <div className="payroll-detail__file-list">                        {employeeData.documents.n550.map((file, index) => (
                          <div key={index} className="payroll-detail__file-item">
                            <div className="file-info">
                              <FiFile /> {file.name}
                            </div>
                            <button 
                              className="payroll-detail__delete-file" 
                              onClick={() => handleDeleteFile('n550', index)}
                              title="ลบไฟล์"
                            >
                              <FiX />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="payroll-detail__document-item">
                  <h4>สลิปเงินเดือน</h4>
                  <div className="payroll-detail__upload-area">
                    <div className="payroll-detail__file-input">
                      <input 
                        type="file" 
                        accept=".pdf" 
                        id="payslip" 
                        multiple
                        onChange={(e) => handleFileChange(e, 'paySlip')} 
                      />
                      <label htmlFor="payslip" className="payroll-detail__upload-button">
                        <FiFile /> อัพโหลดเอกสาร
                      </label>
                    </div>
                    {employeeData.documents.paySlip.length > 0 && (
                      <div className="payroll-detail__file-list">                        {employeeData.documents.paySlip.map((file, index) => (
                          <div key={index} className="payroll-detail__file-item">
                            <div className="file-info">
                              <FiFile /> {file.name}
                            </div>
                            <button 
                              className="payroll-detail__delete-file" 
                              onClick={() => handleDeleteFile('paySlip', index)}
                              title="ลบไฟล์"
                            >
                              <FiX />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const calculateTotal = (data) => {
    return data.baseSalary +
      Object.values(data.additionalIncome).reduce((a, b) => a + b, 0) -
      Object.values(data.deductions).reduce((a, b) => a + b, 0);
  };

  return (
    <div className="payroll-detail__container">
      <SideMenu isMinimized={isMinimized} onToggleMinimize={handleToggleMinimize} />      <div className={`payroll-detail__content ${isMinimized ? 'minimized' : ''}`}>
        <ul className="payroll-circles">
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
        </ul>        <Topbar pageTitle={`${employeeData.name}`} pageSubtitle="รายละเอียดเงินเดือน" />
        <div className="payroll-detail__main">
          <div className="payroll-detail__header">
            <h2>รายละเอียดเงินเดือนของ {employeeData.name}</h2>
            <div className="payroll-detail__actions">
              {isEditing ? (
                <>
                  <button onClick={handleSave} className="payroll-detail__button save">
                    <FiSave /> บันทึก
                  </button>
                  <button onClick={handleCancel} className="payroll-detail__button cancel">
                    <FiX /> ยกเลิก
                  </button>
                </>
              ) : (
                <button onClick={handleEdit} className="payroll-detail__button edit">
                  <FiEdit2 /> แก้ไข
                </button>
              )}
              <div className="payroll-detail__total">
                ฿{calculateTotal(isEditing ? editData : employeeData).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="payroll-detail__tabs">
            {mainTabs.map((tab) => (
              <button
                key={tab.key}
                className={`payroll-detail__tab-button ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {renderTabContent()}
        </div>
      </div>    </div>
  );
};

export default PayrollDetail;
