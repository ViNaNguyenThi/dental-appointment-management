// Sử dụng điều hướng
import Navbar from "../../components/Navbar/Navbar.jsx";
import "./DoctorDetail.css";
import { assets } from "../../assets/assets.js";
import Footer from "../../components/Footer/Footer.jsx";

const DoctorDetail = () => {
  const doctor = {
    name: "Nguyễn Thị Vi Na",
    birthDate: "05/11/2004",
    gender: "Nữ",
    description: "",
  };

  return (
    <div>
      <Navbar />
      <div className="doctor-detail-page">
        <h1 className="doctor-title">CHI TIẾT BÁC SĨ</h1>
        <div className="doctor-detail-container">
          <div className="doctor-info">
            <div className="doctor-image-placeholder">
              <img src={assets.bsgq} alt="Bác sĩ Gia Quỳnh" />
            </div>
            <div className="doctor-details">
              <p>
                <strong>Bác sĩ:</strong> {doctor.name}
              </p>
              <p>
                <strong>Ngày sinh:</strong> {doctor.birthDate}
              </p>
              <p>
                <strong>Giới tính:</strong> {doctor.gender}
              </p>
              <p>
                <strong>Mô tả:</strong> {doctor.description}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorDetail;
