import { PatientRecord } from "../models/patientrecordSchema.js";
import { FollowUpAppointment } from "../models/followUpAppointment.js";
import { User } from "../models/userSchema.js"; // Giả sử bác sĩ được lưu trong model User với role là "Doctor"
import { Service } from "../models/serviceSchema.js";

export const getMonthlyStatsAPI = async (req, res) => {
  const { month, year } = req.params; // Tháng và năm cần thống kê

  try {
    // Tạo ngày bắt đầu và kết thúc của tháng
    const startDate = new Date(year, month - 1, 1); // Ngày bắt đầu tháng
    const endDate = new Date(year, month, 1); // Ngày bắt đầu tháng sau (dùng để giới hạn tìm kiếm)

    // Lấy tất cả các lịch khám (PatientRecord) trong tháng
    const appointments = await PatientRecord.find({
      appointment_date: {
        $gte: startDate.toISOString(),
        $lt: endDate.toISOString(),
      }, // So sánh ngày
    });

    // Lấy tất cả các lịch tái khám (FollowUpAppointment) trong tháng
    const followUps = await FollowUpAppointment.find({
      followUpDate: { $gte: startDate, $lt: endDate }, // So sánh ngày
    });

    const doctorVisits = {};

    // Đếm lượt khám từ lịch khám
    appointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.appointment_date); // Chuyển chuỗi ngày thành đối tượng Date
      if (appointmentDate >= startDate && appointmentDate < endDate) {
        const doctorId = appointment.doctorId.toString();
        doctorVisits[doctorId] = (doctorVisits[doctorId] || 0) + 1;
      }
    });

    // Đếm lượt khám từ lịch tái khám (thêm vào số lượt đã có)
    followUps.forEach((followUp) => {
      const doctorId = followUp.doctorId.toString();
      doctorVisits[doctorId] = (doctorVisits[doctorId] || 0) + 1;
    });

    // Lấy thông tin tên bác sĩ từ doctorId
    const doctorStats = await Promise.all(
      Object.keys(doctorVisits).map(async (doctorId) => {
        const doctor = await User.findById(doctorId); // Giả sử thông tin bác sĩ nằm trong model User
        return {
          doctorName: doctor?.name || "Unknown Doctor",
          visitCount: doctorVisits[doctorId],
        };
      })
    );

    // ----- 2. Tính số lượng dịch vụ -----
    const serviceUsage = {}; // Key: serviceId, Value: số lần sử dụng

    // Dịch vụ từ lịch khám
    appointments.forEach((appointment) => {
      appointment.services.forEach((service) => {
        const serviceId = service.serviceId.toString();
        serviceUsage[serviceId] =
          (serviceUsage[serviceId] || 0) + service.quantity;
      });
    });

    // Dịch vụ từ lịch tái khám
    followUps.forEach((followUp) => {
      followUp.services.forEach((service) => {
        const serviceId = service.serviceId.toString();
        serviceUsage[serviceId] =
          (serviceUsage[serviceId] || 0) + service.quantity;
      });
    });

    // Lấy thông tin dịch vụ (tên và số lần sử dụng)
    const serviceData = await Promise.all(
      Object.keys(serviceUsage).map(async (serviceId) => {
        const service = await Service.findById(serviceId); // Lấy dịch vụ theo `serviceId`
        return {
          serviceName: service?.serviceName || "Unknown Service",
          count: serviceUsage[serviceId],
        };
      })
    );

    // ----- 3. Tính tổng doanh thu -----
    // Khai báo đối tượng lưu doanh thu theo ngày
    const dailyRevenue = {};

    // Cộng doanh thu từ lịch khám vào các ngày tương ứng
    appointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.appointment_date);
      const dateString = appointmentDate.toISOString().split("T")[0]; // Lấy ngày (YYYY-MM-DD)
      dailyRevenue[dateString] =
        (dailyRevenue[dateString] || 0) + appointment.totalPrice;
    });

    // Cộng doanh thu từ lịch tái khám vào các ngày tương ứng
    followUps.forEach((followUp) => {
      const followUpDate = new Date(followUp.followUpDate);
      const dateString = followUpDate.toISOString().split("T")[0]; // Lấy ngày (YYYY-MM-DD)
      dailyRevenue[dateString] =
        (dailyRevenue[dateString] || 0) + followUp.totalPrice;
    });

    // Chuyển đổi dailyRevenue thành một mảng để trả về kết quả
    const dailyRevenueArray = Object.keys(dailyRevenue).map((date) => ({
      date,
      revenue: dailyRevenue[date],
    }));

    // ----- Trả kết quả -----
    res.json({
      doctorStats, // Danh sách bác sĩ và lượt khám
      serviceData, // Danh sách dịch vụ và số lần sử dụng
      dailyRevenueArray, // Tổng doanh thu
    });
  } catch (error) {
    console.error("Error fetching monthly stats:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
