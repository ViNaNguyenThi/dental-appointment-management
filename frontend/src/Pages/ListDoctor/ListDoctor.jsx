// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const navigate = useNavigate(); // Điều hướng tới trang chi tiết bác sĩ

  // Hàm gọi API để lấy danh sách bác sĩ theo trang
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/user/fourdoctors`, {
          params: { page: currentPage, limit: 4 },
          withCredentials: true,
        });
        console.log("API Response:", response.data); // Log để kiểm tra dữ liệu
        setDoctors(response.data.doctors || []);
        setTotalPages(response.data.totalPages); // Cập nhật tổng số trang
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bác sĩ:", error);
      }
    };
    fetchDoctors();
  }, [currentPage]);
   // Gọi lại API mỗi khi currentPage thay đổi

  // Hàm điều hướng đến trang chi tiết bác sĩ
  const handleDoctorClick = (doctor) => {
    navigate(`/doctordetail/${doctor._id}`);
  };

  // Hàm xử lý khi người dùng chọn một trang cụ thể
  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="doctor-list">
      <h2>Danh sách bác sĩ</h2>
      <div className="doctor-cards">
        {doctors.map((doctor) => (
          <div
            key={doctor._id}
            className="doctor-card"
            onClick={() => handleDoctorClick(doctor._id)}
          >
            <img src={doctor.docAvatar?.url} alt={doctor.name} />
            <h3>{doctor.name}</h3>
          </div>
        ))}
      </div>

      {/* Pagination controls with numbered buttons */}
      <div className="pagination-controls">
  {totalPages > 1 && (
    Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index + 1}
        onClick={() => handlePageClick(index + 1)}
        className={currentPage === index + 1 ? "active-page" : ""}
      >
        {index + 1}
      </button>
    ))
  )}
</div>
    </div>
  );
};

export default DoctorList;
