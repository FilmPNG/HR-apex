import React from 'react';
import SideMenu from '../SideMenu/Side_menu';
import Topbar from '../Topbar/Topbar';
import { useParams, useNavigate } from 'react-router-dom';
import './leavesdetail.css';

function LeaveDetail() {
  const { empId } = useParams();
  const navigate = useNavigate();

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

        <div className="dashboard-content">
          <Topbar pageTitle="Leave Details" pageSubtitle="Employee Leave Information" />
          <div className="leave-detail-container">
            <button className="back-button" onClick={() => navigate('/leaves')}>
              ← Back to Leave Reports
            </button>
            <div className="leave-detail-content">
              <div className="employee-header">
                <h2>Employee Leave Details</h2>
                <p>Employee ID: {empId}</p>
              </div>
              <div className="leave-info-grid">
                {/* Leave info will be populated based on employee data */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaveDetail;