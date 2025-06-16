import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import SideMenu from '../SideMenu/Side_menu';
import Topbar from '../Topbar/Topbar';
import './holidays.css';

const Holidays = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showPopup, setShowPopup] = useState(false);
  const [displayIndexes, setDisplayIndexes] = useState({});

  const holidays = [
    {
      id: 1,
      name: "New Year's Day",
      date: "2025-01-01",
      type: "Public Holiday",
      details: "Start of the new year celebration"
    },
    {
      id: 2,
      name: "Chinese New Year",
      date: "2025-01-25",
      type: "Cultural Holiday",
      details: "Celebration of the Lunar New Year",
      duration: 2
    },
    {
      id: 3,
      name: "Valentine's Day",
      date: "2025-02-14",
      type: "Special Day",
      details: "Day of love and appreciation"
    },
    {
      id: 4,
      name: "Makha Bucha Day",
      date: "2025-03-03",
      type: "Religious Holiday",
      details: "Buddhist holiday celebrating the Buddha's first sermon"
    },
    {
      id: 5,
      name: "Chakri Memorial Day",
      date: "2025-04-06",
      type: "Public Holiday",
      details: "Commemorates the establishment of the Chakri Dynasty"
    },
    {
      id: 6,
      name: "Songkran Festival",
      date: "2025-04-13",
      type: "Cultural Holiday",
      details: "Traditional Thai New Year festival",
      duration: 3
    },
    {
      id: 7,
      name: "Labor Day",
      date: "2025-05-01",
      type: "Public Holiday",
      details: "International Workers' Day"
    },
    {
      id: 8,
      name: "Coronation Day",
      date: "2025-05-04",
      type: "Public Holiday",
      details: "Commemorates the coronation of King Rama X"
    },
    {
      id: 9,
      name: "Visakha Bucha Day",
      date: "2025-05-12",
      type: "Religious Holiday",
      details: "Commemorates Buddha's birth, enlightenment, and death"
    },
    {
      id: 10,
      name: "Asanha Bucha Day",
      date: "2025-07-11",
      type: "Religious Holiday",
      details: "Commemorates Buddha's first sermon"
    },
    {
      id: 11,
      name: "Her Majesty The Queen's Birthday",
      date: "2025-08-12",
      type: "Public Holiday",
      details: "Celebration of Queen Suthida's Birthday"
    },
    {
      id: 12,
      name: "Chulalongkorn Day",
      date: "2025-10-23",
      type: "Public Holiday",
      details: "Commemorates King Chulalongkorn's passing"
    },
    {
      id: 13,
      name: "Late King Bhumibol's Birthday",
      date: "2025-12-05",
      type: "Public Holiday",
      details: "National Day and Father's Day"
    },
    {
      id: 14,
      name: "Constitution Day",
      date: "2025-12-10",
      type: "Public Holiday",
      details: "Commemorates the adoption of Thailand's first constitution"
    },
    {
      id: 15,
      name: "Christmas Day",
      date: "2025-12-25",
      type: "Special Day",
      details: "Christmas celebration"
    },
    {
      id: 16,
      name: "New Year's Eve",
      date: "2025-12-31",
      type: "Public Holiday",
      details: "Last day of the year celebration"
    }
  ];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Group holidays by month
  const groupedHolidays = holidays.reduce((acc, holiday) => {
    const month = new Date(holiday.date).getMonth();
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(holiday);
    return acc;
  }, {});

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAddHoliday = (monthIndex) => {
    navigate(`/newholiday/${monthIndex}`);
  };

  // Add new function to handle holiday cycling
  const handleHolidayClick = (monthIndex) => {
    setDisplayIndexes(prev => {
      const currentIndex = prev[monthIndex] || 0;
      const monthHolidays = groupedHolidays[monthIndex] || [];
      const nextIndex = (currentIndex + 1) % monthHolidays.length;
      return { ...prev, [monthIndex]: nextIndex };
    });
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

        <div className="dashboard-content">
          <Topbar pageTitle="Holidays" pageSubtitle="Company Holidays Calendar" />
          <div className="form-container">
            <div className="form-card">
              <div className="holidays-container">
                <div className="holidays-header">
                  <div className="year-selector">
                    <button 
                      className="year-nav"
                      onClick={() => setSelectedYear(selectedYear - 1)}
                    >
                      ‹
                    </button>
                    <h2>{selectedYear}</h2>
                    <button 
                      className="year-nav"
                      onClick={() => setSelectedYear(selectedYear + 1)}
                    >
                      ›
                    </button>
                  </div>
                  <div className="holiday-summary">
                    <div className="summary-item">
                      <span className="summary-label">Total Holidays:</span>
                      <span className="summary-value">{holidays.length}</span>
                    </div>
                  </div>
                </div>

                <div className="holidays-grid">
                  {monthNames.map((month, index) => (
                    <div key={month} className="month-card">
                      <div className="month-header">
                        <div className="month-header-left">
                          <FiCalendar />
                          <h3>{month}</h3>
                        </div>
                        <div className="month-header-right">
                          <span className="month-total">
                            Total: {groupedHolidays[index]?.length || 0}
                          </span>
                          <button 
                            className="add-holiday-btn"
                            onClick={() => handleAddHoliday(index)}
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                      <div className="month-content">
                        {groupedHolidays[index]?.length > 0 && (
                          <div 
                            className="holiday-item clickable"
                            onClick={() => handleHolidayClick(index)}
                          >
                            <div className={`holiday-type ${groupedHolidays[index][displayIndexes[index] || 0].type.toLowerCase().replace(' ', '-')}`}>
                              {groupedHolidays[index][displayIndexes[index] || 0].type}
                            </div>
                            <h4>{groupedHolidays[index][displayIndexes[index] || 0].name}</h4>
                            <div className="holiday-date">
                              <FiClock />
                              <span>{formatDate(groupedHolidays[index][displayIndexes[index] || 0].date)}</span>
                            </div>
                            {groupedHolidays[index][displayIndexes[index] || 0].duration && (
                              <div className="holiday-duration">
                                Duration: {groupedHolidays[index][displayIndexes[index] || 0].duration} days
                              </div>
                            )}
                            <p className="holiday-details">
                              {groupedHolidays[index][displayIndexes[index] || 0].details}
                            </p>
                            {groupedHolidays[index].length > 1 && (
                              <div className="holiday-counter">
                                {(displayIndexes[index] || 0) + 1} / {groupedHolidays[index].length}
                              </div>
                            )}
                          </div>
                        )}
                        {!groupedHolidays[index]?.length && (
                          <div className="no-holidays">
                            No holidays this month
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Holidays;