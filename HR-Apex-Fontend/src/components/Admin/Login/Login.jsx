import { useState, useEffect } from 'react'
import { FaEye, FaEyeSlash, FaRegUser } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import bgDashboard from "/src/assets/bgdashboard.png"
import '../AnimationCircles/AnimationCircles.css'
import './Login.css'

// Animation circles component
const AnimationCircles = () => (
  <>
    <ul className="circles">
      {[...Array(25)].map((_, i) => (
        <li key={`top-${i}`}></li>
      ))}
    </ul>
    <ul className="circles-bottom">
      {[...Array(25)].map((_, i) => (
        <li key={`bottom-${i}`}></li>
      ))}
    </ul>
  </>
)

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: ''
  })

  // Check for remembered credentials on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail')
    const rememberedPassword = localStorage.getItem('rememberedPassword')
    
    if (rememberedEmail && rememberedPassword) {
      setEmail(rememberedEmail)
      setPassword(rememberedPassword)
      setRememberMe(true)
    }
  }, [])

  // เพิ่ม state สำหรับเช็คขนาดหน้าจอ
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(window.innerWidth <= 1024)

  // เพิ่ม effect เพื่อติดตามการเปลี่ยนแปลงขนาดหน้าจอ
  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth <= 1024)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const validateForm = () => {
  let isValid = true;
  const newErrors = {
    email: '',
    password: ''
  };

  // Email validation
  if (!email.trim()) {
    newErrors.email = 'Email is required';
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    newErrors.email = 'Please enter a valid email address';
    isValid = false;
  }

  // Password validation
  if (!password) {
    newErrors.password = 'Password is required';
    isValid = false;
  }

  setFormErrors(newErrors);
  return isValid;
};

const handleLogin = async (e) => {
  e.preventDefault();
  setError('');

  if (!validateForm()) {
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/useraccount/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    });

    if (!res.ok) {
      // พยายามแยกสถานะ error code
      if (res.status === 401 || res.status === 400) {
        // รหัสผิด หรือไม่ผ่านการยืนยัน
        setError('Login failed. รหัสผ่านหรือชื่อผู้ใช้ไม่ถูกต้อง');
      } else {
        // อื่น ๆ เช่น 500, 503
        setError(`ระบบขัดข้องโปรดติดต่อผู้ดูแลระบบ (Error ${res.status})`);
      }
      return;
    }

    const data = await res.json();

    localStorage.setItem('token', data.token);
    localStorage.setItem('userRole', data.role);
    localStorage.setItem('isLoggedIn', 'true');
    // เพิ่มบรรทัดนี้ เพื่อเก็บข้อมูล employee ที่ได้จาก backend
    localStorage.setItem('employee', JSON.stringify(data.employee));

    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    if (data.role === 'admin' || data.role === 'superadmin') {
      navigate('/admin/news');
    } else {
      navigate('/user/news');
    }

  } catch (err) {
    // ดักกรณีเชื่อมต่อ server ไม่ได้เลย เช่น server ล่ม
    setError('ระบบขัดข้องโปรดติดต่อผู้ดูแลระบบ (เชื่อมต่อไม่ได้)');
    console.error('Login error:', err);
  }
};



  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const formVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  }

  return (
    <motion.div 
      className="login-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }}
    >
      {isMobileOrTablet && <AnimationCircles />}
      
      {/* แสดง dashboard preview เฉพาะบน desktop */}
      {!isMobileOrTablet && (
        <motion.div 
          className="login-left"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <img src={bgDashboard} alt="Dashboard Preview" className="dashboard-preview" />
        </motion.div>
      )}
      
      <motion.div 
        className="login-right"
        variants={formVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="login-form">
          <motion.div 
            className="app-logo"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <FaRegUser className="user-icon" />
            <span>HRMS</span>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h2 className="app-title">Welcome 👋</h2>
            <p className="app-subtitle">Please login here</p>
          </motion.div>

          <form onSubmit={handleLogin}>
            {/* Email input with icon */}
            <div className="group">
              <svg className="icon" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.25 6.75A2.25 2.25 0 014.5 4.5h15a2.25 2.25 0 012.25 2.25v12a2.25 2.25 0 01-2.25 2.25h-15A2.25 2.25 0 012.25 18.75v-12z" strokeLinejoin="round" strokeLinecap="round"></path>
                <path d="M21.75 6.75l-9.75 7.5-9.75-7.5" strokeLinejoin="round" strokeLinecap="round"></path>
              </svg>
              <input
                id="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setFormErrors(prev => ({ ...prev, email: '' }))
                  setError('')
                }}
                className={`input ${formErrors.email ? 'error' : ''}`}
                autoComplete="username"
              />
            </div>            {formErrors.email && (
              <motion.div 
                className="error-text"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                {formErrors.email}
              </motion.div>
            )}

            {/* Password input with icon and toggle */}
            <div className="group" style={{ position: 'relative' }}>
              <svg className="icon" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" strokeLinejoin="round" strokeLinecap="round"></path>
              </svg>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setFormErrors(prev => ({ ...prev, password: '' }))
                  setError('')
                }}
                className={`input ${formErrors.password ? 'error' : ''}`}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                style={{ right: 10, top: '50%', transform: 'translateY(-50%)', position: 'absolute' }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>            {formErrors.password && (
              <motion.div 
                className="error-text"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                {formErrors.password}
              </motion.div>
            )}

            {error && (
              <motion.div 
                className="error-message"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.div>
            )}

            <div className="remember-forgot-container">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember Me</span>
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>

            <motion.button 
              type="submit"
              className="login-button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Login
            </motion.button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Login