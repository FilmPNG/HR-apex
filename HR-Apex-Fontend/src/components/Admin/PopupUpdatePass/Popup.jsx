import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Popup.css'

const PopupUpdatePass = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const [isClosing, setIsClosing] = useState(false)

  const handleBackToLogin = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      navigate('/login')
    }, 300) // Match animation duration
  }

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false)
    }
  }, [isOpen])

  if (!isOpen) return null
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className={`popup-overlay ${isClosing ? 'closing' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className={`popup-content ${isClosing ? 'closing' : ''}`}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <motion.div 
              className="success-animation"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", damping: 12 }}
            >
              <div className="checkmark-circle">
                <div className="checkmark-check"></div>
              </div>
            </motion.div>
            <motion.h2 
              className="popup-title"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Password Updated Successfully!
            </motion.h2>
            <motion.p 
              className="popup-message"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Your password has been changed successfully. Please use your new password to login.
            </motion.p>
            <motion.button 
              className="back-to-login-button"
              onClick={handleBackToLogin}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Back to Login
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PopupUpdatePass