// Mock API service
const mockData = {
  employees: [
    {
      id: "879912390",
      first_name: "Brooklyn",
      last_name: "Simmons",
      department: "Project Management",
      designation: "Project Manager",
      status: "Active"
    },
    // Add more mock employees as needed
  ],
  leaves: [
    {
      id: "1",
      employee_id: "879912390",
      leave_type: "Annual Leave",
      start_date: "2025-06-01",
      end_date: "2025-06-05",
      status: "Pending"
    }
  ],
  disbursements: [],
  holidays: [
    {
      id: "1",
      name: "New Year's Day",
      date: "2025-01-01",
      description: "New Year's Day celebration"
    }
  ]
};

export const api = {
  // Employee endpoints
  getEmployees: () => Promise.resolve(mockData.employees),
  getEmployee: (id) => Promise.resolve(mockData.employees.find(emp => emp.id === id)),
  
  // Leave endpoints
  getLeaves: () => Promise.resolve(mockData.leaves),
  createLeave: (leave) => {
    const newLeave = { ...leave, id: Date.now().toString() };
    mockData.leaves.push(newLeave);
    return Promise.resolve(newLeave);
  },

  // Holiday endpoints
  getHolidays: () => Promise.resolve(mockData.holidays),
  createHoliday: (holiday) => {
    const newHoliday = { ...holiday, id: Date.now().toString() };
    mockData.holidays.push(newHoliday);
    return Promise.resolve(newHoliday);
  },

  // Disbursement endpoints
  getDisbursements: () => Promise.resolve(mockData.disbursements),
  createDisbursement: (disbursement) => {
    const newDisbursement = { ...disbursement, id: Date.now().toString() };
    mockData.disbursements.push(newDisbursement);
    return Promise.resolve(newDisbursement);
  }
};