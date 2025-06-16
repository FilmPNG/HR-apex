import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiEye, FiEdit2, FiTrash2, FiPlus, FiFilter, FiPhone, FiBriefcase, FiCheckCircle, FiSearch } from 'react-icons/fi'
import axios from 'axios'
import SideMenu from '../SideMenu/Side_menu'
import Topbar from '../Topbar/Topbar'
import FilterModal from '../FilterModal/FilterModal'
import './AllEmployees.css'
import '../AnimationCircles/AnimationCircles.css'

// Custom hook to detect mobile screen
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= breakpoint)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [breakpoint])
  return isMobile
}

const AllEmployees = () => {
  const [employees, setEmployees] = useState([])
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [filters, setFilters] = useState({ departments: [], types: [], status: '' })
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState(null)
  const [selectedDepartments, setSelectedDepartments] = useState([])
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const navigate = useNavigate()
  const isMobile = useIsMobile(768)

  useEffect(() => {
    // ตรวจสอบ authentication
    const token = localStorage.getItem('token');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');

    // ถ้ายังไม่ล็อกอิน ให้กลับไปหน้า login
    if (!token || !isLoggedIn) {
      navigate('/login');
      return;
    }

    // ถ้า role ไม่ใช่ admin ไม่ให้เข้า
    if (userRole !== 'admin' && userRole !== 'superadmin') {
      navigate('/not-authorized');
      return;
    }
    

    const fetchEmployees = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await axios.get("http://localhost:5000/api/employee", {
          params: {
            limit: 100,
            page: 1
          }
        })

        const employees = response.data.data.map(emp => ({
          EmployeeId: emp.employee_id,
          FName: emp.first_name,
          LName: emp.last_name,
          Nickname: emp.nickname,
          Email: emp.email_person,
          MobileNumber: emp.mobile_no,
          Position: emp.position,
          Type: emp.employee_type?.name || 'N/A',
          Status: emp.status_employee || 'Unknown',
          ImageUrl: emp.pic_path
            ? `http://localhost:5000${emp.pic_path}`
            : `https://ui-avatars.com/api/?name=${emp.first_name}+${emp.last_name}&background=random&rounded=true`
        }))

        setEmployees(employees)
        setFilteredEmployees(employees)

      } catch (error) {
        console.error('Error fetching employees:', error)
        setError('Failed to fetch employees. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmployees()
  }, [navigate])

  useEffect(() => {
    const filtered = employees.filter(employee => {
      const searchTerm = search.toLowerCase().trim();
      if (!searchTerm) return true;
      const searchableFields = [
        `${employee.FName} ${employee.LName}`,
        employee.Nickname,
        employee.MobileNumber,
        employee.Email,
        employee.Age?.toString(),
        employee.Department,
        employee.Position,
        employee.Type,
        employee.Status,
        // Bank information
        employee.BankName,
        employee.AccountNumber,
        employee.AccountType,
        employee.AccountHolderName
      ].map(field => (field || '').toString().toLowerCase());
      return searchableFields.some(field => field.includes(searchTerm));
    });

    const departmentFiltered = filters.departments.length === 0 
      ? filtered 
      : filtered.filter(emp => filters.departments.includes(emp.Department));

    const typeFiltered = filters.types && filters.types.length > 0
      ? departmentFiltered.filter(emp => filters.types.includes(emp.Type))
      : departmentFiltered;

    const statusFiltered = filters.status
      ? typeFiltered.filter(emp => emp.Status === filters.status)
      : typeFiltered;

    setFilteredEmployees(statusFiltered);
    setCurrentPage(1);
  }, [search, employees, filters])

  // Get current employees
  const indexOfLastEmployee = currentPage * itemsPerPage
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee)
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage)
  const totalItems = filteredEmployees.length

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters)
  }

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee)
    setDeleteModalOpen(true)
  }
  // Handle delete employee
  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/employee/employee/${employeeToDelete.EmployeeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('ลบไม่สำเร็จ');
      }

      // ลบจาก state หลังจากลบจาก backend แล้ว
      const updatedEmployees = employees.filter(
        emp => emp.EmployeeId !== employeeToDelete.EmployeeId
      );
      setEmployees(updatedEmployees);
      setFilteredEmployees(updatedEmployees);
      setDeleteModalOpen(false);
      setEmployeeToDelete(null);
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('❌ ลบพนักงานไม่สำเร็จ');
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false)
    setEmployeeToDelete(null)
  }

  const toggleDepartment = (dep) => {
    setSelectedDepartments(prev => 
      prev.includes(dep) 
        ? prev.filter(d => d !== dep)
        : [...prev, dep]
    )
  }

  const handleReset = () => {
    setSelectedDepartments([])  // reset department
    setFilters({ departments: [], types: [], status: '' })  // reset type
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const DeleteModal = ({ isOpen, onClose, onConfirm, employeeName }) => {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="delete-modal" onClick={e => e.stopPropagation()}>
          <div className="delete-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 4.44772 8.44772 4 9 4H15C15.5523 4 16 4.44772 16 5V7M8 7H16" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2>Delete Employee</h2>
          <p>Are you sure you want to delete {employeeName}? This action cannot be undone.</p>
          <div className="modal-buttons">
            <button className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button className="delete-button" onClick={onConfirm}>
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { 
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { 
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        mass: 0.5
      }
    }
  }

  return (
    <div className="dashboard-container">
      <SideMenu 
        isMinimized={isMinimized} 
        onToggleMinimize={setIsMinimized} 
        mobileOpen={isMobileMenuOpen}
      />
      <div className="dashboard-main">
        <ul className="circles">
          {[...Array(15)].map((_, i) => (
            <li key={i}></li>
          ))}
        </ul>

        <Topbar 
          pageTitle="All Employees" 
          pageSubtitle="Manage employee information"
          onMobileMenuClick={handleMobileMenuToggle}
        />

        <motion.div 
          className="content-wrapper"
          variants={itemVariants}
        >
          <motion.div 
            className="search-actions"
            variants={itemVariants}
          >
            {isMobile ? (
              <div className="search-filter-row">
                <div className="search-box">
                  <input
                    type="text"
                    placeholder={isMobile ? '' : "Search employees..."}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={isMobile ? { paddingLeft: '2.2rem' } : {}}
                  />
                  {isMobile && (
                    <span className="search-icon-mobile">
                      <FiSearch size={20} />
                    </span>
                  )}
                </div>
                <button className="filter-btn" onClick={() => setIsFilterModalOpen(true)}>
                  <FiFilter />
                  <span>Filter</span>
                </button>
              </div>
            ) : (
              <>
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="action-buttons">
                  <button className="add-employee-btn" onClick={() => navigate('/new-employee')}>
                    <FiPlus />
                    <span>Add Employee</span>
                  </button>
                  <button className="filter-btn" onClick={() => setIsFilterModalOpen(true)}>
                    <FiFilter />
                    <span>Filter</span>
                  </button>
                </div>
              </>
            )}
          </motion.div>

          {/* MOBILE: Employee Card List */}
          {isMobile ? (
            <div className="employee-card-list">
              {currentEmployees.map((employee) => (
                <div className="employee-card" key={employee.EmployeeId}>
                  <div className="employee-card-avatar">
                    <img
                      className="employee-card-img"
                      src={employee.ImageUrl || '/src/assets/profile.png'}
                      alt={employee.FName}
                      onError={e => { e.target.src = '/src/assets/profile.png' }}
                    />
                  </div>
                  <div className="employee-card-info">
                    <div className="employee-card-name-row">
                      <span className="employee-card-name">{employee.FName} {employee.LName}</span>
                      {employee.Nickname && (
                        <span className="employee-card-nickname">({employee.Nickname})</span>
                      )}
                    </div>
                    <div className="employee-card-details">
                      <div className="employee-card-detail-row">
                        <span className="employee-card-detail-label">
                          <FiPhone style={{marginRight: '6px', color: '#b0b0b0'}} /> Phone
                        </span>
                        <span className="employee-card-detail-value">{employee.MobileNumber || '-'}</span>
                      </div>
                      <div className="employee-card-detail-row">
                        <span className="employee-card-detail-label">
                          <FiBriefcase style={{marginRight: '6px', color: '#b0b0b0'}} /> Type
                        </span>
                        <span className={`employee-card-detail-value type-badge type-${employee.Type?.toLowerCase()}`}>{employee.Type}</span>
                      </div>
                      <div className="employee-card-detail-row">
                        <span className="employee-card-detail-label">
                          <FiCheckCircle style={{marginRight: '6px', color: '#b0b0b0'}} /> Status
                        </span>
                        <span className={`employee-card-detail-value status ${employee.Status?.toLowerCase()}`}>{employee.Status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="employee-card-actions">
                    <button className="view-btn" onClick={() => navigate(`/employee/${employee.EmployeeId}`)} title="ดูข้อมูล">
                      <FiEye />
                    </button>
                    <button className="edit-btn" onClick={() => navigate(`/employee/${employee.EmployeeId}?edit=true`)} title="แก้ไข">
                      <FiEdit2 />
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteClick(employee)} title="ลบ">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // DESKTOP: Table Layout
            <div className="table-container">
              <motion.table 
                className="employees-table"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Position</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEmployees.map((employee) => (
                    <motion.tr 
                      key={employee.EmployeeId}
                      variants={itemVariants}
                    >
                      <td className="employee-name">
                        <img
                          src={employee.ImageUrl || '/src/assets/profile.png'}
                          alt={employee.FName}
                          onError={(e) => {e.target.src = '/src/assets/profile.png'}}
                        />
                        <div className="name-info">
                          <span>{`${employee.FName} ${employee.LName}`}</span>
                          {employee.Nickname && <span className="nickname">({employee.Nickname})</span>}
                        </div>
                      </td>
                      <td>{employee.Email || '-'}</td>
                      <td>{employee.MobileNumber || '-'}</td>
                      <td>{employee.Position || '-'}</td>
                      <td>
                        <span className={`type-badge type-${employee.Type?.toLowerCase()}`}>
                          {employee.Type}
                        </span>
                      </td>
                      <td>
                        <span className={`status ${employee.Status?.toLowerCase()}`}>
                          {employee.Status}
                        </span>
                      </td>
                      <td className="actions">
                        <button onClick={() => navigate(`/employee/${employee.EmployeeId}`)}>
                          <FiEye />
                        </button>
                        <button onClick={() => navigate(`/employee/${employee.EmployeeId}?edit=true`)}>
                          <FiEdit2 />
                        </button>
                        <button onClick={() => handleDeleteClick(employee)}>
                          <FiTrash2 />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </motion.table>
            </div>
          )}

          <motion.div 
            className="table-footer"
            variants={itemVariants}
          >
            <div className="items-per-page">
              <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="pagination">
              <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
                {'<<'}
              </button>
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                {'<'}
              </button>
              <button className="active">{currentPage}</button>
              {currentPage < totalPages && (
                <button onClick={() => handlePageChange(currentPage + 1)}>
                  {currentPage + 1}
                </button>
              )}
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                {'>'}
              </button>
              <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
                {'>>'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApply={handleApplyFilters}
          initialFilters={filters}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          employeeName={`${employeeToDelete?.FName} ${employeeToDelete?.LName}`}
        />
      )}

      {/* Floating Add Button for Mobile - only render ONCE at the root */}
      {isMobile && (
        <button 
          className="floating-add-btn" 
          onClick={() => navigate('/new-employee')} 
          aria-label="Add Employee"
        >
          <FiPlus size={28} />
        </button>
      )}
    </div>
  );
};

export default AllEmployees;