/* eslint-disable react-hooks/rules-of-hooks */
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Context } from "../../main";
import { Navigate } from "react-router-dom";
import {
  FaToggleOn,
  FaToggleOff,
  FaPen,
  FaTrash,
  FaPlus,
} from "react-icons/fa";
import "../../App.css";

const Service = () => {
  const [services, setServices] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    serviceName: "",
    servicePrice: "",
    serviceType: "",
  });
  const [serviceTypes, setServiceTypes] = useState([]); // State lưu các loại dịch vụ
  const [selectedService, setSelectedService] = useState(null); // Lưu thông tin dịch vụ đang chỉnh sửa hoặc xóa
  // eslint-disable-next-line no-unused-vars
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading

  // Gọi API để lấy danh sách dịch vụ
  const fetchServices = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/service/getallservices"
      );
      setServices(data.data);
    } catch (error) {
      console.error(error);
      toast.error("Không thể lấy danh sách dịch vụ");
    }
  };

  // Gọi API để lấy danh sách loại dịch vụ
  const fetchServiceTypes = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/service/getallservicecate"
      ); // API này trả về danh sách loại dịch vụ
      setServiceTypes(data.data);
    } catch (error) {
      console.error(error);
      toast.error("Không thể lấy danh sách loại dịch vụ");
    }
  };

  // Hàm thêm mới dịch vụ
  const handleAddService = async () => {
    setIsLoading(true); // Bật trạng thái loading
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/service/createservice",
        serviceForm,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(data.message);
      setShowAddModal(false);
      fetchServices(); // Lấy lại danh sách dịch vụ sau khi thêm
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Không thể tạo dịch vụ");
    } finally {
      setIsLoading(false); // Tắt trạng thái loading
    }
  };

  // Hàm sửa dịch vụ
  const handleEditService = async () => {
    setIsLoading(true);

    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/service/updateservice/${selectedService._id}`,
        serviceForm,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(data.message);
      setShowEditModal(false);
      fetchServices(); // Lấy lại danh sách dịch vụ sau khi sửa
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Không thể chỉnh sửa dịch vụ"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xóa dịch vụ
  const handleDeleteService = async () => {
    setIsLoading(true);

    try {
      const { data } = await axios.delete(
        `http://localhost:4000/api/v1/service/deleteservice/${selectedService._id}`,
        {
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setShowDeleteModal(false);
      fetchServices(); // Lấy lại danh sách dịch vụ sau khi xóa
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Không thể xóa dịch vụ");
    } finally {
      setIsLoading(false);
    }
  };

  // Kiểm tra trạng thái đăng nhập
  if (!isAuthenticated) {
    toast.info("Chưa đăng nhập");
    return <Navigate to={"/login"} />;
  }

  // Gọi fetchServices và fetchServiceTypes ngay khi component được mount
  useEffect(() => {
    fetchServices();
    fetchServiceTypes();
  }, []);

  const handleOpenAddModal = () => {
    setServiceForm({ serviceName: "", servicePrice: "", serviceType: "" });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (service) => {
    setSelectedService(service);
    setServiceForm({
      serviceName: service.serviceName,
      servicePrice: service.servicePrice,
      serviceType: service.serviceType._id,
    });
    setShowEditModal(true);
  };

  const handleOpenDeleteModal = (service) => {
    setSelectedService(service);
    setShowDeleteModal(true);
  };

  const toggleStatus = async (id) => {
    setIsLoading(true);

    try {
      const { data } = await axios.patch(
        `http://localhost:4000/api/v1/service/updateactiveservice/${id}`,
        {},
        {
          withCredentials: true,
        }
      );
      toast.success(data.message);
      fetchServices(); // Lấy lại danh sách dịch vụ sau khi đổi trạng thái
    } catch (error) {
      console.error(error);
      toast.error("Không thể thay đổi trạng thái");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Danh Sách Dịch Vụ</h2>
      <button onClick={handleOpenAddModal} style={{ marginBottom: "20px" }}>
        <FaPlus /> Thêm Dịch Vụ
      </button>
      {services.length === 0 ? (
        <p>Không có dịch vụ nào để hiển thị</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          cellSpacing="0"
          style={{ width: "100%", textAlign: "left" }}
        >
          <thead>
            <tr>
              <th>Tên Dịch Vụ</th>
              <th>Giá Dịch Vụ (VND)</th>
              <th>Loại Dịch Vụ</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service._id}>
                <td>{service.serviceName}</td>
                <td>{service.servicePrice.toLocaleString()} VND</td>
                <td>
                  {service.serviceType?.serviceCateName || "Không xác định"}
                </td>
                <td>
                  {service.isActive ? (
                    <span style={{ color: "green" }}>Hoạt động</span>
                  ) : (
                    <span style={{ color: "red" }}>Ngừng hoạt động</span>
                  )}
                </td>
                <td>
                  <button onClick={() => handleOpenEditModal(service)}>
                    <FaPen />
                  </button>
                  <button onClick={() => handleOpenDeleteModal(service)}>
                    <FaTrash />
                  </button>
                  <button
                    disabled={isLoading}
                    onClick={() => toggleStatus(service._id)}
                  >
                    {isLoading ? (
                      "Đang xử lý..."
                    ) : service.isActive ? (
                      <FaToggleOn
                        style={{ color: "green", fontSize: "24px" }}
                      />
                    ) : (
                      <FaToggleOff style={{ color: "red", fontSize: "24px" }} />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal Thêm Dịch Vụ */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Thêm Dịch Vụ</h3>
            <label>Tên Dịch Vụ:</label>
            <input
              type="text"
              value={serviceForm.serviceName}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, serviceName: e.target.value })
              }
            />
            <label>Giá Dịch Vụ:</label>
            <input
              type="number"
              value={serviceForm.servicePrice}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, servicePrice: e.target.value })
              }
            />
            <label>Loại Dịch Vụ:</label>
            <select
              value={serviceForm.serviceType}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, serviceType: e.target.value })
              }
            >
              <option value="">Chọn Loại Dịch Vụ</option>
              {serviceTypes.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.serviceCateName}
                </option>
              ))}
            </select>
            <button disabled={isLoading} onClick={handleAddService}>
              {isLoading ? "Đang thêm..." : "Thêm"}
            </button>
            <button onClick={() => setShowAddModal(false)}>Đóng</button>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa dịch vụ */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Sửa Dịch Vụ</h3>
            <label>Tên Dịch Vụ:</label>
            <input
              type="text"
              value={serviceForm.serviceName}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, serviceName: e.target.value })
              }
            />
            <label>Giá Dịch Vụ:</label>
            <input
              type="number"
              value={serviceForm.servicePrice}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, servicePrice: e.target.value })
              }
            />
            <label>Loại Dịch Vụ:</label>
            <select
              value={serviceForm.serviceType}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, serviceType: e.target.value })
              }
            >
              <option value="">Chọn Loại Dịch Vụ</option>
              {serviceTypes.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.serviceCateName}
                </option>
              ))}
            </select>
            <button disabled={isLoading} onClick={handleEditService}>
              {" "}
              {isLoading ? "Đang cập nhật..." : "Cập nhật"}
            </button>
            <button onClick={() => setShowEditModal(false)}>Đóng</button>
          </div>
        </div>
      )}

      {/* Modal Xóa Dịch Vụ */}
      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Bạn có chắc muốn xóa dịch vụ này?</h3>
            <button disabled={isLoading} onClick={handleDeleteService}>
              {" "}
              {isLoading ? "Đang xóa..." : "Xóa"}
            </button>
            <button onClick={() => setShowDeleteModal(false)}>Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Service;
