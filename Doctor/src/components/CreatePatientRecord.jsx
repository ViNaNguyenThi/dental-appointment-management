import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const CreatePatientRecord = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [serviceCates, setServiceCates] = useState([]);
  const [serviceSelections, setServiceSelections] = useState([]);
  const [description, setDescription] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [followUpDate, setFollowUpDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/v1/appointment/getappointment/${appointmentId}`,
          { withCredentials: true }
        );
        setAppointment(data.appointment);

        // Khởi tạo serviceSelections từ appointment.services
        if (data.appointment && data.appointment.services) {
          const initialSelections = data.appointment.services.map(
            (service) => ({
              serviceTypeId: service.serviceTypeId._id || "",
              services: [],
              serviceId: service.serviceId._id || "",
              serviceName: service.serviceId.serviceName || "",
              servicePrice: service.serviceId.servicePrice || 0,
              quantity: service.quantity || 1,
            })
          );
          // Lấy tất cả serviceTypeId từ initialSelections để fetch services
          const servicePromises = initialSelections.map(
            async (selection, index) => {
              if (selection.serviceTypeId) {
                const { data } = await axios.get(
                  `http://localhost:4000/api/v1/service/getallservices/${selection.serviceTypeId}`
                );
                return { index, services: data.data };
              }
              return null;
            }
          );

          // Chờ tất cả các request hoàn thành và cập nhật initialSelections
          const resolvedServices = await Promise.all(servicePromises);
          resolvedServices.forEach((resolved) => {
            if (resolved) {
              initialSelections[resolved.index].services = resolved.services;
            }
          });
          setServiceSelections(initialSelections);
          calculateTotalPrice(initialSelections);
        }
      } catch (err) {
        console.error("Có lỗi:", err);
        toast.error("Error loading appointment details.");
      }
    };

    const fetchServiceCates = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/service/getallservicecate"
        );
        setServiceCates(data.data);
      } catch (err) {
        console.error("Có lỗi:", err);
        toast.error("Error loading service categories.");
      }
    };

    fetchAppointment();
    fetchServiceCates();
  }, [appointmentId]);

  const handleServiceTypeChange = async (index, serviceTypeId) => {
    const updatedSelections = [...serviceSelections];
    updatedSelections[index].serviceTypeId = serviceTypeId;
    updatedSelections[index].serviceId = "";
    updatedSelections[index].servicePrice = 0;
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

  const handleQuantityChange = (index, delta) => {
    const updatedSelections = [...serviceSelections];
    updatedSelections[index].quantity = Math.max(
      1,
      updatedSelections[index].quantity + delta
    );
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
  const minFollowUpDate = appointment
    ? new Date(
        new Date(appointment.appointment_date).getTime() + 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0]
    : "";

  const handleSaveRecord = async () => {
    if (isSubmitting) return; // Ngăn chặn gửi yêu cầu liên tiếp
    setIsSubmitting(true); // Đánh dấu đang gửi yêu cầu
    const services = serviceSelections.map((selection) => ({
      serviceTypeId: selection.serviceTypeId,
      serviceId: selection.serviceId,
      servicePrice: selection.servicePrice,
      quantity: selection.quantity,
    }));

    if (totalPrice <= 0) {
      toast.error("Total Price must be greater than 0!");
      return;
    }
    try {
      const recordData = {
        appointmentId,
        services,
        totalPrice,
        description,
        followUpDate,
        patientName: appointment ? appointment.patientName : null, // lấy patientName từ appointment
      };
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/patient/createpatientrecord",
        recordData,
        { withCredentials: true }
      );
      toast.success(data.message);
      setAppointment("");
      setServiceSelections("");
      setTotalPrice("");
      setDescription("");
      setFollowUpDate("");
      navigate("/accepted-appointments");
    } catch (error) {
      console.error("Có lỗi", error);
      toast.error("Failed to create patient record.");
    } finally {
      setIsSubmitting(false); // Reset trạng thái sau khi gửi xong
    }
  };

  return (
    <div>
      <h2>Create Patient Record</h2>
      {appointment && (
        <div>
          <h3>Patient Information</h3>
          <p>
            <strong>Name:</strong> {appointment.name}
          </p>
          <p>
            <strong>Email:</strong> {appointment.email}
          </p>
          <p>
            <strong>Phone:</strong> {appointment.phone}
          </p>
          <p>
            <strong>DOB:</strong>{" "}
            {new Date(appointment.dob).toLocaleDateString()}
          </p>
          <p>
            <strong>Gender:</strong> {appointment.gender}
          </p>
          <p>
            <strong>Appointment Date:</strong> {appointment.appointment_date}
          </p>
          <p>
            <strong>Appointment Time:</strong> {appointment.appointment_time}
          </p>
          <p>
            <strong>Address:</strong> {appointment.address}
          </p>
        </div>
      )}
      {serviceSelections.map((selection, index) => (
        <div key={index}>
          <label>Service Type:</label>
          <select
            value={selection.serviceTypeId}
            onChange={(e) => handleServiceTypeChange(index, e.target.value)}
          >
            <option value="">Select Service Type</option>
            {serviceCates.map((type) => (
              <option key={type._id} value={type._id}>
                {type.serviceCateName}
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
            <label>
              Price:{" "}
              {selection.servicePrice > 0
                ? `${selection.servicePrice} VND`
                : "-"}
            </label>
          </div>

          <div>
            <label>Quantity:</label>
            <button onClick={() => handleQuantityChange(index, -1)}>-</button>
            <span>{selection.quantity}</span>
            <button onClick={() => handleQuantityChange(index, 1)}>+</button>
          </div>

          <button
            type="button"
            onClick={() => removeServiceSelection(index)}
            disabled={serviceSelections.length === 1}
          >
            Remove Service
          </button>
        </div>
      ))}
      <button type="button" onClick={addServiceSelection}>
        Add Another Service
      </button>
      <div>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label>Total Price: {totalPrice > 0 ? `${totalPrice} VND` : "-"}</label>
      </div>
      <div>
        <label>Follow-up Date:</label>
        <input
          type="date"
          value={followUpDate}
          min={minFollowUpDate}
          onChange={(e) => setFollowUpDate(e.target.value)}
          required
        />
      </div>
      <button onClick={handleSaveRecord} disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Record"}
      </button>{" "}
    </div>
  );
};

export default CreatePatientRecord;
