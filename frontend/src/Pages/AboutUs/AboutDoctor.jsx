import { useNavigate } from "react-router-dom"; // Sử dụng điều hướng
import Navbar from "../../components/Navbar/Navbar.jsx";
import "./AboutDoctor.css";
import { assets } from "../../assets/assets.js";
import Footer from "../../components/Footer/Footer.jsx";
import axios from "axios"
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
const AboutDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const navigate = useNavigate(); // Điều hướng tới trang chi tiết bác sĩ


  // Hàm gọi API để lấy danh sách bác sĩ theo trang
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/user/fourdoctors`, {
          params: { page: currentPage, limit: 4 }, // Thêm tham số page và limit
          withCredentials: true,
        });
        setDoctors(response.data.doctors || []);
        setTotalPages(response.data.totalPages); // Cập nhật tổng số trang
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bác sĩ:", error);
      }
    };
    fetchDoctors();
  }, [currentPage]); // Gọi lại API mỗi khi currentPage thay đổi


  // Hàm điều hướng đến trang chi tiết bác sĩ
  const handleDoctorClick = (doctorId) => {
    navigate(`/doctordetail/${doctorId}`);
  };


  // Hàm xử lý khi người dùng chọn một trang cụ thể
  const handlePageClick = (page) => {
    setCurrentPage(page);
  };


  return (
    <div>
      <Navbar />
      <div className="about-doctor">
        <header className="about-doctor__header lato-bold">
          <h2 className="lato-regular">GIỚI THIỆU ĐỘI NGŨ BÁC SĨ</h2>
          <p>
            Tại Bệnh viện Răng Hàm Mặt Mountain View, chúng tôi tự hào có đội
            ngũ bác sĩ giàu kinh nghiệm và chuyên môn cao, luôn sẵn sàng mang
            đến cho bệnh nhân sự chăm sóc tốt nhất và dịch vụ y tế chất lượng.
            Mỗi bác sĩ không chỉ có trình độ chuyên môn vững vàng mà còn có tâm
            huyết với nghề, cam kết mang lại nụ cười khỏe đẹp cho tất cả bệnh
            nhân.
          </p>
        </header>


        <div className="about-doctor__team-image">
          <img src={assets.bs} alt="Đội ngũ bác sĩ" />
          <p className="about-doctor__image-caption">
            Đội ngũ bác sĩ Mountain View
          </p>
        </div>


        <section className="about-doctor__description">
          <p>
            Bệnh viện tự hào có đội ngũ y bác sĩ giỏi chuyên môn, giàu kinh
            nghiệm và tận tâm với nghề. Tất cả các bác sĩ đều được đào tạo
            chuyên sâu trong và ngoài nước, luôn cập nhật những kiến thức và
            công nghệ mới nhất trong lĩnh vực nha khoa.
          </p>
        </section>


        <div className="about-doctor__section-header">
          <h3>ĐỘI NGŨ BÁC SĨ</h3>
        </div>


        {/* Phần hiển thị nút bác sĩ
        <div className="about-doctor__buttons">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="about-doctor__button">
              <button onClick={() => handleDoctorClick(doctor.detailPage)}>
                <img src={doctor.image} alt={doctor.name} />
                <p>{doctor.name}</p>
              </button>
            </div>
          ))}
        </div> */}


        <div className="about-doctor__buttons">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="about-doctor__button"
              onClick={() => handleDoctorClick(doctor._id)}
            >
              <img src={doctor.docAvatar?.url} alt={doctor.name} />
              <h3>{doctor.name}</h3>
            </div>
          ))}
        </div>


        {/* Pagination controls with numbered buttons */}
        <div className="pagination-controls">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageClick(index + 1)}
              className={currentPage === index + 1 ? "active-page" : ""}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};


export default AboutDoctor;


