import { Appointment } from "../models/appointmentSchema.js";
import { ServiceCate } from "../models/servicecateSchema.js";
import { Service } from "../models/serviceSchema.js";
import { PatientRecord } from "../models/patientrecordSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { FollowUpAppointment } from "../models/followUpAppointment.js";
import ErrorHandler from "../middlewares/error.js";

// Tạo PatientRecord từ appointment đã xác nhận
export const createPatientRecord = catchAsyncErrors(async (req, res, next) => {
  const { appointmentId, services, totalPrice, description, followUpDate } =
    req.body;
  console.log(totalPrice);
  //Lấy thông tin từ Appointment
  const appointment = await Appointment.findById(appointmentId).populate(
    "patientId"
  );
  if (!appointment || appointment.status !== "Đã xác nhận") {
    return next(new ErrorHandler("Appointment not found or not accepted", 404));
  }
  //Lấy dữ liệu từng dịch vụ trong mảng services
  const serviceDetails = await Promise.all(
    services.map(async (service) => {
      const serviceCate = await ServiceCate.findById(service.serviceTypeId);
      const serviceData = await Service.findById(service.serviceId);

      if (!serviceCate || !serviceData) {
        throw new ErrorHandler("Service or Service Category not found", 404);
      }
      return {
        serviceTypeId: serviceCate._id,
        serviceId: serviceData._id,
        servicePrice: serviceData.servicePrice,
        quantity: service.quantity,
      };
    })
  );
  //Tạo mã hóa đơn (invoiceCode)
  const invoiceCode = `HD${Math.floor(1000 + Math.random() * 9000)}`;

  //Tạo PatientRecord mới với mảng services
  const patientRecord = await PatientRecord.create({
    appointmentId: appointment._id,
    doctorId: appointment.doctorId,
    patientId: appointment.patientId,
    patientName: appointment.name,
    phone: appointment.phone,
    email: appointment.email,
    appointment_date: appointment.appointment_date,
    appointment_time: appointment.appointment_time,
    services: serviceDetails, // Lưu mảng services đã xử lý
    description,
    totalPrice,
    invoiceCode,
    followUpDate,
    address: appointment.address,
  });
  // Create a FollowUpAppointment if followUpDate is provided
  let followUpAppointment = null;
  if (followUpDate && appointment.email) {
    followUpAppointment = await FollowUpAppointment.create({
      patientRecordId: patientRecord._id,
      doctorId: appointment.doctorId,
      followUpDate,
      followUpAppointment,
    });
    patientRecord.status = "Chờ tái khám";
    await patientRecord.save();
  }
  appointment.status = "Hoàn thành"; // Cập nhật trạng thái là đã hoàn thành
  await appointment.save();
  //Trả về kết quả
  res.status(201).json({
    success: true,
    message: "Tạo hóa đơn bệnh án thành công",
    patientRecord,
  });
});


export const getPatientRecordsByPatientId = catchAsyncErrors(
  async (req, res, next) => {
    try {
      const userId = req.params.userId; // Lấy userId từ URL params

      // Tìm các bản ghi dựa trên patientId
      const patientRecords = await PatientRecord.find({ patientId: userId })
        .populate("services.serviceTypeId") // Populate loại dịch vụ
        .populate("services.serviceId") // Populate dịch vụ
        .populate("appointmentId"); // Populate thông tin lịch hẹn

      // Kiểm tra nếu không tìm thấy bất kỳ bản ghi nào
      if (!patientRecords || patientRecords.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy hồ sơ bệnh án." });
      }

      res.status(200).json({ success: true, data: patientRecords });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy thông tin hồ sơ bệnh án.",
        error: error.message,
      });
    }
  }
);

//Thiếu hàm load hồ sơ đã hoàn thành cho bác sĩ, xem chi tiết
// THiếu xem chi tiết cho khách hàng
