import { assets } from "../../assets/assets.js";
import { NavLink } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="company-info">
          <img src={assets.logo} alt="logo" className="logo-footer" />
          <div className="footer-container">
            <h3 className="lato-regular">CÔNG TY TNHH SIXBAGS</h3>
            <h3 className="lato-regular">
              Địa chỉ: 828 Sư Vạn Hạnh, phường 13, quận 10, Thành phố Hồ Chí
              Minh
            </h3>
            <h3 className="lato-regular">Email: mountainview@gmail.com</h3>
          </div>
        </div>

        <div className="company-content">
          <h3 className="lato-regular">
            CMSDN: 0315575273 do Sở Kế hoạch và Đầu tư Thành phố Hồ Chí Minh cấp
            lần đầu ngày 20/03/2019, sửa đổi lần thứ 7 ngày 09/06/2022.
          </h3>
          <h3 className="lato-regular">
            © 2024 | All rights reserved by Mountain View Dental Care Co., Ltd.
          </h3>
        </div>

        <div className="footer-links">
          <h3 className="lato-bold">GIỚI THIỆU</h3>
          <ul>
            <li className="lato-regular">
              <NavLink to="/about">Về Chúng Tôi</NavLink>
            </li>
            <li className="lato-regular">
              <NavLink to="/price">Bảng Giá Dịch Vụ</NavLink>
            </li>
            <li className="lato-regular">
              <NavLink to="/privacy-policy">Chính Sách Bảo Mật</NavLink>
            </li>
          </ul>
        </div>

        <div className="footer-location">
          <h3 className="lato-bold">HỆ THỐNG PHÒNG KHÁM</h3>
          <ul>
            <li className="lato-regular">
              <NavLink to="/hcm">Tp. Hồ Chí Minh</NavLink>
            </li>
            <li className="lato-regular">
              <NavLink to="/hanoi">Hà Nội</NavLink>
            </li>
          </ul>
          <ul>
            <li className="lato-regular">
              <NavLink to="/danang">Đà Nẵng</NavLink>
            </li>
            <li>
              <NavLink to="/provinces">Các tỉnh</NavLink>
            </li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3 className="lato-bold">GIỜ LÀM VIỆC</h3>
          <p className="lato-regular" style={{ width: "165px" }}>
            Từ 8:30 tới 18:30 tất cả các ngày trong tuần
          </p>
        </div>

        <div className="footer-info">
          <h3 className="lato-bold">LIÊN HỆ</h3>
          <p className="lato-regular">HOTLINE: 1900 8059</p>

          <div className="social-icons">
            <a href="https://www.facebook.com/huflit.edu.vn">
              <img src={assets.fb} alt="icon" className="icon-social" />
            </a>
            <a href="https://www.instagram.com/_tngannnn?igsh=cTYxcnhqZjR2dmZq">
              <img src={assets.ig} alt="icon" className="icon-social" />
            </a>
            <a href="https://www.youtube.com/@huflitofficial2711">
              <img src={assets.yt} alt="icon" className="icon-social" />
            </a>
            <a href="https://www.tiktok.com/@vinamilk05?_t=8ql41KhU85y&_r=1">
              <img src={assets.tt} alt="icon" className="icon-social" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
