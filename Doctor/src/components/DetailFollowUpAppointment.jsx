import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DetailFollowUpAppointment = () => {
  const { followUpAppointmentId } = useParams(); // Lấy ID từ URL
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch dữ liệu chi tiết lịch hẹn
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/followupappointment/detailfollowupappointment/${followUpAppointmentId}`,
          { withCredentials: true }
        );
        setAppointmentDetails(response.data.data);
      } catch (error) {
        console.error("Error fetching appointment details:", error);
        toast.error("Không thể lấy thông tin chi tiết lịch hẹn.");
      } finally {
        setLoading(false);
      }
    };

    if (followUpAppointmentId) {
      fetchDetails();
    }
  }, [followUpAppointmentId]);
  // Chuyển hướng đến trang tạo bệnh án
  const handleCreateRecord = (followUpAppointmentId) => {
    navigate(`/doctor/createpatientrecord/${followUpAppointmentId}`);
  };
  if (loading) return <p>Đang tải thông tin chi tiết...</p>;

  if (!appointmentDetails) return <p>Không tìm thấy thông tin lịch hẹn.</p>;

  // Dữ liệu từ API
  const { patientRecordId, followUpDate, status } = appointmentDetails;

  return (
    <div className="detail-follow-up">
      <h1>Chi tiết lịch hẹn tái khám</h1>
      <div className="details">
        <p>
          <strong>Mã hóa đơn:</strong>{" "}
          {patientRecordId?.invoiceCode || "Không có mã"}
        </p>
        <p>
          <strong>Tên bệnh nhân:</strong>{" "}
          {patientRecordId?.patientName || "Không có thông tin"}
        </p>
        <p>
          <strong>Số điện thoại:</strong>{" "}
          {patientRecordId?.phone || "Không có thông tin"}
        </p>
        <p>
          <strong>Email:</strong>{" "}
          {patientRecordId?.email || "Không có thông tin"}
        </p>
        <p>
          <strong>Ngày tái khám:</strong>{" "}
          {new Date(followUpDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Trạng thái:</strong> {status}
        </p>
        <p>
          <strong>Địa chỉ:</strong>{" "}
          {patientRecordId?.address || "Không có thông tin"}
        </p>

        <p>
          <strong>Mô tả:</strong>{" "}
          {patientRecordId?.description || "Không có mô tả"}
        </p>
        <h2>Dịch vụ đã chọn</h2>
        {patientRecordId?.services?.length > 0 ? (
          <ul>
            {patientRecordId.services.map((service, index) => (
              <li key={index}>
                <strong>Loại dịch vụ:</strong>{" "}
                {service.serviceTypeId.serviceCateName} <br />
                <strong>Dịch vụ:</strong> {service.serviceId.serviceName} <br />
                <strong>
                  Giá:
                </strong> {service.servicePrice.toLocaleString()} VNĐ <br />
                <strong>Số lượng:</strong> {service.quantity}
              </li>
            ))}
            <button onClick={() => handleCreateRecord(followUpAppointmentId)}>
              Tạo phiếu tái khám
            </button>
          </ul>
        ) : (
          <p>Không có dịch vụ nào.</p>
        )}
      </div>
    </div>
  );
};

export default DetailFollowUpAppointment;
