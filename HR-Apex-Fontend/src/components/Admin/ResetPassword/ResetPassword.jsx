import { useState, useEffect } from 'react'
import { IoArrowBack } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import Popup from '../PopupUpdatePass/Popup'
import bgDashboard from '../../../assets/bgdashboard.png'
import '../AnimationCircles/AnimationCircles.css'
import './ResetPassword.css'
import { useLocation } from 'react-router-dom';

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

function ResetPassword() {
  const location = useLocation();
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(window.innerWidth <= 1024)
  const navigate = useNavigate()
  const email = location.state?.email || ''; // รับ email จากหน้าเก่า
  

  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth <= 1024)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleResetPassword = async () => {
  if (password !== confirmPassword) {
    setError('Passwords do not match!')
    return
  }

  if (!email) {
    setError('No email found from previous page')
    return
  }

  try {
    const res = await fetch('http://localhost:5000/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword: password })
    })
    const data = await res.json()

    if (!res.ok) throw new Error(data.message || 'Failed to reset password')
    
    setError('')
    setIsPopupOpen(true)
  } catch (err) {
    setError(err.message)
  }
}
  return (
    <>
      <div className="login-container">
        {isMobileOrTablet && <AnimationCircles />}
        
        {!isMobileOrTablet && (
          <div className="login-left">
            <img src={bgDashboard} alt="Dashboard Preview" className="dashboard-preview" />
          </div>
        )}

        <div className="login-right">
          <div className="login-form">
            <div className="back-button" onClick={() => window.history.back()}>
              <IoArrowBack className="back-icon" />
              <span>Back</span>
            </div>

            <div>
              <h2 className="reset-title">Reset Password</h2>
              <p className="reset-subtitle">
                Please enter your new password
              </p>
            </div>

            <div>
              {/* New Password input with icon */}
              <div className="group">
                <svg className="icon" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" strokeLinejoin="round" strokeLinecap="round"></path>
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* Confirm New Password input with icon */}
              <div className="group">
                <svg className="icon" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" strokeLinejoin="round" strokeLinecap="round"></path>
                </svg>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <p className="error-message">
                {error}
              </p>
            )}

            <button className="login-button" onClick={handleResetPassword}>
              Reset Password
            </button>
          </div>
        </div>
      </div>
      <Popup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)}
      />
    </>
  )
}

export default ResetPassword