import React from 'react';
import './test.css';

const ShootingStars = () => {
  return (
    <div className="night">
      {[...Array(20)].map((_, index) => (
        <div key={index} className="shooting_star" />
      ))}
    </div>
  );
};

export default ShootingStars;