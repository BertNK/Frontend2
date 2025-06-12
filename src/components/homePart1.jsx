import React, { useState } from 'react';
import './homePart1.css';

function HomePart1() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const highlightItems = [
    {
      img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80',
      link: 'https://unsplash.com/photos/IGfIGP5ONV0',
    },
    {
      img: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1600&q=80',
      link: 'https://unsplash.com/photos/VFGEZ4z8zOw',
    },
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? highlightItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === highlightItems.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="highlightContainer">
      <div className="highlightArrow" onClick={handlePrev}>
        <img src="/arrow-up.png" className="highlightArrowImg1" alt="Prev" />
      </div>
        {/* Block */}
      <div className="highlightBlock">
        <a href={highlightItems[currentIndex].link} target="_blank" rel="noopener noreferrer" className="highlightImageLink">
          <img src={highlightItems[currentIndex].img} className="highlightImage" alt={`Highlight ${currentIndex + 1}`}/>
        </a>
      </div>
        {/* Arrow */}
      <div className="highlightArrow" onClick={handleNext}>
        <img src="/arrow-up.png" className="highlightArrowImg2" alt="Next" />
      </div>
    </div>
  );
}

export default HomePart1;
