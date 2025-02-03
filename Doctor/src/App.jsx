// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/Login.jsx";
import Home from "./components/Home.jsx";
import AcceptedAppointment from "./components/AcceptedAppointment.jsx";
import AcceptedAppointmentDetails from "./components/DetailAcceptedAppointment.jsx";
import CreatePatientRecord from "./components/CreatePatientRecord.jsx";
import AppointmentDetails from "./components/AppointmentDetail.jsx";
import CreateFollowUpAppointment from "./components/CreateFollowUpAppointment.jsx";
import FollowUpAppointments from "./components/FollowUpAppointments.jsx";
import DetailFollowUpAppointment from "./components/DetailFollowUpAppointment.jsx";
import Sidebar from "./components/Sidebar.jsx"; // Import Sidebar
import { Context } from "./main";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

function App() {
  const { isAuthenticated, setIsAuthenticated, setDoctor } =
    useContext(Context);
  // Fetch thông tin user khi ứng dụng khởi động
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/doctor/me",
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        setDoctor(response.data.user);
      } catch (error) {
        toast.error("Bác sĩ chưa đăng nhập", error);
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && <Sidebar />} {/* Render Sidebar khi đăng nhập */}
        <div className="content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={isAuthenticated ? <Home /> : <Login />} />
            <Route
              path="/accepted-appointments"
              element={<AcceptedAppointment />}
            />
            <Route
              path="/appointmentdetail/:id"
              element={<AppointmentDetails />}
            />
            <Route
              path="/acceptedappointmentdetails/:id"
              element={<AcceptedAppointmentDetails />}
            />
            <Route
              path="/create-patient-record/:appointmentId"
              element={<CreatePatientRecord />}
            />
           
            <Route
              path="/doctor/getfollowupappointment"
              element={<FollowUpAppointments />}
            />
            <Route
              path="/doctor/detailfollowupappointment/:followUpAppointmentId"
              element={<DetailFollowUpAppointment />}
            />
            <Route
              path="/doctor/createpatientrecord/:followUpAppointmentId"
              element={<CreateFollowUpAppointment />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
