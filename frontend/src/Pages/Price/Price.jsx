import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';

const ServiceList = () => {
    // eslint-disable-next-line no-unused-vars
    const [services, setServices] = useState([]);
    const [groupedServices, setGroupedServices] = useState({});
    const [selectedCategory, setSelectedCategory] = useState(''); // Lưu loại dịch vụ đã chọn

    // Lấy dữ liệu từ API
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/v1/service/getallservices', {
                    withCredentials: true,
                });
                const data = response.data;
                if (data.success) {
                    const servicesData = data.data;
                    setServices(servicesData);

                    // Nhóm các dịch vụ theo loại (serviceType)
                    const grouped = servicesData.reduce((acc, service) => {
                        const type = service.serviceType?.serviceCateName || 'Khác'; // Nếu không có loại, nhóm vào 'Khác'
                        if (!acc[type]) {
                            acc[type] = {
                                services: [],
                                images: service.serviceType?.serviceCateImage || [], // Lưu mảng hình ảnh
                            };
                        }
                        acc[type].services.push(service);
                        return acc;
                    }, {});

                    setGroupedServices(grouped); // Lưu nhóm dịch vụ vào state
                }
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };

        fetchServices();
    }, []);

    return (
        <div className="service-list">
            <h1>Dịch vụ hoạt động</h1>
            
            {/* Dropdown để chọn loại dịch vụ */}
            <div className="filter-container">
                <select
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    value={selectedCategory}
                >
                    <option value="">Tất cả</option>
                    {Object.keys(groupedServices).map((serviceType) => (
                        <option key={serviceType} value={serviceType}>
                            {serviceType}
                        </option>
                    ))}
                </select>
            </div>
            
            {/* Hiển thị danh sách dịch vụ */}
            <div className="service-container">
                {Object.keys(groupedServices)
                    .filter(serviceType => !selectedCategory || serviceType === selectedCategory) // Lọc theo loại đã chọn
                    .map(serviceType => (
                        <div key={serviceType} className="service-type-group">
                            <h2>{serviceType}</h2>
                            {groupedServices[serviceType].images.length > 0 && (
                                <div className="category-images">
                                    {groupedServices[serviceType].images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image.url}
                                            alt={`${serviceType} icon ${index + 1}`}
                                            className="category-image"
                                        />
                                    ))}
                                </div>
                            )}
                            <div className="service-group">
                                {groupedServices[serviceType].services.map(service => (
                                    <div key={service._id} className="service-card">
                                        <p>{service.serviceName}</p>
                                        <p>Giá: {service.servicePrice ? service.servicePrice.toLocaleString('vi-VN') : 'N/A'} VND</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ServiceList;
