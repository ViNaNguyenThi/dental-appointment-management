import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Context } from "../main";
import { toast } from "react-toastify";

const AcceptedAppointments = () => {
  const { isAuthenticated } = useContext(Context);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null); // Theo dõi ID cuộc hẹn đang được cập nhật
  const handleUpdateStatus = async (appointmentId, newStatus) => {
    setUpdating(appointmentId); // Đánh dấu cuộc hẹn đang xử lý
    try {
      const response = await axios.put(
        `http://localhost:4000/api/v1/appointment/doctorupdate/${appointmentId}`,
        { status: newStatus },
        { withCredentials: true }
      );

      // Cập nhật trạng thái trong danh sách appointments
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );

      toast.success(response.data.message); // Hiển thị thông báo thành công
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Cập nhật trạng thái thất bại."); // Thông báo lỗi
    } finally {
      setUpdating(null); // Hoàn thành xử lý
    }
  };

  useEffect(() => {
    const fetchAcceptedAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/appointment/getacceptedappointments",
          { withCredentials: true }
        );

        // Lấy danh sách cuộc hẹn và sắp xếp
        const sortedAppointments = response.data.appointments.sort((a, b) => {
          const today = new Date().toISOString().split("T")[0]; // Ngày hôm nay dạng YYYY-MM-DD

          // Ưu tiên ngày hôm nay
          if (a.appointment_date === today && b.appointment_date !== today)
            return -1;
          if (a.appointment_date !== today && b.appointment_date === today)
            return 1;

          // Sắp xếp theo ngày
          if (a.appointment_date < b.appointment_date) return -1;
          if (a.appointment_date > b.appointment_date) return 1;

          // Nếu cùng ngày, sắp xếp theo giờ
          return a.appointment_time.localeCompare(b.appointment_time);
        });

        setAppointments(sortedAppointments);
        toast.success(response.data.message);
      } catch (error) {
        console.error("Error fetching accepted appointments:", error);
        setError("Failed to load accepted appointments.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchAcceptedAppointments();
    }
  }, [isAuthenticated]);

  if (loading) return <p>Loading accepted appointments...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Danh sách cuộc hẹn đã chấp nhận</h1>
      {appointments.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{`${appointment.name}`}</td>
                <td>{appointment.appointment_date}</td>
                <td>{appointment.appointment_time}</td>
                <td>
                  <select
                    className={
                      appointment.status === "Đã xác nhận"
                        ? "Xác nhận"
                        : appointment.status === "Đã từ chối"
                        ? "Từ chối"
                        : "Chờ duyệt"
                    }
                    disabled={updating === appointment._id} // Chỉ cho phép cập nhật nếu trạng thái không đang cập nhật
                    value={appointment.status}
                    onChange={(e) =>
                      handleUpdateStatus(appointment._id, e.target.value)
                    }
                  >
                    <option value="Đã xác nhận">Xác nhận</option>
                    <option value="Đã từ chối">Từ chối</option>
                  </select>
                </td>
                <td>
                  <Link to={`/acceptedappointmentdetails/${appointment._id}`}>
                    <button>Xem Chi Tiết</button>
                  </Link>
                </td>
                <td>
                  <Link to={`/create-patient-record/${appointment._id}`}>
                    <button>Tạo phiếu khám bệnh</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không có cuộc hẹn nào được chấp nhận.</p>
      )}
    </div>
  );
};

export default AcceptedAppointments;
