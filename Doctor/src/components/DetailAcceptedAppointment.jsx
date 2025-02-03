import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const AcceptedAppointmentDetails = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/appointment/getappointment/${id}`,
          { withCredentials: true }
        );
        setAppointment(response.data.appointment);
        toast.success("Dữ liệu đã được tải thành công!");
      } catch (err) {
        console.error("Error fetching appointment details:", err);
        setError("Không thể tải chi tiết cuộc hẹn.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [id]);

  if (loading) return <p>Đang tải chi tiết cuộc hẹn...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Chi tiết cuộc hẹn</h1>
      {appointment && (
        <div>
          <p>
            <strong>Họ tên:</strong> {appointment.name}
          </p>
          <p>
            <strong>Email:</strong> {appointment.email}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {appointment.phone}
          </p>
          <p>
            <strong>Ngày sinh:</strong>{" "}
            {new Date(appointment.dob).toLocaleDateString()}
          </p>
          <p>
            <strong>Giới tính:</strong> {appointment.gender}
          </p>
          <p>
            <strong>Ngày hẹn:</strong> {appointment.appointment_date}
          </p>
          <p>
            <strong>Giờ hẹn:</strong> {appointment.appointment_time}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {appointment.address}
          </p>
          <p>
            <strong>Trạng thái:</strong> {appointment.status}
          </p>
          <p>
            <strong>Bác sĩ:</strong> {appointment.doctor?.name}
          </p>

          <h3>Dịch vụ:</h3>
          {appointment.services?.length > 0 ? (
            <ul>
              {appointment.services.map((service, index) => (
                <li key={index}>
                  <p>
                    <strong>Loại dịch vụ:</strong>{" "}
                    {service.serviceTypeId?.serviceCateName || "N/A"}
                  </p>
                  <p>
                    <strong>Tên dịch vụ</strong>{" "}
                    {service.serviceId?.serviceName || "N/A"}
                  </p>
                  <p>
                    <strong>Giá dịch vụ:</strong>{" "}
                    {service.serviceId?.servicePrice || "N/A"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Không có dịch vụ nào.</p>
          )}

          <div>
            <Link to={`/create-patient-record/${appointment._id}`}>
              <button>Tạo Hóa Đơn</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcceptedAppointmentDetails;
