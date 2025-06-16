import axios from 'axios';

export const getEmployeeProfile = async (employeeId) => {
  try {
    const mockData = {
      "879912390": {
        first_name: "Brooklyn",
        last_name: "Simmons",
        department: "Project Management",
        designation: "Project Manager",
        employee_type: "Office",
        status: "Permanent",
        mobile_number: "(702) 555-0122",
        email: "brooklyn.s@example.com",
        date_of_birth: "1995-07-14",
        marital_status: "Married",
        gender: "Female",
        nationality: "American",
        date_joined: "2022-07-10",
        working_days: 5,
        address: "2464 Royal Ln, Mesa",
        city: "New Jersey",
        zip_code: "35524",
        office_location: "2464 Royal Ln, Mesa, New Jersey",
        report_to: "Ralph Edwards",
        shift: "9:00 AM - 6:00 PM",
        state: "New Jersey",
        supervisor: "James Wilson",
        salary: 85000.00,
        image_url: "https://randomuser.me/api/portraits/women/1.jpg"
      }
    }
    
    return Promise.resolve(mockData[employeeId])
  } catch (error) {
    console.error('Error fetching employee profile:', error)
    throw error
  }
}

export const updateEmployeeProfile = async (employeeId, data) => {
  try {
    // Mock update - return updated data immediately
    return Promise.resolve(data)
  } catch (error) {
    console.error('Error updating employee profile:', error)
    throw error
  }
}

export const createEmployee = async (employeeData) => {
  try {
    // Mock creating a new employee - return the data with a fake ID
    const newEmployee = {
      ...employeeData,
      id: Math.floor(Math.random() * 1000000).toString()
    };
    return Promise.resolve(newEmployee);
  } catch (error) {
    throw new Error('Failed to create employee: ' + error.message);
  }
};