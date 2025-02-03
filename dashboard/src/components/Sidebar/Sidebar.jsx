import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";
import {
  FaThLarge,
  FaUserMd,
  FaUserShield,
  FaClipboardList,
  FaTooth,
  FaInbox,
  FaSignOutAlt,
} from "react-icons/fa"; // Import các icon
import { NavLink } from "react-router-dom"; // Import NavLink từ react-router-dom
import "./Sidebar.css";
import logo from "../../asset/images/logo_admin.png";

const Sidebar = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const handleLogout = async () => {
    await axios
      .get("http://localhost:4000/api/v1/user/admin/logout", {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const navigateTo = useNavigate();
  return (
    <div className="sidebar">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <ul className="menu">
        <li className="menu-item">
          <NavLink
            to="/" // Đường dẫn đến Trang chủ
            className={({ isActive }) =>
              isActive ? "menu-link active" : "menu-link"
            }
          >
            <FaThLarge className="icon" />
            <span>Trang chủ</span>
          </NavLink>
        </li>
        <li className="menu-item">
          <NavLink
            to="/doctors" // Đường dẫn đến Bác sĩ
            className={({ isActive }) =>
              isActive ? "menu-link active" : "menu-link"
            }
          >
            <FaUserMd className="icon" />
            <span>Bác sĩ</span>
          </NavLink>
        </li>
        <li className="menu-item">
          <NavLink
            to="/admin/addnew" // Đường dẫn đến Quản trị viên
            className={({ isActive }) =>
              isActive ? "menu-link active" : "menu-link"
            }
          >
            <FaUserShield className="icon" />
            <span>Quản trị viên</span>
          </NavLink>
        </li>
        <li className="menu-item">
          <NavLink
            to="/servicecategory" // Đường dẫn đến Danh mục
            className={({ isActive }) =>
              isActive ? "menu-link active" : "menu-link"
            }
          >
            <FaClipboardList className="icon" />
            <span>Danh mục</span>
          </NavLink>
        </li>
        <li className="menu-item">
          <NavLink
            to="/services" // Đường dẫn đến Dịch vụ
            className={({ isActive }) =>
              isActive ? "menu-link active" : "menu-link"
            }
          >
            <FaTooth className="icon" />
            <span>Dịch vụ</span>
          </NavLink>
        </li>
        <li className="menu-item">
          <NavLink
            to="/messages" // Đường dẫn đến Hộp thư
            className={({ isActive }) =>
              isActive ? "menu-link active" : "menu-link"
            }
          >
            <FaInbox className="icon" />
            <span>Hộp thư</span>
          </NavLink>
        </li>
        <li className="menu-item" onClick={handleLogout}>
          <div className="menu-link">
            <FaSignOutAlt className="icon" />
            <span>Đăng xuất</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
