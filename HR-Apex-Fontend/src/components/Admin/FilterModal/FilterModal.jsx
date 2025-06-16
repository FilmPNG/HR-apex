import { useState, useEffect } from 'react'
import './FilterModal.css'

function FilterModal({ isOpen, onClose, onApply, initialFilters }) {
  const [selectedDepartments, setSelectedDepartments] = useState([])
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    if (isOpen && initialFilters) {
      setSelectedDepartments(initialFilters.departments || [])
      setSelectedTypes(initialFilters.types || [])
      setSelectedStatus(initialFilters.status || '')
    }
  }, [isOpen, initialFilters])

  const positions = ['System', 'HR', 'Programmer']
  const types = ['Permanent', 'Freelance', 'Intern', 'Contract']
  const statuses = ['Active', 'InActive']

  const handlePositionToggle = (pos) => {
    setSelectedDepartments(prev =>
      prev.includes(pos)
        ? prev.filter(d => d !== pos)
        : [...prev, pos]
    )
  }

  const handleTypeToggle = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const handleStatusToggle = (status) => {
    setSelectedStatus(prev => prev === status ? '' : status)
  }

  const handleReset = () => {
    setSelectedDepartments([])
    setSelectedTypes([])
    setSelectedStatus('')
  }

  const handleApply = () => {
    onApply({
      departments: selectedDepartments,
      types: selectedTypes,
      status: selectedStatus
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="filter-modal-overlay">
      <div className="filter-modal">
        <h3>Filter</h3>
        <div className="filter-section">
          <h4>Position</h4>
          <div className="department-grid">
            {positions.map(pos => (
              <div key={pos} className="department-item">
                <input
                  type="checkbox"
                  id={`position-${pos}`}
                  checked={selectedDepartments.includes(pos)}
                  onChange={() => handlePositionToggle(pos)}
                />
                <label htmlFor={`position-${pos}`}>{pos}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="filter-section">
          <h4>Type</h4>
          <div className="department-grid">
            {types.map(type => (
              <div key={type} className="department-item">
                <input
                  type="checkbox"
                  id={`type-${type}`}
                  checked={selectedTypes.includes(type)}
                  onChange={() => handleTypeToggle(type)}
                />
                <label htmlFor={`type-${type}`}>{type}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="filter-section select-type">
          <h4>Status</h4>
          <div className="type-options">
            {statuses.map(status => (
              <div key={status} className="type-item">
                <input
                  type="radio"
                  id={status}
                  name="status"
                  value={status}
                  checked={selectedStatus === status}
                  onChange={() => handleStatusToggle(status)}
                />
                <label htmlFor={status}>{status}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="reset-button">
          <button onClick={handleReset}>Reset</button>
        </div>
        <div className="filter-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="apply-btn" onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterModal