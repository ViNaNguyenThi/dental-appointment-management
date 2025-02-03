// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const DoctorDetail = () => {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/user/getdoctordetail/${doctorId}`, {
          withCredentials: true,
        });
        setDoctor(response.data.doctor);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin bác sĩ:", error);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  // Hàm định dạng ngày theo định dạng DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (!doctor) {
    return <p>Đang tải thông tin bác sĩ...</p>;
  }

  return (
    <div className="doctor-detail-page">
      <div className="doctor-card">
        <div className="doctor-avatar">
          <img
            src={doctor.docAvatar?.url || "/placeholder.jpg"}
            alt={doctor.name}
            className="doctor-avatar-img"
          />
        </div>
        <div className="doctor-info">
          <h1 className="doctor-name"><p>Bác sĩ: </p>{doctor.name}</h1>
          <p className="doctor-dob"><strong>Ngày sinh:</strong> {formatDate(doctor.dob)}</p>
          <p className="doctor-gender"><strong>Giới tính:</strong> {doctor.gender}</p>
          <p className="doctor-bio"><strong>Giới thiệu bản thân:</strong> {doctor.Introduceyourself}</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;
