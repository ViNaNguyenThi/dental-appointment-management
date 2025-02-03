import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa'; // Import icon từ Font Awesome
import './BacktoTop.css'; 

const BacktoTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className="back-to-top">
      {isVisible && (
        <button onClick={scrollToTop} className="back-to-top-btn" title="Go to top">
          <FaArrowUp /> {/* Sử dụng icon thay vì ký tự mũi tên */}
        </button>
      )}
    </div>
  );
};

export default BacktoTop;