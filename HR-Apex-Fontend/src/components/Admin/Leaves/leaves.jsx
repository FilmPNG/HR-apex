import React, { useState, useEffect } from "react";
import "./leaves.css";
import SideMenu from '../SideMenu/Side_menu';
import Topbar from '../Topbar/Topbar';
import { FiEdit2, FiTrash2, FiCheck, FiClock, FiX, FiAlertTriangle } from 'react-icons/fi';

const leaveTypesDefault = [
  { id: 1, name: "Sick Leave", days: 30 },
  { id: 2, name: "Personal Leave", days: 4 },
  { id: 3, name: "Annual Leave", days: 6 },
  { id: 4, name: "Maternity Leave", days: 90 },
  { id: 5, name: "Ordination Leave", days: 30 },
  { id: 6, name: "Leave without Pay", days: 0 },
];

const leaveListMock = [
  {
    name: "John Smith",
    nickname: "John",
    date: "2025-05-01",
    days: 2,
    type: "Sick Leave",
    status: "Approved",
    approver: "Manager",
    reason: "Not feeling well",
  },
  {
    name: "Sarah Johnson",
    nickname: "Sarah",
    date: "2025-05-03",
    days: 5,
    type: "Annual Leave",
    status: "Pending",
    approver: "Supervisor",
    reason: "Family vacation",
  },
  {
    name: "Michael Chen",
    nickname: "Mike",
    date: "2025-05-10",
    days: 1,
    type: "Personal Leave",
    status: "Approved",
    approver: "Team Lead",
    reason: "Doctor appointment",
  },
  {
    name: "Emily Wilson",
    nickname: "Em",
    date: "2025-05-15",
    days: 90,
    type: "Maternity Leave",
    status: "Approved",
    approver: "HR Manager",
    reason: "Maternity leave",
  },
  {
    name: "David Thompson",
    nickname: "Dave",
    date: "2025-05-20",
    days: 3,
    type: "Sick Leave",
    status: "Approved",
    approver: "Department Head",
    reason: "Fever and flu",
  },
  {
    name: "Lisa Anderson",
    nickname: "Lisa",
    date: "2025-06-01",
    days: 7,
    type: "Annual Leave",
    status: "Pending",
    approver: "Manager",
    reason: "Overseas trip",
  },
  {
    name: "Robert Kim",
    nickname: "Rob",
    date: "2025-06-05",
    days: 30,
    type: "Ordination Leave",
    status: "Approved",
    approver: "HR Director",
    reason: "Buddhist ordination",
  },
  {
    name: "Amanda Lee",
    nickname: "Amy",
    date: "2025-06-10",
    days: 2,
    type: "Personal Leave",
    status: "Rejected",
    approver: "Supervisor",
    reason: "Personal matters",
  },
  {
    name: "Thomas Wright",
    nickname: "Tom",
    date: "2025-06-15",
    days: 5,
    type: "Leave without Pay",
    status: "Approved",
    approver: "Department Head",
    reason: "Extended personal time",
  },
  {
    name: "Maria Garcia",
    nickname: "Mari",
    date: "2025-06-20",
    days: 3,
    type: "Sick Leave",
    status: "Pending",
    approver: "Team Lead",
    reason: "Medical check-up",
  },
  {
    name: "James Wilson",
    nickname: "Jim",
    date: "2025-06-25",
    days: 4,
    type: "Annual Leave",
    status: "Approved",
    approver: "Manager",
    reason: "Summer holiday",
  }
];

const mockMonthlyReport2025 = [
  { month: "January", sickLeave: 12, personalLeave: 5, annualLeave: 8, maternityLeave: 1, ordinationLeave: 0, unpaidLeave: 2 },
  { month: "February", sickLeave: 8, personalLeave: 6, annualLeave: 10, maternityLeave: 1, ordinationLeave: 1, unpaidLeave: 0 },
  { month: "March", sickLeave: 15, personalLeave: 4, annualLeave: 12, maternityLeave: 1, ordinationLeave: 0, unpaidLeave: 1 },
  { month: "April", sickLeave: 10, personalLeave: 8, annualLeave: 15, maternityLeave: 0, ordinationLeave: 0, unpaidLeave: 3 },
  { month: "May", sickLeave: 7, personalLeave: 3, annualLeave: 6, maternityLeave: 0, ordinationLeave: 0, unpaidLeave: 1 }
];

