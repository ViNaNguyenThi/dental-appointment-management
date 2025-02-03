// src/components/Banner.jsx
import React from "react";
import PropTypes from "prop-types";
import "./Banner.css"; // Đảm bảo bạn đã tạo file CSS riêng

const Banner = ({ image, title, subtitle }) => {
  return (
    <div className="banner" style={{ backgroundImage: `url(${image})` }}>
      <div className="banner-content">
      </div>
    </div>
  );
};

Banner.propTypes = {
  image: PropTypes.string.isRequired,  // Đảm bảo truyền đường dẫn ảnh
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};

export default Banner;
