import { useContext, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home.jsx";
import Appointment from "./Pages/Appointment";
import AboutUs from "./Pages/AboutUs/AboutUs.jsx";
import AboutDoctor from "./Pages/AboutUs/AboutDoctor.jsx";
import Register from "./Pages/Register/Register.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Context } from "./main";
import Login from "./Pages/Login/Login.jsx";
import PatientRecord from "./Pages/PatientRecord";

import ContactUs from "./Pages/ContactUs/ContactUs";
import UserProfile from "./Pages/Profile/UserProfile";

import ForgotPassword from "./Pages/Forgotpassword/ForgotPassword.jsx";
import ResetPassword from "./Pages/Forgotpassword/ResetPassword.jsx";
import ListDoctorDetail from "./Pages/ListDoctor/ListDoctorDetail.jsx"
import ListDoctor from "./Pages/ListDoctor/ListDoctor.jsx"
import ServiceCaterory from "./Pages/Services/ServiceCategory.jsx"
import DetailService from "./Pages/Services/DetailService.jsx"
import Price from "./Pages/Price/Price.jsx"
import AppointmentHistory from "./Pages/HistoryAppointment/HistoryAppointmentUser.jsx";

const App = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/patient/me",
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(true);
        setUser(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setUser({});
      }
    };
    fetchUser();
  }, [isAuthenticated, setIsAuthenticated, setUser]);

  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/aboutdoctor" element={<AboutDoctor />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user/getpatientrecord" element={<PatientRecord />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/doctordetail/:doctorId" element={<ListDoctorDetail />} />
        <Route path="/listdoctor" element={<ListDoctor />} />
        <Route path="/services" element={<ServiceCaterory />} />
        <Route path="/detailservice/:id" element={<DetailService />} />
        <Route path="/price" element={<Price />} />
        <Route path="/historyappointment" element={<AppointmentHistory />} />
      </Routes>
      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;
