// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Context } from "../main"; // Đảm bảo import đúng context
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Home = () => {
  const { isAuthenticated } = useContext(Context);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Khởi tạo navigate
  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/v1/appointment/doctorupdate/${appointmentId}`,
        { status: newStatus },
        { withCredentials: true }
      );

      // Cập nhật trạng thái trong danh sách cuộc hẹn mà không cần reload trang
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );
      toast.success(response.data.message); // Hiển thị thông báo thành công
      location.reload();
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Cập nhật trạng thái thất bại.");
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/appointment/getpendingappointments",
          { withCredentials: true }
        );
        setAppointments(response.data.appointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchAppointments();
    }
  }, [isAuthenticated]);
  // Hàm để chuyển hướng đến trang chi tiết cuộc hẹn
  const handleViewDetails = (appointmentId) => {
    navigate(`/appointmentdetail/${appointmentId}`); // Sử dụng navigate để chuyển trang
  };
  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Danh sách cuộc hẹn</h1>
      {appointments.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{`${appointment.name}`}</td>
                <td>{appointment.appointment_date}</td>
                <td>{appointment.appointment_time}</td>
                <td>
                  {appointment.status === "Chờ duyệt" ? (
                    <select
                      className={
                        appointment.status === "Chờ duyệt"
                          ? "Chờ duyệt"
                          : appointment.status === "Đã xác nhận"
                          ? "Xác nhận"
                          : "Từ chối"
                      }
                      value={appointment.status}
                      onChange={(e) =>
                        handleUpdateStatus(appointment._id, e.target.value)
                      }
                    >
                      <option value="Chờ duyệt" className="value-pending">
                        Chờ xác nhận
                      </option>
                      <option value="Đã xác nhận" className="value-accepted">
                        Xác nhận
                      </option>
                      <option value="Đã từ chối" className="value-rejected">
                        Từ chối
                      </option>
                    </select>
                  ) : (
                    <span
                      className={
                        appointment.status === "Đã xác nhận"
                          ? "value-accepted"
                          : "value-rejected"
                      }
                    >
                      {appointment.status}
                    </span>
                  )}
                </td>
                <td>
                  <button onClick={() => handleViewDetails(appointment._id)}>
                    Xem Chi Tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Danh sách lịch hẹn trống</p>
      )}
    </div>
  );
};

export default Home;
