import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiClock } from 'react-icons/fi';
import SideMenu from '../SideMenu/Side_menu';
import Topbar from '../Topbar/Topbar';
import './newholiday.css';

const NewHoliday = () => {
  const { monthIndex } = useParams();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const [formData, setFormData] = useState({
    name: '',
    date: '',
    type: 'Public Holiday',
    details: '',
    duration: '1'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically save the holiday to your backend
    // For now, we'll just navigate back
    navigate('/holidays');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="dashboard-container newholiday-container">
      <SideMenu />
      <div className="dashboard-main">
        <Topbar 
          pageTitle="Add New Holiday" 
          pageSubtitle={`Adding holiday for ${monthNames[monthIndex]} ${currentYear}`} 
        />
        <form onSubmit={handleSubmit} className="newholiday-form">
          <div className="newholiday-form-header">
            <h1>Add New Holiday</h1>
            <p>Adding holiday for {monthNames[monthIndex]} {currentYear}</p>
          </div>
          <div className="newholiday-form-grid">
            <div className="newholiday-form-group">
              <label>Holiday Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter holiday name"
                required
              />
            </div>

            <div className="newholiday-form-group">
              <label>Date</label>
              <div className="newholiday-input-with-icon">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="newholiday-form-group">
              <label>Type</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="Public Holiday">Public Holiday</option>
                <option value="Cultural Holiday">Cultural Holiday</option>
                <option value="Religious Holiday">Religious Holiday</option>
                <option value="Special Day">Special Day</option>
              </select>
            </div>

            <div className="newholiday-form-group">
              <label>Duration (days)</label>
              <div className="newholiday-input-with-icon">
                <FiClock className="newholiday-icon" />
                <input
                  type="number"
                  name="duration"
                  min="1"
                  value={formData.duration}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="newholiday-form-group full-width">
              <label>Details</label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                rows="4"
                placeholder="Enter holiday details..."
              ></textarea>
            </div>
          </div>

          <div className="newholiday-form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/holidays')} 
              className="newholiday-btn newholiday-btn-cancel"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="newholiday-btn newholiday-btn-save"
            >
              Save Holiday
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewHoliday;
