import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./AppoinmentForm.css";
//import { useNavigate } from "react-router-dom";
import { Context } from "../../main.jsx";

const AppointmentForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [serviceCates, setServiceCates] = useState([]);
  const [doctorName, setDoctorName] = useState("");
  const [bookedTimes, setBookedTimes] = useState([]);
  const [address, setAddress] = useState("");
  const [hasVisited, setHasVisited] = useState(false);
  const [appointmentTime, setAppointmentTime] = useState("");
  const [note, setNote] = useState("");

  //const navigate = useNavigate();
  const { isAuthenticated } = useContext(Context); // Lấy user từ context

  const [doctors, setDoctors] = useState([]);
  const [serviceSelections, setServiceSelections] = useState([
    { serviceTypeId: "", services: [], serviceId: "" },
  ]);
  const [prevAppointmentDate, setPrevAppointmentDate] = useState(null);
  const [prevDoctorName, setPrevDoctorName] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const workingHours = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
  ];

  const getFilteredWorkingHours = () => {
    const today = new Date().toISOString().split("T")[0];
    const currentTime = new Date();

    // Lọc giờ làm việc trong ngày hôm nay
    let availableHours = workingHours.filter((time) => {
      if (appointmentDate === today) {
        const [hour, minute] = time.split(":");
        const timeDate = new Date();
        timeDate.setHours(parseInt(hour), parseInt(minute), 0, 0);
        return timeDate >= currentTime;
      }
      return true;
    });

    // Loại bỏ các giờ đã được đặt
    return availableHours.filter((time) => !bookedTimes.includes(time));
  };
  // Gọi API để lấy giờ đã đặt
  useEffect(() => {
    const fetchBookedTimes = async () => {
      if (
        appointmentDate &&
        doctorName &&
        (appointmentDate !== prevAppointmentDate ||
          doctorName !== prevDoctorName)
      ) {
        try {
          const { data } = await axios.get(
            "http://localhost:4000/api/v1/appointment/getbookedtime",
            {
              params: {
                doctorId: doctorName,
                appointment_date: appointmentDate,
              },
            }
          );
          console.log(data.bookedTimes);
          setBookedTimes(data.bookedTimes || []);
          setPrevDoctorName(doctorName);
          setPrevAppointmentDate(appointmentDate);
        } catch (error) {
          console.error("Lỗi khi lấy giờ đã đặt:", error);
          setBookedTimes([]);
        }
      }
    };

    fetchBookedTimes();
  }, [appointmentDate, doctorName]);
  useEffect(() => {
    const fetchServiceCates = async () => {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/service/getallservicecate"
      );
      setServiceCates(data.data);
    };

    const fetchDoctors = async () => {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/user/doctors",
        { withCredentials: true }
      );
      setDoctors(data.doctors);
    };

    fetchServiceCates();
    fetchDoctors();
  }, []);

  const handleServiceTypeChange = async (index, serviceTypeId) => {
    const updatedSelections = [...serviceSelections];
    updatedSelections[index].serviceTypeId = serviceTypeId;
    updatedSelections[index].serviceId = ""; // Reset serviceId khi đổi serviceTypeId

    if (serviceTypeId) {
      const { data } = await axios.get(
        `http://localhost:4000/api/v1/service/getallservices/${serviceTypeId}`
      );
      updatedSelections[index].services = data.data;
    } else {
      updatedSelections[index].services = [];
    }

    setServiceSelections(updatedSelections);
  };

  const handleServiceChange = (index, serviceId) => {
    const updatedSelections = [...serviceSelections];
    updatedSelections[index].serviceId = serviceId;
    setServiceSelections(updatedSelections);
  };

  const addServiceSelection = () => {
    setServiceSelections([
      ...serviceSelections,
      { serviceTypeId: "", services: [], serviceId: "" },
    ]);
  };
  // Hàm xóa lựa chọn dịch vụ
  const removeServiceSelection = (index) => {
    const newSelections = serviceSelections.filter((_, i) => i !== index);
    setServiceSelections(newSelections);
  };
  const handleAppointment = async (e) => {
    e.preventDefault();
    setIsProcessing(true); // Bắt đầu loading

    // Kiểm tra trạng thái đăng nhập
    if (!isAuthenticated) {
      toast.error("Bạn cần đăng nhập để đặt lịch hẹn.");
      return;
    }
    // Kiểm tra dữ liệu nhập vào
    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !dob.trim() ||
      !gender.trim() ||
      !appointmentDate.trim() ||
      !appointmentTime.trim() ||
      !doctorName.trim() ||
      !address.trim()
    ) {
      toast.error(
        "Vui lòng điền đầy đủ thông tin và không để trống các trường!"
      );
      return;
    }

    // Kiểm tra email có hợp lệ không
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      toast.error("Email không hợp lệ!");
      return;
    }

    // Kiểm tra số điện thoại có hợp lệ không (Ví dụ: chỉ chấp nhận số điện thoại Việt Nam)
    const phonePattern = /^[0-9]{10,11}$/; // Có thể thay đổi cho phù hợp
    if (!phonePattern.test(phone)) {
      toast.error("Số điện thoại không hợp lệ!");
      return;
    }
    const services = serviceSelections.map((selection) => ({
      serviceTypeId: selection.serviceTypeId,
      serviceId: selection.serviceId,
    }));
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/appointment/post",
        {
          name,
          email,
          phone,
          dob,
          gender,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          services,
          doctorId: doctorName,
          hasVisited,
          address,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      setName("");
      setEmail("");
      setPhone("");
      setDob("");
      setGender("");
      setAppointmentDate("");
      setDoctorName("");
      setHasVisited(false);
      setAddress("");
      setAppointmentTime("");
      setServiceSelections([
        { serviceTypeId: "", services: [], serviceId: "" },
      ]);
    } catch (error) {
      console.log("Xảy ra lỗi: ", error);
      toast.error(error.response.data.message);
    } finally {
      setIsProcessing(false); // Kết thúc loading
    }
  };

  return (
    <div className="form-component-appointmentform">
      <h2 className="lato-bold">ĐĂNG KÝ LỊCH KHÁM</h2>
      <form onSubmit={handleAppointment}>
        <div>
          <input
            className="lato-regular"
            type="text"
            placeholder="Họ Tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <input
            className="lato-regular"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="lato-regular"
            type="number"
            placeholder="Số Điện Thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="form-row">
          <input
            className="lato-regular"
            type="date"
            placeholder="Ngày Sinh"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          <select
            className="lato-regular"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Chọn Giới Tính</option>
            <option value="Male">Nam</option>
            <option value="Female">Nữ</option>
          </select>
        </div>
        <div className="form-row">
          <input
            className="lato-regular"
            type="date"
            placeholder="Ngày Hẹn"
            value={appointmentDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setAppointmentDate(e.target.value)}
          />
          <select
            className="lato-regular"
            value={doctorName}
            onChange={(e) => {
              setDoctorName(e.target.value);
            }}
          >
            <option value="">Chọn Bác Sĩ</option>
            {doctors.map((doctor, index) => (
              <option value={doctor._id} key={index}>
                {doctor.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            className="lato-regular"
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            required
            disabled={!appointmentDate || !doctorName}
          >
            <option value="">Chọn Giờ Khám</option>
            {getFilteredWorkingHours().map((time, index) => (
              <option value={time} key={index}>
                {time}
              </option>
            ))}
          </select>
        </div>
        {serviceSelections.map((selection, index) => (
          <div key={index} className="form-row">
            <select
              className="service-select lato-regular"
              value={selection.serviceTypeId}
              onChange={(e) => handleServiceTypeChange(index, e.target.value)}
              required
            >
              <option value="">Chọn Loại Dịch Vụ</option>
              {serviceCates.map((type) => (
                <option value={type._id} key={type._id}>
                  {type.serviceCateName}
                </option>
              ))}
            </select>

            <select
              className={`service-select lato-regular ${
                serviceSelections.length > 1 ? "short" : ""
              }`}
              value={selection.serviceId}
              onChange={(e) => handleServiceChange(index, e.target.value)}
              required
              disabled={!selection.serviceTypeId}
            >
              <option value="">Chọn Dịch Vụ</option>
              {selection.services.map((service) => (
                <option value={service._id} key={service._id}>
                  {service.serviceName}
                </option>
              ))}
            </select>

            {/* Nút xóa chỉ hiển thị khi số lượng lựa chọn lớn hơn 1 */}
            {serviceSelections.length > 1 && (
              <button
                type="button"
                onClick={() => removeServiceSelection(index)}
                className="add-move"
              >
                -
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addServiceSelection}
          className="add-move"
        >
          +
        </button>
        <textarea
          className="lato-regular"
          rows="5"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Địa Chỉ"
        />
        <div>
          <input
            className="lato-regular"
            type="text"
            placeholder="Ghi chú"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <div className="hasvisited">
          <p className="hasvisited-appointment lato-regular">
            Bạn đã từng đến khám chưa?
          </p>
          <input
            type="checkbox"
            checked={hasVisited}
            onChange={(e) => setHasVisited(e.target.checked)}
            className="checkbox-appointment"
          />
        </div>
        <button
          type="submit"
          className="button-dkikham lato-bold"
          disabled={isProcessing}
        >
          {isProcessing ? "Đang xử lý..." : "ĐẶT LỊCH"}
        </button>{" "}
      </form>
    </div>
  );
};

export default AppointmentForm;
