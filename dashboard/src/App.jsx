// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Login from "./pages/LoginAdmin/LoginAdmin";
import AddNewDoctor from "./pages/AddNewDoctor/AddNewDoctor.jsx";
import Messages from "./pages/Message/Messages.jsx";
import Doctors from "./pages/Doctor/Doctors.jsx";
import Service from "./pages/ServiceManager/Service"
import ServiceCategory from "./pages/ServiceCateManager/ServiceCate"
import AddNewServiceCategory from "./pages/AddNewServiceCategory.jsx"
import Report from "./pages/Report/report.jsx";

import { Context } from "./main";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddNewAdmin from "./pages/AddNewAdmin";
const App = () => {
  const { isAuthenticated, setIsAuthenticated, setAdmin } =
    useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/admin/me",
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(true);
        setAdmin(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setAdmin({});
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctors/addnew" element={<AddNewDoctor />} />
        <Route path="/admin/addnew" element={<AddNewAdmin />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/services" element={<Service />} />
        <Route path="/servicecategory" element={<ServiceCategory />} />
        <Route path="/addnewservicecategory" element={<AddNewServiceCategory />} />
        <Route path="/report" element={<Report />} />
      </Routes>
      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;
