import { useState, useEffect } from 'react'
import { IoArrowBack } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import bgDashboard from '../../../assets/bgdashboard.png'
import '../AnimationCircles/AnimationCircles.css'
import './ForgotPassword.css'

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

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false) // <-- เพิ่มตรงนี้
  const navigate = useNavigate()
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(window.innerWidth <= 1024)


  useEffect(() => {
  if (error) {
    console.log('Error set:', error)  
    const timer = setTimeout(() => setError(''), 10000)
    console.log('Error cleared')
    return () => clearTimeout(timer)
    }
  }, [error])

  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth <= 1024)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleSendOTP = async (e) => {
  e.preventDefault()
  setError('')
  setLoading(true)
  try {
    const res = await fetch('http://localhost:5000/api/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('ไม่พบบัญชีอีเมลนี้ในระบบ')
      } else {
        const data = await res.json()
        throw new Error(data.message || 'ไม่สามารถส่งรหัส OTP ได้')
      }
    }

    // ถ้าส่งสำเร็จไปหน้า OTP พร้อมส่ง email ไปด้วย
    navigate('/OTP', { state: { email } })
  } catch (err) {
    setError(err.message)
    console.log('Clear error called')
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
            <h2 className="forgot-title">Forgot Password</h2>
            <p className="forgot-subtitle">
              Enter your registered email address, we'll send you a code to reset your password.
            </p>
          </div>
          
          <form onSubmit={handleSendOTP}>
          <div className="group">
            <svg className="icon" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.25 6.75A2.25 2.25 0 014.5 4.5h15a2.25 2.25 0 012.25 2.25v12a2.25 2.25 0 01-2.25 2.25h-15A2.25 2.25 0 012.25 18.75v-12z" strokeLinejoin="round" strokeLinecap="round"></path>
              <path d="M21.75 6.75l-9.75 7.5-9.75-7.5" strokeLinejoin="round" strokeLinecap="round"></path>
            </svg>
            
            <input required
              type="email"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </div>

          {/* แสดงข้อความ error */}
          {error && <p className="error-text2">{error}</p>}

          
          <button className="login-button" type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Confirm'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword