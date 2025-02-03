import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const CreateFollowUpAppointment = () => {
  const navigate = useNavigate();
  const { followUpAppointmentId } = useParams();
  const [patientInfo, setPatientInfo] = useState({
    invoiceCode: "",
    patientName: "",
    phone: "",
    appointment_date: "",
    appointment_time: "",
    address: "",
  });
  const [serviceCates, setServiceCates] = useState([]);
  const [serviceSelections, setServiceSelections] = useState([
    {
      serviceTypeId: "",
      services: [],
      serviceId: "",
      servicePrice: 0,
      quantity: 1,
    },
  ]);
  const [description, setDescription] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [followUpDate, setFollowUpDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Thêm trạng thái này để kiểm soát việc gửi

  useEffect(() => {
    // Fetch service categories
    const fetchServiceCates = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/service/getallservicecate"
        );
        setServiceCates(data.data);
      } catch (err) {
        console.error("Error fetching service categories:", err);
        toast.error("Failed to load service categories.");
      }
    };

    fetchServiceCates();
  }, []);

  const handleServiceTypeChange = async (index, serviceTypeId) => {
    const updatedSelections = [...serviceSelections];
    updatedSelections[index].serviceTypeId = serviceTypeId;
    updatedSelections[index].serviceId = "";
    updatedSelections[index].servicePrice = 0;

    if (serviceTypeId) {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/v1/service/getallservices/${serviceTypeId}`
        );
        updatedSelections[index].services = data.data;
      } catch (err) {
        console.error("Error fetching services:", err);
        toast.error("Failed to load services.");
      }
    } else {
      updatedSelections[index].services = [];
    }

    setServiceSelections(updatedSelections);
  };

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/v1/followupappointment/detailfollowupappointment/${followUpAppointmentId}`,
          { withCredentials: true }
        );
        const record = data.data.patientRecordId || {};
        setPatientInfo({
          invoiceCode: record.invoiceCode || "N/A",
          patientName: record.patientName || "N/A",
          phone: record.phone || "N/A",
          appointment_date: record.appointment_date || "N/A",
          appointment_time: record.appointment_time || "N/A",
          address: record.address || "N/A",
        });
        setDescription(data.data.description || "");
      } catch (err) {
        console.error("Có lỗi:", err);
        toast.error("Error loading appointment details.");
      }
    };

    if (followUpAppointmentId) {
      fetchAppointment();
    }
  }, [followUpAppointmentId]);

  const handleServiceChange = (index, serviceId) => {
    const updatedSelections = [...serviceSelections];
    const selectedService = updatedSelections[index].services.find(
      (service) => service._id === serviceId
    );
    updatedSelections[index].serviceId = serviceId;
    updatedSelections[index].servicePrice = selectedService
      ? selectedService.servicePrice
      : 0;
    setServiceSelections(updatedSelections);
    calculateTotalPrice(updatedSelections);
  };

  const handleQuantityChange = (index, delta) => {
    const updatedSelections = [...serviceSelections];
    updatedSelections[index].quantity = Math.max(
      1,
      updatedSelections[index].quantity + delta
    );
    setServiceSelections(updatedSelections);
    calculateTotalPrice(updatedSelections);
  };

  const addServiceSelection = () => {
    setServiceSelections([
      ...serviceSelections,
      {
        serviceTypeId: "",
        services: [],
        serviceId: "",
        servicePrice: 0,
        quantity: 1,
      },
    ]);
  };

  const removeServiceSelection = (index) => {
    const updatedSelections = [...serviceSelections];
    updatedSelections.splice(index, 1);
    setServiceSelections(updatedSelections);
    calculateTotalPrice(updatedSelections);
  };

  const calculateTotalPrice = (selections) => {
    const newTotalPrice = selections.reduce(
      (total, selection) => total + selection.servicePrice * selection.quantity,
      0
    );
    setTotalPrice(newTotalPrice);
  };

  const handleSaveAppointment = async () => {
    if (isSubmitting) return; // Ngăn việc nhấn nút nhiều lần
    setIsSubmitting(true); // Đặt trạng thái đang gửi
    if (serviceSelections.some((selection) => !selection.serviceId)) {
      toast.error("Vui lòng chọn đầy đủ dịch vụ.");
      return;
    }
    if (totalPrice <= 0) {
      toast.error("Tổng giá trị phải lớn hơn 0!");
      return;
    }

    const services = serviceSelections.map((selection) => ({
      serviceTypeId: selection.serviceTypeId,
      serviceId: selection.serviceId,
      servicePrice: selection.servicePrice,
      quantity: selection.quantity,
    }));
    console.log(totalPrice);
    try {
      const appointmentData = {
        followUpAppointmentId,
        services,
        totalPrice,
        description,
        followUpDate,
      };

      let response;
      // Kiểm tra nếu có followUpDate thì gọi POST, nếu không có thì gọi PUT
      if (followUpDate) {
        response = await axios.post(
          "http://localhost:4000/api/v1/followupappointment/checkoutfollowupappointment",
          appointmentData,
          { withCredentials: true }
        );
      } else {
        response = await axios.put(
          `http://localhost:4000/api/v1/followupappointment/checkoutfollowupappointment/${followUpAppointmentId}`,
          appointmentData,
          { withCredentials: true }
        );
      }

      toast.success(response.data.message);
      navigate("/doctor/getfollowupappointment");
    } catch (err) {
      console.error("Error saving follow-up appointment:", err);
      toast.error("Failed to create or update follow-up appointment.");
    }
  };

  return (
    <div>
      <h2>Tạo phiếu tái khám</h2>
      <h3>Thông tin khách hàng</h3>
      <p>
        <strong>Mã hồ sơ:</strong> {patientInfo.invoiceCode}
      </p>
      <p>
        <strong>Tên:</strong> {patientInfo.patientName}
      </p>
      <p>
        <strong>Số điện thoại:</strong> {patientInfo.phone}
      </p>
      <p>
        <strong>Ngày đã khám:</strong> {patientInfo.appointment_date}
      </p>
      <p>
        <strong>Địa chỉ:</strong> {patientInfo.address}
      </p>
      {serviceSelections.map((selection, index) => (
        <div key={index}>
          <label>Service Type:</label>
          <select
            value={selection.serviceTypeId}
            onChange={(e) => handleServiceTypeChange(index, e.target.value)}
          >
            <option value="">Select Service Type</option>
            {serviceCates.map((cate) => (
              <option key={cate._id} value={cate._id}>
                {cate.serviceCateName}
              </option>
            ))}
          </select>

          <label>Service:</label>
          <select
            value={selection.serviceId}
            onChange={(e) => handleServiceChange(index, e.target.value)}
            disabled={!selection.serviceTypeId}
          >
            <option value="">Select Service</option>
            {selection.services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.serviceName}
              </option>
            ))}
          </select>

          <div>
            <label>Price:</label>
            <span>
              {selection.servicePrice > 0
                ? `${selection.servicePrice} VND`
                : "-"}
            </span>
          </div>

          <div>
            {/* Đặt disabled nếu chưa chọn serviceTypeId */}
            <label>Quantity:</label>
            <button
              onClick={() => handleQuantityChange(index, -1)}
              disabled={!selection.serviceTypeId || selection.quantity <= 0}
            >
              -
            </button>
            <span>{selection.quantity}</span>
            <button
              onClick={() => handleQuantityChange(index, 1)}
              disabled={!selection.serviceTypeId}
            >
              +
            </button>
          </div>

          <button
            onClick={() => removeServiceSelection(index)}
            disabled={serviceSelections.length === 1}
          >
            Xóa dịch vụ
          </button>
        </div>
      ))}
      <button onClick={addServiceSelection}>Add Another Service</button>
      <div>
        <label>Mô tả</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label>Tổng tiền</label>
        <span>{totalPrice > 0 ? `${totalPrice} VND` : "-"}</span>
      </div>
      <div>
        <label>Lịch tái khám</label>
        <input
          type="date"
          value={followUpDate}
          onChange={(e) => setFollowUpDate(e.target.value)}
        />
      </div>
      <button onClick={handleSaveAppointment} disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Save Appointment"}
      </button>{" "}
    </div>
  );
};

export default CreateFollowUpAppointment;
