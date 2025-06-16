// Mock employee data
export const employeesJson = [
  {
    id: "879912390",
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
  },
  {
    id: "879912391",
    first_name: "Alex",
    last_name: "Johnson",
    department: "Engineering",
    designation: "Senior Developer",
    employee_type: "Office",
    status: "Permanent",
    mobile_number: "(702) 555-0123",
    email: "alex.j@example.com",
    date_of_birth: "1990-03-21",
    marital_status: "Single",
    gender: "Male",
    nationality: "American",
    date_joined: "2021-08-15",
    working_days: 5,
    address: "789 Tech Ave",
    city: "San Francisco",
    zip_code: "94105",
    office_location: "789 Tech Ave, San Francisco, CA",
    report_to: "Brooklyn Simmons",
    shift: "9:00 AM - 6:00 PM",
    state: "California",
    supervisor: "Brooklyn Simmons",
    salary: 120000.00,
    image_url: "https://randomuser.me/api/portraits/men/2.jpg"
  }
];

export const getEmployees = () => {
  try {
    // Split the file content into individual JSON objects and parse them
    const employeesArray = employeesJson
      .split('}')
      .filter(json => json.trim())
      .map(json => JSON.parse(json + '}'))
    
    return employeesArray
  } catch (error) {
    console.error('Error parsing employees data:', error)
    return []
  }
}

export const employeeDetails = {
  "345321231": {
    name: "Darlene Robertson",
    nickname: "Darlie",
    employeeId: "345321231",
    email: "darlene@example.com",
    phone: "+66 98 765 4321",
    department: "Design",
    designation: "UI/UX Designer", 
    type: "Office",
    status: "Permanent",
    imageUrl: "https://randomuser.me/api/portraits/women/1.jpg",
    personalInfo: {
      dateOfBirth: "1992-03-15",
      gender: "Female",
      address: "123 Sukhumvit Road",
      city: "Bangkok",
      state: "Bangkok",
      zipCode: "10110",
      nationality: "Thai",
      maritalStatus: "Single"
    },
    workInfo: {
      dateJoined: "2022-01-15",
      employeeType: "Full Time",
      workingDays: "Monday - Friday",
      officeLocation: "Bangkok HQ",
      reportTo: "Robert Allen",
      shift: "9:00 AM - 6:00 PM"
    },
    bankInfo: {
      bankName: "Bangkok Bank",
      accountName: "Darlene Robertson",
      accountNumber: "xxx-x-x1234-x",
      ifscCode: "BKKBTHBK"
    },
    emergencyContact: {
      name: "John Robertson",
      relationship: "Brother",
      phone: "+66 91 234 5678",
      address: "456 Silom Road, Bangkok"
    }
  }
  // Add more employee details as needed
}