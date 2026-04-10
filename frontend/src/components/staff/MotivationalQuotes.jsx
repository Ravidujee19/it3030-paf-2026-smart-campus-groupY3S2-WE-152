import React, { useState, useEffect, useCallback } from 'react';
import '../../styles/MotivationalQuotes.css';

const QUOTES = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "Career"
  },
  {
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    category: "Leadership"
  },
  {
    text: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
    author: "Steve Jobs",
    category: "Inspiration"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "Resilience"
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    category: "Productivty"
  },
  {
    text: "Logic will get you from A to B. Imagination will take you everywhere.",
    author: "Albert Einstein",
    category: "Creativity"
  }
];

const MotivationalQuotes = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const handleNext = useCallback(() => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % QUOTES.length);
      setIsFading(false);
    }, 400); // Matches CSS transition time
  }, []);

  const handlePrev = useCallback(() => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + QUOTES.length) % QUOTES.length);
      setIsFading(false);
    }, 400);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 8000); // Rotate every 8 seconds

    return () => clearInterval(timer);
  }, [handleNext]);

  const currentQuote = QUOTES[currentIndex];

  return (
    <div className="quotes-widget-container">
      <div className="quotes-card">
        <div className="quote-icon">
          <svg fill="currentColor" viewBox="0 0 24 24" width="32" height="32">
            <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V4L14.017 3H19.017C20.6739 3 22.017 4.34315 22.017 6V15C22.017 16.6569 20.6739 18 19.017 18H17.017L17.017 21H14.017ZM2.01697 21L2.01697 18C2.01697 16.8954 2.9124 16 4.01697 16H7.01697C7.56925 16 8.01697 15.5523 8.01697 15V9C8.01697 8.44772 7.56925 8 7.01697 8H4.01697C2.9124 8 2.01697 7.10457 2.01697 6V4L2.01697 3H7.01697C8.67382 3 10.017 4.34315 10.017 6V15C10.017 16.6569 8.67382 18 7.01697 18H5.01697L5.01697 21H2.01697Z" />
          </svg>
        </div>

        <div className={`quote-content ${isFading ? 'fade-out' : 'fade-in'}`}>
          <p className="quote-text">"{currentQuote.text}"</p>
          <div className="quote-footer">
            <span className="quote-author">— {currentQuote.author}</span>
            <span className="quote-category">{currentQuote.category}</span>
          </div>
        </div>

        <div className="quote-controls">
          <button onClick={handlePrev} className="control-btn" aria-label="Previous Quote">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="quote-indicators">
            {QUOTES.map((_, idx) => (
              <span 
                key={idx} 
                className={`indicator ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(idx)}
              />
            ))}
          </div>

          <button onClick={handleNext} className="control-btn" aria-label="Next Quote">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MotivationalQuotes;
