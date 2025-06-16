import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Admin/Login/Login'
import ForgotPassword from './components/Admin/ForgotPassword/ForgotPassword'
import Account from './components/Admin/Account/Account'
import ResetPassword from './components/Admin/ResetPassword/ResetPassword'
import AllEmployees from './components/Admin/AllEmployees/AllEmployees'
import NewEmployees from './components/Admin/NewEmployees/NewEmployees'
import ProfileDetail from './components/Admin/ProfileDetail/ProfileDetail'
import News from './components/Admin/Newspage/New'
import News_user from './components/User/News_user/News_user'
import AddNew from './components/Admin/Newspage/AddNews/Addnew'
import Leaves from './components/Admin/Leaves/leaves'
import AdminDisbursement from './components/Admin/Disbursement/disbursement'
import UserDisbursement from './components/User/Disbursement/disbursement'
import Payroll from './components/Admin/Payroll/Payroll'
import PayrollDetail from './components/Admin/PayrollDetail/PayrollDetail'
import Disbursement from './components/Admin/Disbursement/disbursement'
import Adddisburse from './components/Admin/Disbursement/Adddisburse'
import LeaveDetail from './components/Admin/Leaves/leavesdetail'
import Setting from './components/Admin/Layout/setting'
import Holidays from './components/Admin/holidays/holidays'
import NewHoliday from './components/Admin/holidays/newholiday'
import { ThemeProvider } from './context/ThemeContext'
import './styles/global.css'
import EditAccount from './components/Admin/Account/EditAccount'
import Notification from './components/Admin/Notifications/Notification'
import SuperAdminAccount from './components/SuperAdmin/SuperAdminAccount'
import EditSuperAdminAccount from './components/SuperAdmin/EditSuperAdminAccount'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

// User components
import UserLeaves from './components/User/Leaves/leaves';
import UserLeaveDetail from './components/User/Leaves/leavesdetail';
import UserHolidays from './components/User/holidays/holidays';
import UserPayrollDetail from './components/User/PayrollDetail/PayrollDetail';
import UserNotifications from './components/User/Notifications/Notification';
import UserAdddisburse from './components/User/Disbursement/Adddisburse';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename="/hrmapex_frontend">
        <Routes>
          {/* Common Routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'superadmin']} />}>
            <Route path="/admin/all-employees" element={<AllEmployees />} />
            <Route path="/admin/employees" element={<Navigate to="/admin/all-employees" />} />
            <Route path="/admin/new-employee" element={<NewEmployees />} />
            <Route path="/admin/news" element={<News />} />
            <Route path="/admin/addnews" element={<AddNew />} />
            <Route path="/admin/leaves" element={<Leaves />} />
            <Route path="/admin/leaves/detail/:empId" element={<LeaveDetail />} />
            <Route path="/admin/payroll" element={<Payroll />} />
            <Route path="/admin/payroll-detail/:id" element={<PayrollDetail />} />
            <Route path="/admin/disbursement" element={<AdminDisbursement />} />
            <Route path="/admin/adddisburse" element={<Adddisburse />} />
            <Route path="/admin/settings" element={<Setting />} />
            <Route path="/admin/holidays" element={<Holidays />} />
            <Route path="/admin/newholiday/:monthIndex" element={<NewHoliday />} />
            <Route path="/admin/account" element={<Account />} />
            <Route path="/admin/edit-account/:id" element={<EditAccount />} />
            <Route path="/admin/notifications" element={<Notification />} />
          </Route>

          {/* Super Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['superadmin']} />}>
            <Route path="/superadmin/account" element={<SuperAdminAccount />} />
            <Route path="/superadmin/edit-account/:id" element={<EditSuperAdminAccount />} />
          </Route>

          {/* User Routes */}
          <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
            <Route path="/user/news" element={<News_user />} />
            <Route path="/user/disbursement" element={<UserDisbursement />} />
            <Route path="/user/adddisburse" element={<UserAdddisburse />} />
            <Route path="/user/leaves" element={<UserLeaves />} />
            <Route path="/user/leaves/detail/:empId" element={<UserLeaveDetail />} />
            <Route path="/user/holidays" element={<UserHolidays />} />
            <Route path="/user/payroll-detail/:id" element={<UserPayrollDetail />} />
            <Route path="/user/notifications" element={<UserNotifications />} />
          </Route>

          {/* Routes accessible to users and admins */}
          <Route element={<ProtectedRoute allowedRoles={['employee', 'admin', 'superadmin']} />}>
            <Route path="/admin/employee/:id" element={<ProfileDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
