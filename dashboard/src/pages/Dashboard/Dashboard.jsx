// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import './Dashboard.css'
import Sidebar from "../../components/Sidebar/Sidebar";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0); // State để lưu số lượng bác sĩ

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/appointment/getall",
          { withCredentials: true }
        );
        setAppointments(data.appointments);
      } catch (error) {
        setAppointments([]);
      }
    };
    const fetchTotalAppointments = async () => {
      try {
        // Gọi API đếm tổng số lượng appointments
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/appointment/count",
          { withCredentials: true }
        );
        setTotalAppointments(data.totalAppointments);
      } catch (error) {
        setTotalAppointments(0);
      }
    };
    const fetchTotalDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/doctors/count", // Gọi API đếm số bác sĩ
          { withCredentials: true }
        );
        setTotalDoctors(data.totalDoctors);
      } catch (error) {
        setTotalDoctors(0);
      }
    };
    fetchAppointments();
    fetchTotalAppointments();
    fetchTotalDoctors();
  }, []);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/appointment/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const { isAuthenticated, admin } = useContext(Context);
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="body-container">
      <Sidebar />
      <div className="body-content">
        <section className="dashboard page">
          <div className="banner">
            <div className="firstBox">
              <img src="/doc.png" alt="docImg" />
              <div className="content">
                <div>
                  <p>Chào mừng bạn đã quay trở lại,</p>
                  <h5>
                    {admin &&
                      `${admin.name}`}{" "}
                  </h5>
                </div>
              </div>
            </div>
            <div className="secondBox">
              <span>{totalAppointments}</span>
              <p>Số lượng đặt hẹn</p>
            </div>
            <div className="thirdBox">
              <span>{totalDoctors}</span>
              <p>Số lượng bác sĩ</p>
            </div>
          </div>
          <div className="banner">
            <h5>Appointments</h5>
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Doctor</th>
                  <th>Status</th>
                  <th>Visited</th>
                </tr>
              </thead>
              <tbody>
                {appointments && appointments.length > 0
                  ? appointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{`${appointment.name}`}</td>
                      <td>{appointment.appointment_date.substring(0, 16)}</td>
                      <td>{`${appointment.doctor.name}`}</td>
                      <td>
                        {appointment.status === "Pending" ? (
                          <select
                            className={
                              appointment.status === "Pending"
                                ? "value-pending"
                                : appointment.status === "Accepted"
                                  ? "value-accepted"
                                  : "value-rejected"
                            }
                            value={appointment.status}
                            onChange={(e) =>
                              handleUpdateStatus(appointment._id, e.target.value)
                            }
                          >
                            <option value="Pending" className="value-pending">
                              Pending
                            </option>
                            <option value="Accepted" className="value-accepted">
                              Accepted
                            </option>
                            <option value="Rejected" className="value-rejected">
                              Rejected
                            </option>
                          </select>
                        ) : (
                          <span
                            className={
                              appointment.status === "Accepted"
                                ? "value-accepted"
                                : "value-rejected"
                            }
                          >
                            {appointment.status}
                          </span>
                        )}
                      </td>
                      <td>{appointment.hasVisited === true ? <GoCheckCircleFill className="green" /> : <AiFillCloseCircle className="red" />}</td>
                    </tr>
                  ))
                  : "No Appointments Found!"}
              </tbody>
            </table>

            { }
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
