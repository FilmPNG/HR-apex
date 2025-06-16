import { useState, useEffect } from 'react'
import { IoArrowBack } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import bgDashboard from '../../../assets/bgdashboard.png'
import '../AnimationCircles/AnimationCircles.css'
import './ForgotPassword.css'
import { useLocation } from 'react-router-dom'

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

function ConfirmOTP() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''
  const [otp, setOtp] = useState('')
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(window.innerWidth <= 1024)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth <= 1024)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!email) {
    // ถ้าไม่มี email จาก location.state กลับไปหน้า forgot-password
    navigate('/forgot-password')
    return null
  }

  const handleConfirmOTP = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:5000/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.message || 'Invalid OTP')

      // ถ้า OTP ถูกต้อง ไปหน้า reset-password พร้อมส่ง email ไปด้วย
      navigate('/reset-password', { state: { email } })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  return (
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
            <h2 className="forgot-title">Confirm OTP</h2>
            <p className="forgot-subtitle">
              Enter OTP, we'll send you a code to reset your password.
            </p>
          </div>

          <form onSubmit={handleConfirmOTP}>
          <div className="group">
            <svg className="icon" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.25 6.75A2.25 2.25 0 014.5 4.5h15a2.25 2.25 0 012.25 2.25v12a2.25 2.25 0 01-2.25 2.25h-15A2.25 2.25 0 012.25 18.75v-12z" strokeLinejoin="round" strokeLinecap="round"></path>
              <path d="M21.75 6.75l-9.75 7.5-9.75-7.5" strokeLinejoin="round" strokeLinecap="round"></path>
            </svg>
            
            <input required
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="input"
            />
          </div>

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Confirm'}
          </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}

export default ConfirmOTP;