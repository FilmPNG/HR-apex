import React, { useState, useEffect, useRef } from 'react';
import './Payroll.css';
import SideMenu from '../SideMenu/Side_menu';
import Topbar from '../Topbar/Topbar';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiFileText, FiEdit2, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const Payroll = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'สมชาย มั่นคง',
      nickname: 'ชาย',
      position: 'Senior Developer',
      type: 'Permanent',
      basicSalary: 45000,
      deductions: 3000,
      additions: 11500,
      netSalary: 53500,
      paymentStatus: 'paid'
    },
    {
      id: 2,
      name: 'สุดา รักงาน',
      nickname: 'ดา',
      position: 'UX Designer',
      type: 'Freelance',
      basicSalary: 40000,
      deductions: 2750,
      additions: 9500,
      netSalary: 46750,
      paymentStatus: 'paid'
    },
    {
      id: 3,
      name: 'วิชัย ภักดี',
      nickname: 'ชัย',
      position: 'Project Manager',
      type: 'Permanent',
      basicSalary: 60000,
      deductions: 3750,
      additions: 9000,
      netSalary: 65250,
      paymentStatus: 'unpaid'
    },
    {
      id: 4,
      name: 'นภา ใจดี',
      nickname: 'นภ',
      position: 'Frontend Developer',
      type: 'Intern',
      basicSalary: 35000,
      deductions: 2500,
      additions: 8000,
      netSalary: 40500,
      paymentStatus: 'paid'
    },
    {
      id: 5,
      name: 'ประสิทธิ์ เก่งกล้า',
      nickname: 'ประ',
      position: 'Backend Developer',
      type: 'Permanent',
      basicSalary: 42000,
      deductions: 2800,
      additions: 9500,
      netSalary: 48700,
      paymentStatus: 'unpaid'
    },
    {
      id: 6,
      name: 'พิมพ์ชนก สว่างใจ',
      nickname: 'พิม',
      position: 'UI Designer',
      type: 'Freelance',
      basicSalary: 38000,
      deductions: 2600,
      additions: 7500,
      netSalary: 42900,
      paymentStatus: 'paid'
    },
    {
      id: 7,
      name: 'ธนกร รุ่งเรือง',
      nickname: 'กร',
      position: 'DevOps Engineer',
      type: 'Permanent',
      basicSalary: 50000,
      deductions: 3200,
      additions: 12000,
      netSalary: 58800,
      paymentStatus: 'unpaid'
    },
    {
      id: 8,
      name: 'สิริกร มณีวงศ์',
      nickname: 'สิ',
      position: 'Business Analyst',
      type: 'Freelance',
      basicSalary: 45000,
      deductions: 3000,
      additions: 8500,
      netSalary: 50500,
      paymentStatus: 'paid'
    },
    {
      id: 9,
      name: 'อนันต์ พัฒนา',
      nickname: 'อัน',
      position: 'Software Architect',
      type: 'Permanent',
      basicSalary: 80000,
      deductions: 4500,
      additions: 15000,
      netSalary: 90500,
      paymentStatus: 'unpaid'
    },
    {
      id: 10,
      name: 'กมลชนก ศรีสุข',
      nickname: 'กมล',
      position: 'QA Engineer',
      type: 'Intern',
      basicSalary: 35000,
      deductions: 2500,
      additions: 7000,
      netSalary: 39500,
      paymentStatus: 'paid'
    },
    {
      id: 11,
      name: 'วรพล สันติสุข',
      nickname: 'พล',
      position: 'System Admin',
      type: 'Permanent',
      basicSalary: 40000,
      deductions: 2750,
      additions: 8500,
      netSalary: 45750,
      paymentStatus: 'unpaid'
    },
    {
      id: 12,
      name: 'ปิยะดา วงศ์สกุล',
      nickname: 'ปิยะ',
      position: 'Data Analyst',
      type: 'Freelance',
      basicSalary: 42000,
      deductions: 2800,
      additions: 9000,
      netSalary: 48200,
      paymentStatus: 'paid'
    },
    {
      id: 13,
      name: 'ณัฐพงษ์ เจริญรัตน์',
      nickname: 'ณัฐ',
      position: 'Mobile Developer',
      type: 'Permanent',
      basicSalary: 45000,
      deductions: 3000,
      additions: 10000,
      netSalary: 52000,
      paymentStatus: 'unpaid'
    },
    {
      id: 14,
      name: 'มณีรัตน์ ดวงแก้ว',
      nickname: 'มณี',
      position: 'HR Manager',
      type: 'Permanent',
      basicSalary: 55000,
      deductions: 3500,
      additions: 12000,
      netSalary: 63500,
      paymentStatus: 'paid'
    },
    {
      id: 15,
      name: 'ศักดิ์ชัย อุดมทรัพย์',
      nickname: 'ศักดิ์',
      position: 'Full Stack Developer',
      type: 'Permanent',
      basicSalary: 48000,
      deductions: 3200,
      additions: 11000,
      netSalary: 55800,
      paymentStatus: 'unpaid'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, employeeId: null });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const contextMenuRef = useRef(null);

  const formatMonthYear = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  const filteredEmployees = employees.filter(employee => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchLower) ||
      employee.type.toLowerCase().includes(searchLower) ||
      employee.position.toLowerCase().includes(searchLower) ||
      employee.basicSalary.toString().includes(searchTerm) ||
      employee.netSalary.toString().includes(searchTerm);

    const matchesType = selectedType === 'all' || employee.type.toLowerCase() === selectedType.toLowerCase();

    return matchesSearch && matchesType;
  });

  const handleRowClick = (employeeId) => {
    navigate(`/payroll-detail/${employeeId}`);
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'permanent':
        return 'payroll__type-permanent';
      case 'freelance':
        return 'payroll__type-freelance';
      case 'intern':
        return 'payroll__type-intern';
      default:
        return 'payroll__type-default';
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setContextMenu({ show: false, x: 0, y: 0, employeeId: null });
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleContextMenu = (e, employeeId) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.pageX,
      y: e.pageY,
      employeeId
    });
  };

  const handleStatusChange = (employeeId, newStatus) => {
    const updatedEmployees = employees.map(emp => {
      if (emp.id === employeeId) {
        return { ...emp, paymentStatus: newStatus };
      }
      return emp;
    });
    setEmployees(updatedEmployees);
    setContextMenu({ show: false, x: 0, y: 0, employeeId: null });
  };

  const handleViewDocuments = (employeeId) => {
    // TODO: Implement document viewing logic
    console.log('View documents for employee:', employeeId);
    setContextMenu({ show: false, x: 0, y: 0, employeeId: null });
  };

  const handleEdit = (employeeId) => {
    navigate(`/payroll-detail/${employeeId}`);
    setContextMenu({ show: false, x: 0, y: 0, employeeId: null });
  };

  return (
    <div className="payroll__main-container">
      <SideMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <div className="payroll__content-wrapper">
        <ul className="circles">
          {[...Array(25)].map((_, i) => (
            <li key={i}></li>
          ))}
        </ul>
        <ul className="circles-bottom">
          {[...Array(25)].map((_, i) => (
            <li key={i}></li>
          ))}
        </ul>
        <Topbar onMobileMenuClick={() => setIsMobileMenuOpen(true)} />
        <div className="payroll__container">
          <div className="payroll__header">
            <div className="payroll__controls">
              <div className="payroll__month-selector">
                <input
                  type="month"
                  className="payroll__month-input"
                  value={formatMonthYear(currentDate)}
                  onChange={(e) => {
                    const [year, month] = e.target.value.split('-');
                    const newDate = new Date(currentDate);
                    newDate.setFullYear(parseInt(year));
                    newDate.setMonth(parseInt(month) - 1);
                    setCurrentDate(newDate);
                  }}
                  min="2020-01"
                  max="2030-12"
                />
              </div>
              <div className="payroll__filters">
                <select 
                  className="payroll__type-filter"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="all">All Type</option>
                  <option value="permanent">Permanent</option>
                  <option value="freelance">Freelance</option>
                  <option value="intern">Intern</option>
                </select>
                <div className="payroll__search">                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="payroll__table-container">
            <table className="payroll__table">              <thead>
                <tr>
                  <th>Full Name (Nickname)</th>
                  <th>Type</th>
                  <th>Basic Salary</th>
                  <th>Deductions</th>
                  <th>Additional Income</th>
                  <th>Net Salary</th>
                  <th>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr 
                    key={employee.id} 
                    className={`payroll__table-row payroll__table-row--${employee.paymentStatus}`}
                    onClick={() => handleRowClick(employee.id)}
                    onContextMenu={(e) => handleContextMenu(e, employee.id)}
                    style={{ cursor: 'context-menu' }}
                  >
                    <td className="payroll__employee-name">
                      {employee.name} {employee.nickname && `(${employee.nickname})`}
                    </td>
                    <td>
                      <span className={`payroll__employee-type ${getTypeColor(employee.type)}`}>
                        {employee.type}
                      </span>
                    </td>                    <td data-type="money">{employee.basicSalary.toLocaleString()} บาท</td>
                    <td data-type="money" className="deduction-amount">-{employee.deductions.toLocaleString()} บาท</td>
                    <td data-type="money" className="additional-income">+{employee.additions.toLocaleString()} บาท</td>
                    <td data-type="money" className="payroll__net-salary">
                      {employee.netSalary.toLocaleString()} บาท
                    </td>                    <td>
                      <span className={`payroll__payment-status payroll__payment-status--${employee.paymentStatus}`}>
                        {employee.paymentStatus === 'paid' ? 'ดำเนินการ' : 'ยังไม่ดำเนินการ'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {contextMenu.show && (
            <div 
              ref={contextMenuRef}
              className="payroll__context-menu"
              style={{ 
                position: 'fixed',
                top: contextMenu.y,
                left: contextMenu.x,
              }}
            >              <div className="payroll__context-menu-item" onClick={() => handleStatusChange(contextMenu.employeeId, 'paid')}>
                <FiCheckCircle className="payroll__context-menu-icon payroll__context-menu-icon--success" />
                <span>เปลี่ยนเป็น ดำเนินการ</span>
              </div>
              <div className="payroll__context-menu-item" onClick={() => handleStatusChange(contextMenu.employeeId, 'unpaid')}>
                <FiXCircle className="payroll__context-menu-icon payroll__context-menu-icon--danger" />
                <span>เปลี่ยนเป็น ยังไม่ดำเนินการ</span>
              </div>
              <div className="payroll__context-menu-divider"></div>
              <div className="payroll__context-menu-item" onClick={() => handleViewDocuments(contextMenu.employeeId)}>
                <FiFileText className="payroll__context-menu-icon" />
                <span>ดูเอกสาร</span>
              </div>
              <div className="payroll__context-menu-item" onClick={() => handleEdit(contextMenu.employeeId)}>
                <FiEdit2 className="payroll__context-menu-icon" />
                <span>แก้ไข</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payroll;