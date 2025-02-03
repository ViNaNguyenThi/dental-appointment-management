// eslint-disable-next-line no-unused-vars
import React, { useState, useContext } from "react";
import { assets } from "../../assets/assets.js"; // Ensure this path is correct and points to the renamed assets.js
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import axios from "axios"; // Nhớ import axios
import { Context } from "../../main.jsx";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context); // Lấy user từ context
  const [showDropdown, setShowDropdown] = useState(false);
  const toggleDropdown1 = () => setShowDropdown((prevState) => !prevState);
  const menuItems = [
    { to: "/appointment", label: "Đặt khám" },
    {
      to: "",
      label: "Giới thiệu",
      dropdownItems: [
        { to: "/aboutus", label: "Lịch sử" },
        { to: "/aboutdoctor", label: "Đội ngũ" },
      ],
    },
    { to: "/services", label: "Dịch vụ" },
    { to: "/price", label: "Bảng giá" },
    { to: "/contactus", label: "Liên hệ" },
  ];
  const handleLogout = async () => {
    await axios
      .get("http://localhost:4000/api/v1/user/patient/logout", {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(false);
        setUser({});
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const navigateTo = useNavigate();

  const goToLogin = () => {
    navigateTo("/login");
  };
  return (
    <div id="root">
      <nav className="navbar">
        <div className="itemsnav">
          <div className="menu-toggle">
            <button onClick={() => setIsOpen(!isOpen)} className="btn-menu">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>

          <NavLink to="/">
            <img src={assets.logo} alt="logo" className="logo" />
          </NavLink>
          <ul className={`menu ${isOpen ? "open" : ""}`}>
            {menuItems.map((item) =>
              item.dropdownItems ? (
                <li
                  key={item.to}
                  className={`menu-item dropdown ${
                    isDropdownHovered ? "hovered" : ""
                  }`}
                  onClick={() => setIsDropdownHovered(!isDropdownHovered)}
                  onMouseEnter={() => setIsDropdownHovered(true)}
                  onMouseLeave={() => setIsDropdownHovered(false)}
                >
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      isActive ? "text-primary" : "text-regular"
                    }
                  >
                    <h3
                      className={`lato-regular text-menu-about ${
                        isDropdownHovered ? "text-primary" : "text-regular"
                      }`}
                    >
                      {item.label}
                      <img
                        src={isDropdownHovered ? assets.up : assets.down}
                        alt="Dropdown Icon"
                        className="dropdown-icon"
                      />
                    </h3>
                  </NavLink>
                  {isDropdownHovered && (
                    <ul className="dropdown-menu lato-regular">
                      {item.dropdownItems.map((dropdownItem) => (
                        <li key={dropdownItem.to}>
                          <NavLink
                            to={dropdownItem.to}
                            className={({ isActive }) =>
                              isActive ? "text-primary" : "text-regular"
                            }
                          >
                            {dropdownItem.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ? "text-primary" : "text-regular"
                  }
                >
                  <h3 className="menu-item lato-regular">{item.label}</h3>
                </NavLink>
              )
            )}

            {isAuthenticated ? (
              <div className="user-menu">
                <div className="btn-user" onClick={toggleDropdown1}>
                  <img src={assets.userIcon} alt="User Icon" width="28" />
                </div>
                {showDropdown && (
                  <div
                    className="dropdown-user"
                    onMouseLeave={() => setShowDropdown(false)} // Đóng khi rời chuột khỏi dropdown
                  >
                    <Link to="/userprofile" className="lato-regular">
                      Tài khoản
                    </Link>
                    <Link to="/historyappointment" className="lato-regular">
                      Lịch khám
                    </Link>
                    <Link to="/user/getpatientrecord" className="lato-regular">
                      Hồ sơ bệnh nhân
                    </Link>
                    <button onClick={handleLogout} className="lato-regular">
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="btnLogin lato-regular"
                onClick={goToLogin}
              >
                Đăng nhập
              </Link>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