const mockYearlyReport = [
  { year: "2023", total: 245, sickLeave: 85, personalLeave: 35, annualLeave: 90, maternityLeave: 15, ordinationLeave: 10, unpaidLeave: 10 },
  { year: "2024", total: 268, sickLeave: 92, personalLeave: 42, annualLeave: 95, maternityLeave: 18, ordinationLeave: 12, unpaidLeave: 9 },
  { year: "2025", total: 112, sickLeave: 52, personalLeave: 26, annualLeave: 51, maternityLeave: 3, ordinationLeave: 1, unpaidLeave: 7 }
];

// Mock data for employee leave reports
const employeeLeaveReports = {  "2025-05": [
    {      id: 1,
      name: "John Smith",
      nickname: "John",
      position: "Programmer",
      leaveData: {
        "Sick Leave": 1,
        "Personal Leave": 1,
        "Annual Leave": 2,
        "Maternity Leave": 0,
        "Ordination Leave": 0,
        "Leave without Pay": 0
      }
    },    {      id: 2,
      name: "Sarah Johnson",
      nickname: "Sarah",
      position: "HR",
      leaveData: {
        "Sick Leave": 1,
        "Personal Leave": 1,
        "Annual Leave": 3,
        "Maternity Leave": 0,
        "Ordination Leave": 0,
        "Leave without Pay": 0
      }
    },    {      id: 3,
      name: "Somchai Jaidee",
      nickname: "Chai",
      position: "System",
      leaveData: {
        "Sick Leave": 2,
        "Personal Leave": 1,
        "Annual Leave": 2,
        "Maternity Leave": 0,
        "Ordination Leave": 0,
        "Leave without Pay": 0
      }
    },
    {
      id: 4,
      name: "Pranee Rakdee",      nickname: "Nee",
      position: "System",
      leaveData: {
        "Sick Leave": 0,
        "Personal Leave": 2,
        "Annual Leave": 3,
        "Maternity Leave": 0,
        "Ordination Leave": 0,
        "Leave without Pay": 0
      }
    },    {
      id: 5,
      name: "Wichai Suksang",      nickname: "Chai",
      position: "HR",
      leaveData: {
        "Sick Leave": 1,
        "Personal Leave": 1,
        "Annual Leave": 2,
        "Maternity Leave": 0,
        "Ordination Leave": 3,
        "Leave without Pay": 0
      }
    },{
      id: 6,
      name: "Rattana Srisuk",      nickname: "Tan",
      position: "HR",
      leaveData: {
        "Sick Leave": 0,
        "Personal Leave": 1,
        "Annual Leave": 0,
        "Maternity Leave": 5,
        "Ordination Leave": 0,
        "Leave without Pay": 0
      }
    },    {
      id: 7,
      name: "Michael Anderson",      nickname: "Mike",
      position: "Programmer",
      leaveData: {
        "Sick Leave": 2,
        "Personal Leave": 1,
        "Annual Leave": 1,
        "Maternity Leave": 0,
        "Ordination Leave": 0,
        "Leave without Pay": 1
      }
    },    {
      id: 8,
      name: "Sunisa Wong",      nickname: "Sun",
      position: "System",
      leaveData: {
        "Sick Leave": 2,
        "Personal Leave": 1,
        "Annual Leave": 2,
        "Maternity Leave": 0,
        "Ordination Leave": 0,
        "Leave without Pay": 1
      }
    },    {
      id: 9,
      name: "Tanawat Manop",      nickname: "Wat",
      position: "HR",
      leaveData: {
        "Sick Leave": 1,
        "Personal Leave": 1,
        "Annual Leave": 3,
        "Maternity Leave": 0,
        "Ordination Leave": 0,
        "Leave without Pay": 1
      }
    },    {
      id: 10,
      name: "Jessica Chen",      nickname: "Jess",
      position: "Programmer",
      leaveData: {
        "Sick Leave": 1,
        "Personal Leave": 2,
        "Annual Leave": 2,
        "Maternity Leave": 0,
        "Ordination Leave": 0,
        "Leave without Pay": 1
      }
    },    {
      id: 11,
      name: "Piyarat Sombat",      nickname: "Piy",
      position: "HR",
      leaveData: {
        "Sick Leave": 1,
        "Personal Leave": 1,
        "Annual Leave": 2,
        "Maternity Leave": 0,
        "Ordination Leave": 0,
        "Leave without Pay": 1
      }
    },    {
      id: 12,
      name: "David Wilson",      nickname: "Dave",
      position: "System",
      leaveData: {
        "Sick Leave": 2,
        "Personal Leave": 1,
        "Annual Leave": 2,
        "Maternity Leave": 0,
        "Ordination Leave": 0,
        "Leave without Pay": 1
      }
    },
    // Add more employees here...
  ],
  "2025-04": [
    {
      id: 1,      name: "John Smith",
      nickname: "John",
      position: "Programmer",
      leaveData: {
        "Sick Leave": 1,
        "Personal Leave": 0,
        "Annual Leave": 3,
        "Maternity Leave": 0,
        "Ordination Leave": 0,
        "Leave without Pay": 0
      }
    },
    // Add more historical data...
  ]
};

