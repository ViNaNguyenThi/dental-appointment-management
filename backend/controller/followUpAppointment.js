import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { FollowUpAppointment } from "../models/followUpAppointment.js";
import { ServiceCate } from "../models/servicecateSchema.js";
import { Service } from "../models/serviceSchema.js";
export const getFollowUpAppointment = catchAsyncErrors(
  async (req, res, next) => {
    try {
      const followUpAppointments = await FollowUpAppointment.find({
        status: "Chờ tái khám",
      }).populate({
        path: "patientRecordId",
        populate: [
          {
            path: "services.serviceTypeId", // Populate serviceTypeId
            model: "ServiceCate",
            select: "serviceCateName",
          },
          {
            path: "services.serviceId", // Populate serviceId
            model: "Service",
            select: "serviceName",
          },
        ],
      });

      res.status(200).json({
        success: true,
        data: followUpAppointments,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Không lấy được lịch hẹn tái khám",
      });
    }
  }
);
export const detailFollowUpAppointment = catchAsyncErrors(
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const followUpAppointment = await FollowUpAppointment.findById(
        id
      ).populate({
        path: "patientRecordId",
        populate: [
          {
            path: "services.serviceTypeId", // Populate serviceTypeId
            model: "ServiceCate",
            select: "serviceCateName",
          },
          {
            path: "services.serviceId", // Populate serviceId
            model: "Service",
            select: "serviceName",
          },
        ],
      });
      if (!followUpAppointment) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy lịch hẹn." });
      }
      res.status(200).json({ success: true, data: followUpAppointment });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Lỗi khi lấy thông tin chi tiết." });
    }
  }
);
export const getCreatedFollowUpAppointment = catchAsyncErrors(
  async (req, res, next) => {
    try {
      const followUpAppointments = await FollowUpAppointment.find({
        status: "Đã tái khám",
      }).populate({
        path: "patientRecordId",
        populate: [
          {
            path: "services.serviceTypeId", // Populate serviceTypeId
            model: "ServiceCate",
            select: "serviceCateName",
          },
          {
            path: "services.serviceId", // Populate serviceId
            model: "Service",
            select: "serviceName",
          },
        ],
      });

      res.status(200).json({
        success: true,
        data: followUpAppointments,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi hệ thống",
      });
    }
  }
);
// Cập nhật phiếu tái khám khi người dùng tới tái khám
export const checkoutFollowUpAppointment = catchAsyncErrors(
  async (req, res, next) => {
    const { followUpAppointmentId } = req.params;
    const { services, totalPrice, followUpDate } = req.body;

    // Lấy thông tin phiếu tái khám từ ID
    const followUpAppointment = await FollowUpAppointment.findById(
      followUpAppointmentId
    ).populate("patientRecordId");
    const patientRecord = followUpAppointment.patientRecordId;

    if (!followUpAppointment) {
      return next(new ErrorHandler("Phiếu tái khám không tồn tại", 404));
    }

    // Kiểm tra xem phiếu tái khám đã có trạng thái "Chờ tái khám" không
    if (followUpAppointment.status !== "Chờ tái khám") {
      return next(new ErrorHandler("Phiếu tái khám không thể cập nhật", 400));
    }

    // Xử lý dịch vụ (services) được gửi lên
    const serviceDetails = await Promise.all(
      services.map(async (service) => {
        const serviceCate = await ServiceCate.findById(service.serviceTypeId);
        const serviceData = await Service.findById(service.serviceId);

        if (!serviceCate || !serviceData) {
          throw new ErrorHandler(
            "Loại dịch vụ hoặc dịch vụ không tồn tại",
            404
          );
        }

        return {
          serviceTypeId: serviceCate._id,
          serviceId: serviceData._id,
          servicePrice: serviceData.servicePrice,
          quantity: service.quantity,
        };
      })
    );

    // Tính toán tổng tiền dựa trên các dịch vụ
    const calculatedTotalPrice = services.reduce(
      (total, service) => total + service.servicePrice * service.quantity,
      0
    );

    // Kiểm tra nếu có ngày tái khám (followUpDate)
    if (followUpDate) {
      // Tạo phiếu tái khám mới nếu có ngày tái khám
      const newFollowUpAppointment = new FollowUpAppointment({
        doctorId: followUpAppointment.doctorId,
        patientRecordId: followUpAppointment.patientRecordId, // Giữ lại patientRecordId cũ
        services: serviceDetails, // Các dịch vụ mới được chọn
        totalPrice: calculatedTotalPrice, // Tổng tiền đã tính
        followUpDate: followUpDate, // Ngày tái khám mới
        status: "Chờ tái khám", // Đặt lại trạng thái là "Chờ tái khám"
      });

      // Lưu phiếu tái khám mới
      await newFollowUpAppointment.save();
      // Cập nhật trạng thái phiếu tái khám cũ thành "Đã tái khám"
      followUpAppointment.status = "Đã tái khám";
      await followUpAppointment.save();
      patientRecord.status = "Chờ tái khám";
      await patientRecord.save();
      // Trả về kết quả
      return res.status(201).json({
        success: true,
        message: "Tạo phiếu tái khám mới thành công",
        data: newFollowUpAppointment,
      });
    }

    // Nếu không có ngày tái khám, cập nhật phiếu tái khám hiện tại
    followUpAppointment.services = serviceDetails; // Cập nhật dịch vụ
    followUpAppointment.totalPrice = calculatedTotalPrice; // Cập nhật tổng tiền
    followUpAppointment.status = "Đã tái khám"; // Đặt lại trạng thái

    await followUpAppointment.save();
    patientRecord.status = "Hoàn thành";
    await patientRecord.save();
    // Trả về kết quả
    return res.status(200).json({
      success: true,
      message: "Cập nhật phiếu tái khám thành công",
      data: followUpAppointment,
    });
  }
);
