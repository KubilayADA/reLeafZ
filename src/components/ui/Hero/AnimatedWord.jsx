import React from 'react';
import './Words-Sliding-Smooth.css';

const AnimatedWordsSlider = ({ words = [], className = "" }) => {
  return (
    <div className="animated-words-container">
      <div className="words-wrapper">
        {words.map((word, index) => (
          <div 
            key={index} 
            className={`word-item text-5xl md:text-7xl font-bold leading-tight italic ${className}`}
          >
            {word}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedWordsSlider;
