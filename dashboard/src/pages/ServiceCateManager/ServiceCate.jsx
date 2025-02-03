import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Context } from "../../main";
import { Navigate } from "react-router-dom";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import Modal from "react-modal";
import "../../App.css";

const ServiceCategory = () => {
  const [serviceCateList, setServiceCateList] = useState([]);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // Loại modal: add, edit, delete
  const [selectedCategory, setSelectedCategory] = useState([]); // Dữ liệu dịch vụ được chọn
  const [newCategory, setNewCategory] = useState({
    serviceCateName: "",
    descriptionservice: "",
    serviceCateImage: [],
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Gọi API lấy danh sách dịch vụ
  const fetchServices = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/service/getallservicecate"
      );
      setServiceCateList(data.data);
    } catch (error) {
      console.error(error);
      toast.error("Không thể lấy danh sách loại dịch vụ");
    }
  };

  // Hàm để thay đổi trạng thái của loại dịch vụ
  const toggleStatus = async (id) => {
    setIsProcessing(true);
    try {
      const { data } = await axios.patch(
        `http://localhost:4000/api/v1/service/disableservicecate/${id}`,
        {},
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      setIsAuthenticated(true);
      setServiceCateList((prevCategories) =>
        prevCategories.map((category) =>
          category._id === id
            ? { ...category, isActive: !category.isActive }
            : category
        )
      );
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Không thể cập nhật trạng thái dịch vụ"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Mở modal với loại hành động
  const openModal = (type, category = null) => {
    setModalType(type);
    setSelectedCategory(category);
    //setNewCategory(category || { serviceCateName: "", descriptionservice: "", serviceCateImage: [] });
    setNewCategory({
      serviceCateName: category?.serviceCateName || "",
      descriptionservice: category?.descriptionservice || "",
      serviceCateImage: category?.serviceCateImage || [], // Đảm bảo là mảng
    });
    setIsModalOpen(true);
  };

  // Đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setNewCategory({
      serviceCateName: "",
      descriptionservice: "",
      serviceCateImage: [],
    });
  };

  const handleServiceCateImage = (e) => {
    const files = Array.from(e.target.files); // Lấy danh sách file
    setNewCategory((prev) => ({
      ...prev,
      serviceCateImage: [...prev.serviceCateImage, ...files], // Gộp ảnh mới với ảnh đã có
    }));
  };

  // Thêm loại dịch vụ
  const handleAddService = async () => {
    setIsProcessing(true); // Bắt đầu xử lý
    try {
      const formData = new FormData();
      formData.append("serviceCateName", newCategory.serviceCateName);
      formData.append("descriptionservice", newCategory.descriptionservice);
      // if (newCategory.serviceCateImage) formData.append("serviceCateImage", newCategory.serviceCateImage);
      newCategory.serviceCateImage.forEach((file) => {
        formData.append("serviceCateImage", file);
      });

      console.log("FormData gửi đi:", Array.from(formData.entries())); // kiểm tra
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/service/createservicecate",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success(data.message);
      fetchServices();
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error("Không thể thêm loại dịch vụ");
    } finally {
      setIsProcessing(false); // Kết thúc xử lý
    }
  };

  // Cập nhật loại dịch vụ
  const handleEditService = async () => {
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("serviceCateName", newCategory.serviceCateName);
      formData.append("descriptionservice", newCategory.descriptionservice);
      // if (newCategory.serviceCateImage) formData.append("serviceCateImage", newCategory.serviceCateImage);

      newCategory.serviceCateImage.forEach((file) => {
        formData.append("serviceCateImage", file);
      });

      console.log("FormData gửi đi:", Array.from(formData.entries())); // Kiểm tra
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/service/updateservicecate/${selectedCategory._id}`,

        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success(data.message);
      fetchServices();
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error("Không thể cập nhật loại dịch vụ");
    } finally {
      setIsProcessing(false);
    }
  };

  // Xóa loại dịch vụ

  useEffect(() => {
    fetchServices();
  }, []);

  if (!isAuthenticated) {
    toast.info("Chưa đăng nhập");
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page services">
      <h1>DANH SÁCH LOẠI DỊCH VỤ</h1>
      <button onClick={() => openModal("add")}>Thêm Loại Dịch Vụ</button>
      {serviceCateList.length > 0 ? (
        <table className="service-category-table">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên loại dịch vụ</th>
              <th>Mô tả</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {serviceCateList.map((category) => (
              <tr key={category._id}>
                <td>
                  {category.serviceCateImage &&
                  category.serviceCateImage.length > 0 ? (
                    <div
                      style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                    >
                      {category.serviceCateImage.map((image) => (
                        <img
                          key={image._id}
                          src={image.url}
                          alt="Service Category"
                          style={{
                            width: "100px",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "5px",
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    "Không có ảnh"
                  )}
                </td>
                <td>{category.serviceCateName}</td>
                <td>{category.descriptionservice}</td>
                <td>{category.isActive ? "Hoạt động" : "Ngừng hoạt động"}</td>
                <td>
                  <button
                    onClick={() => toggleStatus(category._id)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span>Đang xử lý...</span>
                    ) : category.isActive ? (
                      <FaToggleOn size={24} color="green" />
                    ) : (
                      <FaToggleOff size={24} color="red" />
                    )}
                  </button>
                  <button onClick={() => openModal("edit", category)}>
                    Chỉnh Sửa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h1>Không có loại dịch vụ nào!</h1>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
      >
        {modalType === "add" && (
          <div>
            <h2>Thêm Loại Dịch Vụ</h2>
            <input
              type="text"
              placeholder="Tên loại dịch vụ"
              value={newCategory.serviceCateName}
              onChange={(e) =>
                setNewCategory({
                  ...newCategory,
                  serviceCateName: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Mô tả"
              value={newCategory.descriptionservice}
              onChange={(e) =>
                setNewCategory({
                  ...newCategory,
                  descriptionservice: e.target.value,
                })
              }
            />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleServiceCateImage(e)}
            />
            <div className="image-preview">
              {newCategory.serviceCateImage.map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index}`}
                  className="preview-image"
                />
              ))}
            </div>
            <button onClick={handleAddService} disabled={isProcessing}>
              {isProcessing ? "Đang xử lý..." : "Thêm"}
            </button>{" "}
          </div>
        )}
        {modalType === "edit" && (
          <div>
            <h2>Chỉnh Sửa Loại Dịch Vụ</h2>
            <input
              type="text"
              placeholder="Tên loại dịch vụ"
              value={newCategory.serviceCateName}
              onChange={(e) =>
                setNewCategory({
                  ...newCategory,
                  serviceCateName: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Mô tả"
              value={newCategory.descriptionservice}
              onChange={(e) =>
                setNewCategory({
                  ...newCategory,
                  descriptionservice: e.target.value,
                })
              }
            />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleServiceCateImage(e)}
            />
            <div className="image-preview">
              {newCategory.serviceCateImage.map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index}`}
                  className="preview-image"
                />
              ))}
            </div>
            <button onClick={handleEditService} disabled={isProcessing}>
              {isProcessing ? "Đang xử lý..." : "Lưu"}
            </button>{" "}
          </div>
        )}

        <button onClick={closeModal}>Đóng</button>
      </Modal>
    </section>
  );
};

export default ServiceCategory;
