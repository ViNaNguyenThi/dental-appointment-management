// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from "react";
import { TiHome } from "react-icons/ti";
import { RiLogoutBoxFill, RiCalendarCheckFill } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import { FiLogIn } from "react-icons/fi";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
const Sidebar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await axios
      .get("http://localhost:4000/api/v1/user/doctor/logout", {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(false);
        navigate("/login");
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response.data.message);
      });
  };

  const navigateToPage = (path) => {
    navigate(path);
    setShow(false);
  };

  return (
    <>
      <nav
        style={!isAuthenticated ? { display: "none" } : { display: "flex" }}
        className={show ? "show sidebar" : "sidebar"}
      >
        <div className="links">
          <TiHome onClick={() => navigateToPage("/")} title="Home" />
          <FiLogIn onClick={() => navigateToPage("/login")} title="Login" />
          <RiCalendarCheckFill
            onClick={() => navigateToPage("/accepted-appointments")}
            title="Accepted Appointments"
          />
          <RiCalendarCheckFill
            onClick={() => navigateToPage("/doctor/getfollowupappointment")}
            title="Lịch tái khám"
          />
          <RiLogoutBoxFill onClick={handleLogout} title="Logout" />
        </div>
      </nav>
      <div
        className="wrapper"
        style={!isAuthenticated ? { display: "none" } : { display: "flex" }}
      >
        <GiHamburgerMenu className="hamburger" onClick={() => setShow(!show)} />
      </div>
    </>
  );
};

export default Sidebar;
