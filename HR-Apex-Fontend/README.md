# 💼 HR Management System

A modern HR Management System frontend built with **React**, designed to streamline HR operations and employee management.

## ✨ Features

🔹 **Employee Management**  
– Complete employee lifecycle management  
– Detailed employee profiles with personal and professional information  
– Department and position-based filtering  
– Quick search functionality  

🔹 **Leave Management**  
– Leave request tracking  
– Leave balance monitoring  
– Detailed leave reports  

🔹 **Disbursement Management**  
– Track financial disbursements and claims  
– Multi-category support (Travel, etc.)  
– Status tracking and filtering  

🔹 **News & Announcements**  
– Company-wide announcements  
– News categorization and pinning  
– Attachment support  
– Visibility controls  

🔹 **Holiday Management**  
– Official holiday calendar  
– Custom company events  
– Holiday type categorization  

🔹 **Account Management**  
– Role-based access control  
– Account status monitoring  
– Profile management  
– Security settings  

🔹 **Modern UI/UX**  
– Responsive design for all devices  
– Smooth animations with Framer Motion  
– Clean and intuitive interface  
– Interactive data visualization  



## ⚙️ Tech Stack

- ⚛️ React 18 + Vite  
- 🎨 Tailwind CSS  
- 🎞️ Framer Motion for animations  


## 📦 Installation & Usage

> Ensure Node.js is installed

```bash
# 1. Navigate to the project
cd hrmanagement

# 2. Install dependencies
npm install

# 3. Start frontend development server
npm run dev
```

---

## 🗂️ Project Structure

```
hrmanagement/
├── src/
│   ├── assets/            # Static assets (images, icons)
│   ├── components/        # React components
│   │   ├── Admin/        # Admin interface components
│   │   └── User/         # User interface components
│   ├── context/          # Global state management
│   ├── services/         # API services & mock data
│   ├── styles/           # Global styles
│   ├── App.jsx          # Root component
│   └── main.jsx         # Entry point
└── README.md
```

## 📌 Key Components

- **👥 All Employees**  
  Complete employee directory with filtering, search, and detailed profile views.

- **💸 Disbursement**  
  Financial disbursement tracking with multi-category support and status management.

- **📰 News**  
  Company announcements system with categorization and attachment support.

- **🌿 Leaves**  
  Leave management with configurable types and balance tracking.

- **📅 Holidays**  
  Holiday calendar management with custom event support.

- **⚙️ Settings**  
  System configuration, including account preferences and notifications.

- **👤 Account Management**  
  User account control with security settings and role management.

## 🚀 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 💻 Development

- Run development server: `npm run dev`
- Build for production: `npm run build`
- Preview production build: `npm run preview`

## 🎨 Theme Customization

The system uses a customizable theme with primary colors that can be configured in the Tailwind configuration.

## 🔒 Security Features

- Role-based access control
- Secure authentication flow
- Session management
- Password reset functionality

