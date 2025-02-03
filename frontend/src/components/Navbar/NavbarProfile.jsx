// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import "./NavbarProfile.css";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; // Import thêm icon FaTimes

const NavbarProfile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="navbar-profile">
      {/* Thay đổi icon khi menu mở/đóng */}
      <div className="menu-icon" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Danh sách liên kết */}
      <ul className={isOpen ? "open" : ""}>
        <li>
          <NavLink to="/userprofile" activeClassName="active">
            Tài khoản
          </NavLink>
        </li>
        <li>
          <NavLink to="/" activeClassName="active" exact>
            Lịch khám
          </NavLink>
        </li>
        <li>
          <NavLink to="/user/getpatientrecord" activeClassName="active">
            Hồ sơ bệnh nhân
          </NavLink>
        </li>
      </ul>
    </div>
  );
};
export default NavbarProfile;
