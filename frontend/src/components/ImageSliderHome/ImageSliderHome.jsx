import { useState, useEffect } from "react";
import { assets } from "../../assets/assets.js";
import "./ImageSliderHome.css";
import AOS from "aos"; // Import AOS
import "aos/dist/aos.css"; // Import AOS CSS
const ImageSlider = () => {
  const images = [
    assets.slide,
    assets.slide2,
    assets.slide3,
    assets.slide4,
    assets.slide5,
  ]; // Danh sách ảnh slider
  const [currentIndex, setCurrentIndex] = useState(0);

  // Tự động chuyển ảnh sau mỗi 3 giây
  useEffect(() => {
    AOS.init(); // Khởi tạo AOS
    AOS.refresh(); // Làm mới AOS
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // 3000ms = 3 giây

    return () => clearInterval(interval); // Dọn dẹp khi component unmount
  }, [images.length]);

  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };
  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="image-slider" data-aos="fade-up" data-aos-duration="2000">
      {/* Previous Image */}
      <div className="slider-image-container prev" onClick={prevImage} />

      {/* Image */}
      <div
        className="slider-image-container"
        style={{ width: "100%", height: "100%" }}
      >
        <img
          src={images[currentIndex]}
          alt={`slider-image-${currentIndex}`}
          className="slider-image"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Next Image */}
      <div className="slider-image-container next" onClick={nextImage} />
    </div>
  );
};
export default ImageSlider;
