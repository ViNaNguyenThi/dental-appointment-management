// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "../App.css";

const AddNewServiceCategory = () => {
  const { isAuthenticated } = useContext(Context);
  const [serviceCateName, setServiceCateName] = useState("");
  const [serviceCateImage, setServiceCateImage] = useState([]);
  const [descriptionservice, setDescriptionService] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleServiceCateImage = (e) => {
    const files = Array.from(e.target.files); // Lấy danh sách file
    const newImages = files.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return file;
    });
    setServiceCateImage((prevImages) => [...prevImages, ...newImages]); // Thêm vào mảng ảnh
  };

  const handleAddNewServiceCategory = async (e) => {
    e.preventDefault();
    setIsProcessing(true); // Bắt đầu loading

    // Kiểm tra xem các trường có trống không
    if (!serviceCateName || !serviceCateImage || !descriptionservice) {
      toast.error("Vui lòng không để trống tất cả các trường dữ liệu.");
      return;
    }

    const formData = new FormData();
    formData.append("serviceCateName", serviceCateName);
    serviceCateImage.forEach((image) => {
      formData.append("serviceCateImage", image); // Thêm từng ảnh vào FormData
    });
    formData.append("descriptionservice", descriptionservice);

    try {
      await axios
        .post(
          "http://localhost:4000/api/v1/service/createservicecate",
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        )
        // eslint-disable-next-line no-unused-vars
        .then((res) => {
          toast.success("Thêm loại dịch vụ thành công");
          // Reset các trường sau khi thêm thành công
          setServiceCateName("");
          setDescriptionService("");
          setServiceCateImage([]); // Reset mảng ảnh
        });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Không thể thêm loại dịch vụ mới"
      );
    } finally {
      setIsProcessing(false); // Kết thúc loading
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page">
      <section className="container form-component add-service-category-form">
        <h1 className="form-title">THÊM LOẠI DỊCH VỤ MỚI</h1>
        <form onSubmit={handleAddNewServiceCategory}>
          <div>
            <input
              type="text"
              placeholder="Tên loại dịch vụ"
              value={serviceCateName}
              onChange={(e) => setServiceCateName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Mô tả loại dịch vụ"
              value={descriptionservice}
              onChange={(e) => setDescriptionService(e.target.value)}
            />
          </div>
          <div>
            <div className="image-preview">
              {serviceCateImage.map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index}`}
                  className="preview-image"
                />
              ))}
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleServiceCateImage}
            />
          </div>
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button type="submit" disabled={isProcessing}>
              {isProcessing ? "Đang xử lý..." : "THÊM LOẠI DỊCH VỤ"}
            </button>{" "}
          </div>
        </form>
      </section>
    </section>
  );
};

export default AddNewServiceCategory;
