import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Context } from "../main.jsx";

const PatientRecords = () => {
  const [records, setRecords] = useState([]);
  const { user } = useContext(Context);
  const userId = user._id;
  useEffect(() => {
    // Gọi API để lấy danh sách hồ sơ bệnh án
    const fetchRecords = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/v1/patient/getpatientrecord/${userId}`
        );
        setRecords(data.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error.message);
      }
    };

    fetchRecords();
  }, [userId]);

  return (
    <div>
      <h1>Danh sách hồ sơ bệnh án</h1>
      {records.length > 0 ? (
        <ul>
          {records.map((record) => (
            <li key={record._id}>
              <p>Bác sĩ: {record.appointmentId.doctor.name}</p>
              <p>Mã hồ sơ: {record.invoiceCode} </p>
              <p>Ngày hẹn: {record.appointment_date}</p>
              <p>Thời gian hẹn: {record.appointment_time}</p>
              <p>Trạng thái: {record.status}</p>
              <p>Dịch vụ:</p>
              <ul>
                {record.services.map((service) => (
                  <li key={service._id}>
                    <p>- {service.serviceId.serviceName}</p>
                    <p>Giá: {service.servicePrice} VND</p>
                    <p>Số lượng: {service.quantity}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có hồ sơ bệnh án nào.</p>
      )}
    </div>
  );
};

export default PatientRecords;
