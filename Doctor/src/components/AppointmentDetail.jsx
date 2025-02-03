import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AppointmentDetails = () => {
    const { id: appointmentId } = useParams(); 
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:4000/api/v1/appointment/getappointment/${appointmentId}`, {
          withCredentials: true,
        });
        setAppointment(data.appointment);
      } catch (err) {
        setError("Error loading appointment details.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointmentDetails();
  }, [appointmentId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  const handleUpdateStatus = async (newStatus) => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/appointment/doctorupdate/${appointmentId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      setAppointment((prev) => ({ ...prev, status: newStatus }));
      console.log(data.message)
      toast.success(data.message);
      navigate("/home")
    } catch (error) {
        console.error("Lỗi khi update", error);
        toast.error("Failed to update appointment status.");
    }
  };
  return (
    <div>
        <h2>Appointment Details</h2>
        <p><strong>Patient:</strong> {appointment.name}</p>
        <p><strong>Email:</strong> {appointment.email}</p>
        <p><strong>Phone:</strong> {appointment.phone}</p>
        <p><strong>Date of Birth:</strong> {appointment.dob}</p>
        <p><strong>Gender:</strong> {appointment.gender}</p>
        <p><strong>Appointment Date:</strong> {appointment.appointment_date}</p>
        <p><strong>Appointment Time:</strong> {appointment.appointment_time}</p>
        <p><strong>Address:</strong> {appointment.address}</p>
        <p><strong>Status:</strong> {appointment.status}</p>

        <h3>Service Types</h3>
        {appointment.services && appointment.services.length > 0 ? (
          <ul>
              {appointment.services.map((service, index) => (
                  <li key={index}>
                      <strong>Type Name:</strong> {service.serviceTypeId?.serviceCateName || "N/A"}
                  </li>
              ))}
          </ul>
        ) : (
          <p>No service types available.</p>
        )}

        <h3>Services</h3>
        {appointment.services && appointment.services.length > 0 ? (
          <ul>
              {appointment.services.map((service, index) => (
                  <li key={index}>
                      <strong>Service Name:</strong> {service.serviceId?.serviceName || "N/A"} - 
                      <strong> Price:</strong> {service.serviceId?.servicePrice || "N/A"}
                  </li>
              ))}
          </ul>
        ) : (
          <p>No services available.</p>
        )}


        <button
            onClick={() => handleUpdateStatus("Accepted")}
            disabled={appointment.status !== "Pending"}
        >
            Accept
        </button>
        <button
            onClick={() => handleUpdateStatus("Rejected")}
            disabled={appointment.status !== "Pending"}
        >
            Reject
        </button>
    </div>
);
};


export default AppointmentDetails;
