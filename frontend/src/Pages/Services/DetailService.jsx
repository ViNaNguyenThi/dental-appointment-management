// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import useParams hook from react-router-dom

const DetailServiceCates = () => {
  const [serviceCate, setServiceCate] = useState(null); // Changed to a single object, not an array
  const [services, setServices] = useState([]); // State for services
  const { id } = useParams(); // Getting the `id` from the URL params

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch category details
        const responseCate = await axios.get(`http://localhost:4000/api/v1/service/getservicecate/${id}`, {
          withCredentials: true,
        });
        console.log(responseCate.data); // Debugging line to check the category response
        setServiceCate(responseCate.data.data); // Directly set the received category data

        // Fetch active services with their names and prices
        const responseServices = await axios.get('http://localhost:4000/api/v1/service/getactiveservice', {
          withCredentials: true,
        });
        console.log(responseServices.data);
        if (responseServices.data.success) {
          const activeServices = responseServices.data.data;
          setServices(activeServices); // Save the services to state
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <div>
      {serviceCate ? (
        <div className="service-cate-detail">
          <h2>Dịch vụ {serviceCate.serviceCateName} chất lượng tại ... </h2>
          <p>{serviceCate.descriptionservice}</p>
          <h3>Quy trình {serviceCate.serviceCateName}</h3>

          {/* Hiển thị danh sách dịch vụ */}
          <h3> {serviceCate.serviceCateName}</h3>
          <div className="services-list">
            {services.length > 0 ? (
              <table className="service-table">
                <thead>
                  <tr>
                    <th>Tên dịch vụ</th>
                    <th>Giá dịch vụ (VND)</th>
                  </tr>
                </thead>
                <tbody>
                  {services
                    .filter(service => service.serviceType?.serviceCateName === serviceCate.serviceCateName) // Lọc dịch vụ theo loại
                    .map((service) => (
                      <tr key={service._id}>
                        <td>{service.serviceName}</td>
                        <td>{service.servicePrice ? service.servicePrice.toLocaleString('vi-VN') : 'N/A'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <p>Không có dịch vụ nào trong loại này.</p>
            )}
          </div>

        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DetailServiceCates;