function Leaves() {
  const [tab, setTab] = useState(0);
  const [leaveTypes, setLeaveTypes] = useState(leaveTypesDefault);
  const [newType, setNewType] = useState("");
  const [newDays, setNewDays] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [reportSearchQuery, setReportSearchQuery] = useState("");
  const [selectedLeaveType, setSelectedLeaveType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, leaveIndex: -1 });
  const [leaveList, setLeaveList] = useState(leaveListMock);
  const [deletePopup, setDeletePopup] = useState({ visible: false, typeId: null });
  const [leaveDetailPopup, setLeaveDetailPopup] = useState({ visible: false, leaveData: null });
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().slice(0, 7),
    to: new Date().toISOString().slice(0, 7)
  });

  const handleContextMenu = (e, index) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.pageX,
      y: e.pageY,
      leaveIndex: index
    });
  };

  const handleStatusChange = (newStatus) => {
    if (contextMenu.leaveIndex !== -1) {
      const updatedLeaves = [...leaveList];
      updatedLeaves[contextMenu.leaveIndex] = {
        ...updatedLeaves[contextMenu.leaveIndex],
        status: newStatus
      };
      setLeaveList(updatedLeaves);
    }
    setContextMenu({ visible: false, x: 0, y: 0, leaveIndex: -1 });
  };

  // Add click handler to close context menu when clicking outside
  useEffect(() => {
    const handleClick = () => setContextMenu({ visible: false, x: 0, y: 0, leaveIndex: -1 });
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Add status options
  const statusOptions = ["all", "Approved", "Pending", "Rejected"];

  // Updated filter function
  const filteredLeaveList = leaveList.filter(leave => {
    const searchLower = searchQuery.toLowerCase();
    const matchName = leave.name.toLowerCase().includes(searchLower);
    const matchNickname = leave.nickname.toLowerCase().includes(searchLower);
    const matchDate = leave.date.includes(searchQuery);
    const matchType = selectedLeaveType === "all" || leave.type === selectedLeaveType;
    const matchStatus = selectedStatus === "all" || leave.status === selectedStatus;
    
    return (matchName || matchNickname || matchDate) && matchType && matchStatus;
  });

  const handleAddType = (e) => {
    e.preventDefault();
    if (!newType) return;
    const newId = Math.max(...leaveTypes.map(t => t.id), 0) + 1;
    setLeaveTypes([...leaveTypes, { id: newId, name: newType, days: newDays }]);
    setNewType("");
    setNewDays(1);
  };

  const handleEdit = (type) => {
    setEditingId(type.id);
    setNewType(type.name);
    setNewDays(type.days);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setLeaveTypes(leaveTypes.map(type => 
      type.id === editingId 
        ? { ...type, name: newType, days: newDays }
        : type
    ));
    setEditingId(null);
    setNewType("");
    setNewDays(1);
  };

  const handleDelete = (id) => {
    setDeletePopup({ visible: true, typeId: id });
  };

  const confirmDelete = () => {
    setLeaveTypes(leaveTypes.filter(type => type.id !== deletePopup.typeId));
    setDeletePopup({ visible: false, typeId: null });
  };

  const cancelDelete = () => {
    setDeletePopup({ visible: false, typeId: null });
  };
  const handleDateRangeChange = (type, value) => {
    setDateRange(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleLeaveDetailClick = (leave) => {
    setLeaveDetailPopup({
      visible: true,
      leaveData: leave
    });
  };

  const closeLeaveDetailPopup = () => {
    setLeaveDetailPopup({
      visible: false,
      leaveData: null
    });
  };

  const handleSearchChange = (e) => {
    setReportSearchQuery(e.target.value);
  };

  // Get all months in range
  const getMonthsInRange = () => {
    const start = new Date(dateRange.from + "-01");
    const end = new Date(dateRange.to + "-01");
    const months = [];
    
    for(let current = start; current <= end; current.setMonth(current.getMonth() + 1)) {
      months.push(current.toISOString().slice(0, 7));
    }
    
    return months;
  };
  // Combine reports from all months in range
  const getCombinedReports = () => {
    const months = getMonthsInRange();
    const combined = {};
    
    months.forEach(month => {
      if (employeeLeaveReports[month]) {
        employeeLeaveReports[month].forEach(employee => {
          if (!combined[employee.id]) {
            combined[employee.id] = {
              ...employee,
              leaveData: { ...employee.leaveData }
            };
          } else {
            // Sum up leave data
            Object.keys(employee.leaveData).forEach(type => {
              combined[employee.id].leaveData[type] = 
                (combined[employee.id].leaveData[type] || 0) + (employee.leaveData[type] || 0);
            });
          }
        });
      }
    });
    
    // Filter reports based on search query
    return Object.values(combined).filter(employee => {
      if (!reportSearchQuery) return true;
      const searchTerm = reportSearchQuery.toLowerCase();
      return (
        employee.name.toLowerCase().includes(searchTerm) ||
        employee.nickname.toLowerCase().includes(searchTerm) ||
        employee.department.toLowerCase().includes(searchTerm)
      );
    });
  };

  // Filtered reports based on search query
  const filteredReports = getCombinedReports().filter(employee => {    const searchLower = reportSearchQuery.toLowerCase();
    const matchName = employee.name.toLowerCase().includes(searchLower);
    const matchNickname = employee.nickname.toLowerCase().includes(searchLower);
    const matchPosition = employee.position.toLowerCase().includes(searchLower);
    
    return matchName || matchNickname || matchPosition;
  });
  return (
    <div className="dashboard-container">
      <SideMenu />
      <div className="dashboard-main">
        <ul className="circles">
          {[...Array(15)].map((_, i) => (
            <li key={`top-${i}`}></li>
          ))}
        </ul>
        
        <ul className="circles-bottom">
          {[...Array(15)].map((_, i) => (
            <li key={`bottom-${i}`}></li>
          ))}
        </ul>

        <div className="dashboard-content">
          <Topbar pageTitle="Leave Management" pageSubtitle="Manage leave types and records" />
          <div className="leaves-container">
            <div className="leaves-tabs">
              <button className={tab===0?"active":""} onClick={()=>setTab(0)}>Create Leave Types</button>
              <button className={tab===1?"active":""} onClick={()=>setTab(1)}>All Leave Records</button>
              <button className={tab===2?"active":""} onClick={()=>setTab(2)}>Leave Reports</button>
            </div>
            <div className="leaves-content">
              {tab === 0 && (
                <div className="leaves-type-section">
                  <form className="leave-type-form-modern" onSubmit={editingId ? handleUpdate : handleAddType}>
                    <input 
                      type="text" 
                      placeholder="Leave type name" 
                      value={newType} 
                      onChange={e=>setNewType(e.target.value)} 
                      required 
                    />
                    <input 
                      type="number" 
                      min={0} 
                      max={365} 
                      value={newDays} 
                      onChange={e=>setNewDays(Number(e.target.value))} 
                      required 
                    />
                    <button type="submit">
                      {editingId ? 'Update' : 'Add Type'}
                    </button>
                  </form>
                  <div className="leave-type-header-row">
                    <span className="leave-type-header-name">Leave Type</span>
                    <span className="leave-type-header-days">Days</span>
                    <span className="leave-type-header-actions">Action</span>
                  </div>
                  <ul className="leave-type-list-modern">
                    {leaveTypes.map((type) => (
                      <li key={type.id}>
                        <span className="leave-type-name">{type.name}</span>
                        <span className="leave-type-days">{type.days} days</span>
                        <div className="leave-type-actions">
                          <button 
                            className="action-btn edit" 
                            onClick={() => handleEdit(type)}
                            title="Edit"
                          >
                            <FiEdit2 />
                          </button>
                          <button 
                            className="action-btn delete" 
                            onClick={() => handleDelete(type.id)}
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tab===1 && (
                <div className="leaves-list-section">
                  <div className="search-filters">
                    <div className="search-container">                      <input
                        type="text"
                        placeholder="Search by name, nickname, or date (YYYY-MM-DD)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                      />
                    </div>
                    <div className="filter-container">
                      <select
                        value={selectedLeaveType}
                        onChange={(e) => setSelectedLeaveType(e.target.value)}
                        className="filter-select"
                      >
                        <option value="all">ALL TYPE</option>
                        {leaveTypes.map(type => (
                          <option key={type.id} value={type.name}>{type.name}</option>
                        ))}
                      </select>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="filter-select"
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>
                            {status === "all" ? "ALL STATUS" : status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <table className="leaves-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Nickname</th>
                        <th>Leave Date</th>
                        <th>Days</th>
                        <th>Leave Type</th>
                        <th>Status</th>
                        <th>Approver</th>
                        <th>Reason</th>
                      </tr>
                    </thead>                      <tbody>
                      {filteredLeaveList.map((l,i)=>(
                        <tr key={i} onContextMenu={(e) => handleContextMenu(e, i)}>                          <td>
                            {l.name}
                          </td>
                          <td onClick={() => handleLeaveDetailClick(l)} style={{ cursor: 'pointer' }}>{l.nickname}</td>
                          <td onClick={() => handleLeaveDetailClick(l)} style={{ cursor: 'pointer' }}>{l.date}</td>
                          <td onClick={() => handleLeaveDetailClick(l)} style={{ cursor: 'pointer' }}>{l.days}</td>
                          <td onClick={() => handleLeaveDetailClick(l)} style={{ cursor: 'pointer' }}>{l.type}</td>
                          <td onClick={() => handleLeaveDetailClick(l)} style={{ cursor: 'pointer' }}>
                            <span className={`status-cell status-${l.status.toLowerCase()}`}>
                              {l.status}
                            </span>
                          </td>
                          <td onClick={() => handleLeaveDetailClick(l)} style={{ cursor: 'pointer' }}>{l.approver}</td>
                          <td onClick={() => handleLeaveDetailClick(l)} style={{ cursor: 'pointer' }}>{l.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {contextMenu.visible && (
                    <div className="context-menu" style={{ top: contextMenu.y, left: contextMenu.x }}>
                      <button onClick={() => handleStatusChange('Approved')}>
                        <FiCheck style={{ marginRight: '8px', color: '#22c55e' }} />
                        Approve
                      </button>
                      <button onClick={() => handleStatusChange('Pending')}>
                        <FiClock style={{ marginRight: '8px', color: '#eab308' }} />
                        Pending
                      </button>
                      <button onClick={() => handleStatusChange('Rejected')}>
                        <FiX style={{ marginRight: '8px', color: '#ef4444' }} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              )}              {tab===2 && (                <div className="leaves-report-section">
                  <div className="report-container">
                    <div className="report-header">
                      <div className="report-controls">
                        <div className="search-container">
                          <input
                            type="text"                            placeholder="Search by employee, nickname or position (Programmer, HR, System)..."
                            value={reportSearchQuery}
                            onChange={(e) => setReportSearchQuery(e.target.value)}
                            className="search-input"
                          />
                        </div>
                        <div className="month-selector">
                          <div className="date-range-group">
                            <span className="date-range-label">From:</span>
                            <input
                              type="month"
                              className="month-input"
                              value={dateRange.from}
                              onChange={(e) => handleDateRangeChange('from', e.target.value)}
                              max={dateRange.to}
                            />
                          </div>
                          <div className="date-range-group">
                            <span className="date-range-label">To:</span>
                            <input
                              type="month"
                              className="month-input"
                              value={dateRange.to}
                              onChange={(e) => handleDateRangeChange('to', e.target.value)}
                              min={dateRange.from}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="table-wrapper">
                      <table className="report-table">                        <thead>                          <tr>                            <th className="col-employee">Employees</th>
                            <th className="col-position">Position</th>
                            <th className="col-total">Total Days</th>
                            <th className="col-leave">Sick Leave</th>
                            <th className="col-leave">Personal Leave</th>
                            <th className="col-leave">Maternity Leave</th>
                            <th className="col-leave">Ordination Leave</th>
                            <th className="col-leave">Leave without Pay</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getCombinedReports().map((employee) => {
                            const totalDays = Object.values(employee.leaveData).reduce((a, b) => a + b, 0);
                            return (                              <tr key={employee.id}>                                <td>                                  <div className="employee-info">
                                    <span className="employee-name">{employee.name}</span>
                                    <span className="employee-nickname">({employee.nickname})</span>
                                  </div>
                                </td>                                <td>
                                  <span className={`position-${employee.position.replace(/\s+/g, '')}`}>
                                    {employee.position}
                                  </span>
                                </td>
                                <td className="total-column">{totalDays}</td>                                <td data-count={employee.leaveData["Sick Leave"] || 0}>
                                  {employee.leaveData["Sick Leave"] || 0}
                                </td>
                                <td data-count={employee.leaveData["Personal Leave"] || 0}>
                                  {employee.leaveData["Personal Leave"] || 0}
                                </td>
                                <td data-count={employee.leaveData["Maternity Leave"] || 0}>
                                  {employee.leaveData["Maternity Leave"] || 0}
                                </td>
                                <td data-count={employee.leaveData["Ordination Leave"] || 0}>
                                  {employee.leaveData["Ordination Leave"] || 0}
                                </td>                                <td data-count={employee.leaveData["Leave without Pay"] || 0}>
                                  {employee.leaveData["Leave without Pay"] || 0}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {deletePopup.visible && (
        <div className="delete-popup-overlay">
          <div className="delete-popup">
            <div className="delete-popup-icon">
              <FiAlertTriangle />
            </div>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this leave type?</p>
            <p>This action cannot be undone.</p>
            <div className="delete-popup-buttons">
              <button className="cancel-btn" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="delete-btn" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {leaveDetailPopup.visible && (
        <div className="leave-detail-popup-overlay">
          <div className="leave-detail-popup">
            <div className="leave-detail-header">
              <h3>Leave Details</h3>
              <button className="close-btn" onClick={closeLeaveDetailPopup}>
                <FiX />
              </button>
            </div>
            <div className="leave-detail-content">
              <p><strong>Name:</strong> {leaveDetailPopup.leaveData.name}</p>
              <p><strong>Nickname:</strong> {leaveDetailPopup.leaveData.nickname}</p>              <p><strong>Position:</strong> {leaveDetailPopup.leaveData.position}</p>
              <p><strong>Leave Type:</strong> {leaveDetailPopup.leaveData.type}</p>
              <p><strong>Leave Date:</strong> {leaveDetailPopup.leaveData.date}</p>
              <p><strong>Days:</strong> {leaveDetailPopup.leaveData.days}</p>
              <p><strong>Status:</strong> {leaveDetailPopup.leaveData.status}</p>
              <p><strong>Approver:</strong> {leaveDetailPopup.leaveData.approver}</p>
              <p><strong>Reason:</strong> {leaveDetailPopup.leaveData.reason}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leaves;
