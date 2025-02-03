import { useState, useEffect } from "react";
import {
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Stats = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [doctorStats, setDoctorStats] = useState([]);
  const [DTDATA, setDTDATA] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [isBarChart, setIsBarChart] = useState(true); // State để chuyển đổi giữa LineChart và BarChart

  // Hàm gọi API để lấy dữ liệu thống kê
  const fetchStats = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/report/report/${month}/${year}`
      );
      const data = await response.json();
      setDoctorStats(data.doctorStats);
      setServiceData(data.serviceData);
      setDTDATA(data.dailyRevenueArray);
      // setEquipmentData(data.totalRevenue);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Sử dụng useEffect để tự động gọi API mỗi khi thay đổi các giá trị
  useEffect(() => {
    if (month && year) {
      fetchStats(); // Gọi API khi các giá trị thay đổi
    }
  }, [month, year]);

  const sortedDoctorStats = [...doctorStats].sort(
    (a, b) => b.visitCount - a.visitCount
  );
  const totalDoctorStats = sortedDoctorStats.reduce(
    (total, item) => total + item.visitCount,
    0
  );

  //Sắp xếp thiết bị sử dụng từ cao xuống thấp và tính tổng số lượng
  const sortedDTData = [...DTDATA].sort((a, b) => b.revenue - a.revenue);
  const totalDT = sortedDTData.reduce((total, item) => total + item.revenue, 0);

  const sortedServiceData = [...serviceData].sort((a, b) => b.count - a.count);
  const totalServiceCount = sortedServiceData.reduce(
    (total, item) => total + item.count,
    0
  );

  return (
    <div>
      <h1>Thống kê</h1>

      {/* Form chọn chi nhánh, ngày, tháng và năm */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <label>
          Tháng:
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            required
          >
            {[...Array(12).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                Tháng {i + 1}
              </option>
            ))}
          </select>
        </label>

        <label>
          Năm:
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          >
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2022">2025</option>
          </select>
        </label>
      </form>
      <button onClick={() => setIsBarChart(!isBarChart)}>
        {isBarChart ? "Chuyển sang biểu đồ đường" : "Chuyển sang biểu đồ cột"}
      </button>
      <h2>Doanh thu phòng</h2>
      <ResponsiveContainer width="100%" height={300}>
        {isBarChart ? (
          <BarChart data={doctorStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="doctorName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="visitCount" fill="#82ca9d" name="Số lượng" />
          </BarChart>
        ) : (
          <LineChart data={doctorStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="doctorName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="visitCount"
              stroke="#82ca9d"
              name="Số lượng"
            />
          </LineChart>
        )}
      </ResponsiveContainer>
      <table border="1" style={{ width: "100%", marginTop: "20px" }}>
        <caption>Lượt khám của bác sĩ</caption>
        <thead>
          <tr>
            <th>Stt</th>
            <th>Tên bác sĩ</th>
            <th>Số lượng khám</th>
          </tr>
        </thead>
        <tbody>
          {sortedDoctorStats.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.doctorName}</td>
              <td>{item.visitCount}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="2">
              <strong>Tổng số lượng</strong>
            </td>
            <td>
              <strong>{totalDoctorStats}</strong>
            </td>
          </tr>
        </tbody>
      </table>
      <h2>Doanh thu theo tháng</h2>
      <ResponsiveContainer width="100%" height={300}>
        {isBarChart ? (
          <BarChart data={DTDATA}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#8884d8" name="Doanh số" />
          </BarChart>
        ) : (
          <LineChart data={DTDATA}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#8884d8"
              name="Doanh số"
            />
          </LineChart>
        )}
      </ResponsiveContainer>
      <table border="1" style={{ width: "100%", marginTop: "20px" }}>
        <caption>Bảng thống kê doanh thu theo ngày</caption>
        <thead>
          <tr>
            <th>Stt</th>
            <th>Ngày</th>
            <th>Doanh thu</th>
          </tr>
        </thead>
        <tbody>
          {sortedDTData.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.date}</td>
              <td>{item.revenue}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="2">
              <strong>Tổng số thiết bị sử dụng</strong>
            </td>
            <td>
              <strong>{totalDT}</strong>
            </td>
          </tr>
        </tbody>
      </table>
      <h2>Sử dụng dịch vụ</h2>
      <ResponsiveContainer width="100%" height={300}>
        {isBarChart ? (
          <BarChart data={serviceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="serviceName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#ff7300" name="Số lượng" />
          </BarChart>
        ) : (
          <LineChart data={serviceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="serviceName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#ff7300"
              name="Số lượng"
            />
          </LineChart>
        )}
      </ResponsiveContainer>
      <table border="1" style={{ width: "100%", marginTop: "20px" }}>
        <caption>Bảng thống kê dịch vụ</caption>
        <thead>
          <tr>
            <th>Stt</th>
            <th>Tên dịch vụ</th>
            <th>Số lượng sử dụng</th>
          </tr>
        </thead>
        <tbody>
          {sortedServiceData.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.serviceName}</td>
              <td>{item.count}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="2">
              <strong>Tổng số dịch vụ sử dụng</strong>
            </td>
            <td>
              <strong>{totalServiceCount}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default Stats;
