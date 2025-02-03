// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ActiveServiceCates = () => {
  const [serviceCates, setServiceCates] = useState([]);

  // Lấy danh sách các loại dịch vụ đang hoạt động
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/service/getallservicecate",
          {
            withCredentials: true, // Gửi kèm cookie nếu cần
          }
        );
        // Lưu dữ liệu vào state
        if (response.data.success) {
          setServiceCates(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching active service categories:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="active-service-cates">
      <h2 className="page-title">Danh mục dịch vụ hoạt động</h2>
      <div className="service-cates-container">
        {/* Hiển thị danh sách loại dịch vụ */}
        {serviceCates.length > 0 ? (
          serviceCates.map((serviceCate) => (
            <div key={serviceCate._id} className="service-cate-card">
              <h3 className="service-cate-title">{serviceCate.serviceCateName}</h3>
              {/* Hiển thị hình ảnh */}
              {serviceCate.serviceCateImage?.[0]?.url && (
                <img
                  src={serviceCate.serviceCateImage[0].url}
                  alt={serviceCate.serviceCateName}
                  className="service-cate-image"
                />
              )}
              {/* Hiển thị mô tả rút gọn */}
              <p className="service-cate-description">
                {serviceCate.descriptionservice.length > 100
                  ? `${serviceCate.descriptionservice.substring(0, 100)}...`
                  : serviceCate.descriptionservice}
              </p>
              {/* Nút xem thêm */}
              <Link
                to={`/detailservice/${serviceCate._id}`}
                className="see-more-link"
              >
                Xem thêm
              </Link>
            </div>
          ))
        ) : (
          <p className="no-data-message">Không có danh mục dịch vụ hoạt động.</p>
        )}
      </div>
    </div>
  );
};

export default ActiveServiceCates;
