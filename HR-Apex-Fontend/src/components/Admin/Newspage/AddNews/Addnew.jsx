import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUpload, FiFile } from 'react-icons/fi'
import axios from 'axios'
import SideMenu from '../../SideMenu/Side_menu'
import Topbar from '../../Topbar/Topbar'
import './Addnew.css'

const API_URL = `http://localhost:5000/api/news/addnews`

const truncateFileName = (fileName) => {
  if (fileName.length <= 20) return fileName;
  const extension = fileName.split('.').pop();
  const name = fileName.substring(0, fileName.lastIndexOf('.'));
  return `${name.substring(0, 10)}...${extension}`;
};

function AddNew() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    topic: '',
    cate_news_id: '',
    content: '',
    file_name: [],
    create_name: 'admin'
  })
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [errors, setErrors] = useState({})
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }
  
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        file_name: [...prev.file_name, ...files]
      }))
      setUploadedFiles(prev => [...prev, ...files])
    }
  }

  const handleRemoveFile = (index) => {
    setFormData(prev => ({
      ...prev,
      file_name: prev.file_name.filter((_, i) => i !== index)
    }))
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.topic.trim()) {
      newErrors.topic = 'Topic is required'
    }
    if (!formData.cate_news_id) {
      newErrors.cate_news_id = 'Category is required'
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmation(true)
    } else {
      // Scroll to the first error field
      const firstErrorField = document.querySelector('.error-text');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }
  
  const handleConfirmSubmit = async () => {
    setIsLoading(true); // Start loading
    try {
      // Create FormData object to send multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append('topic', formData.topic);
      formDataToSend.append('cate_news_id', formData.cate_news_id);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('create_name', formData.create_name);
      
      // Append all files as file_name array
      if (formData.file_name && formData.file_name.length > 0) {
        formData.file_name.forEach((file, index) => {
          formDataToSend.append('file_name', file);
        });
      }

      // Send the data to the server
      const response = await axios.post(API_URL, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data) {
        navigate('/news');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error.response?.data?.message || 'Failed to add news. Please try again.');
    } finally {
      setIsLoading(false); // Stop loading
    }
  }

  const handleCancel = () => {
    navigate('/news')
  }
  
  const FileUploadSection = () => {
    const [isDragOver, setIsDragOver] = useState(false);
    
    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragOver(true);
    };

    const handleDragLeave = () => {
      setIsDragOver(false);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        setFormData(prev => ({
          ...prev,
          file_name: [...prev.file_name, ...files]
        }));
        setUploadedFiles(prev => [...prev, ...files]);
      }
    };

    return (
      <div className="upload-section">
        <div 
          className={`upload-area-doc ${isDragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label className="upload-label">
            <div className="upload-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p>Drag & Drop or <span className="choose-text">choose file</span> to upload</p>
            <span className="supported-text">Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG</span>
            <input 
              type="file" 
              style={{ display: 'none' }}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              multiple
            />
          </label>
        </div>
        {uploadedFiles.length > 0 && (
          <div className="uploaded-files-container">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="uploaded-file-info">
                <div className="file-info-left">
                  <FiFile />
                  <span title={file.name}>{truncateFileName(file.name)}</span>
                </div>
                <button
                  type="button"
                  className="remove-file-btn"
                  onClick={() => handleRemoveFile(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <SideMenu />
      <div className="dashboard-main">
        <ul className="circles">
          {[...Array(15)].map((_, i) => (
            <li key={`top-${i}`}></li>
          ))}
        </ul>
        
        <ul className="circles-bottom">
          {[...Array(15)].map((_, i) => (
            <li key={`bottom-${i}`}></li>
          ))}
        </ul>

        <Topbar pageTitle="Add News" pageSubtitle="Create a new announcement" />
        
        <motion.div 
          className="dashboard-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="news-form-container">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Topic <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  name="topic"
                  placeholder="Enter news topic"
                  value={formData.topic}
                  onChange={handleChange}
                  className={errors.topic ? 'input-field error' : 'input-field'}
                />
                {errors.topic && <span className="error-text">{errors.topic}</span>}
              </div>

              <div className="form-group">
                <label>Category <span style={{ color: 'red' }}>*</span></label>
                <select
                  name="cate_news_id"
                  value={formData.cate_news_id}
                  onChange={handleChange}
                  className={errors.cate_news_id ? 'input-field error' : 'input-field'}
                >
                  <option value="">Select category</option>
                  <option value="1">Announcement</option>
                  <option value="2">Activity</option>
                  <option value="3">IT</option>
                </select>
                {errors.cate_news_id && <span className="error-text">{errors.cate_news_id}</span>}
              </div>

              <div className="form-group">
                <label>Content <span style={{ color: 'red' }}>*</span></label>
                <textarea
                  name="content"
                  placeholder="Enter news content"
                  value={formData.content}
                  onChange={handleChange}
                  rows="6"
                  className={errors.content ? 'input-field error' : 'input-field'}
                />
                {errors.content && <span className="error-text">{errors.content}</span>}
              </div>

              <div className="form-group">
                <label>Files</label>
                <FileUploadSection />
              </div>

              <div className="form-group">
                <label>Created By</label>
                <input
                  type="text"
                  name="create_name"
                  value={formData.create_name}
                  onChange={handleChange}
                  className="input-field"
                  readOnly
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Submit
                </button>
              </div>
            </form>
          </div>

          {showConfirmation && (
            <div className="confirmation-overlay">
              <motion.div 
                className="confirmation-modal"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
              >
                {isLoading ? (
                  <div className="loading-indicator">Submitting...</div>
                ) : (
                  <>
                    <h3>Confirm Submission</h3>
                    <p>Are you sure you want to add this news?</p>
                    <div className="confirmation-actions">
                      <button 
                        className="btn-cancel" 
                        onClick={() => setShowConfirmation(false)}
                      >
                        Cancel
                      </button>
                      <button 
                        className="btn-submit"
                        onClick={handleConfirmSubmit}
                      >
                        Confirm
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          )}

          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>Submitting...</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default AddNew