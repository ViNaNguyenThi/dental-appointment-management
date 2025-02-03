import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";
import {
  sendStatusUpdateEmail,
  handleRejectedAppointments,
} from "../email/emailService.js";
export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    name,
    email,
    phone,
    dob,
    gender,
    appointment_date,
    appointment_time,
    services,
    doctorId,
    address,
  } = req.body;

  if (!appointment_time) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng chọn thời gian hẹn!",
    });
  }

  // Kiểm tra dữ liệu đầu vào
  if (
    !name ||
    !email ||
    !phone ||
    !dob ||
    !gender ||
    !appointment_date ||
    !appointment_time ||
    !doctorId ||
    !address
  ) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng điền đầy đủ thông tin!",
    });
  }

  try {
    const patientId = req.user._id;
    // Kiểm tra xem có dịch vụ nào bị trùng lặp hay không
    const serviceIds = services.map((service) => service.serviceId);
    const hasDuplicateServices = new Set(serviceIds).size !== serviceIds.length;

    if (hasDuplicateServices) {
      return res.status(400).json({
        success: false,
        message: "Dịch vụ đã được chọn trước đó. Vui lòng kiểm tra lại!",
      });
    }

    const doctor = await User.findOne({
      _id: doctorId,
      role: "Doctor",
    });

    if (!doctor) {
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy bác sĩ",
      });
    }

    // Kiểm tra giới hạn tối đa 3 lịch hẹn cho một khung giờ
    const conflictingAppointments = await Appointment.find({
      appointment_date,
      appointment_time,
      doctorId,
      status: { $in: ["Chờ duyệt", "Đã xác nhận"] },
    });

    if (conflictingAppointments.length >= 3) {
      return res.status(400).json({
        success: false,
        message: "Khung giờ này đã được đặt đủ chỗ!",
      });
    }

    // Kiểm tra xem đã có lịch hẹn nào được xác nhận vào ngày và giờ này chưa
    const existingConfirmedAppointment = await Appointment.findOne({
      appointment_date,
      appointment_time,
      doctorId,
      status: "Đã xác nhận",
    });
    if (existingConfirmedAppointment) {
      return res.status(400).json({
        success: false,
        message: "Khung giờ này đã được xác nhận bởi một bệnh nhân khác!",
      });
    }

    // Tạo lịch hẹn với trạng thái "Pending"
    const appointment = await Appointment.create({
      name,
      email,
      phone,
      dob,
      gender,
      appointment_date,
      appointment_time,
      services,
      address,
      doctorId,
      patientId: patientId,
      doctor: { name: doctor.name },
      status: "Chờ duyệt",
    });

    res.status(200).json({
      success: true,
      message: "Đặt lịch hẹn thành công!",
      appointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống! Vui lòng thử lại sau.",
    });
  }
});

export const adminPostAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    name,
    email,
    phone,
    dob,
    gender,
    appointment_date,
    appointment_time,
    services,
    doctorId,
    address,
  } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (
    !name ||
    !email ||
    !phone ||
    !dob ||
    !gender ||
    !appointment_date ||
    !appointment_time ||
    !doctorId ||
    !address
  ) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng điền đầy đủ thông tin!",
    });
  }
  if (!appointment_time) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng chọn giờ hẹn!",
    });
  }
  try {
    // Kiểm tra xem có dịch vụ nào bị trùng lặp hay không
    const serviceIds = services.map((service) => service.serviceId);
    const hasDuplicateServices = new Set(serviceIds).size !== serviceIds.length;

    if (hasDuplicateServices) {
      return res.status(400).json({
        success: false,
        message: "Dịch vụ đã được chọn trước đó. Vui lòng kiểm tra lại!",
      });
    }
    // Tìm bác sĩ theo tên
    const doctor = await User.findOne({
      _id: doctorId,
      role: "Doctor",
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bác sĩ!",
      });
    }

    // Kiểm tra giới hạn tối đa 3 lịch hẹn cho một khung giờ
    const conflictingAppointments = await Appointment.find({
      appointment_date,
      appointment_time,
      doctorId,
      status: { $in: ["Chờ duyệt", "Đã xác nhận"] },
    });

    if (conflictingAppointments.length >= 3) {
      return res.status(400).json({
        success: false,
        message: "Khung giờ này đã được đặt đầy!",
      });
    }
    // Kiểm tra xem đã có lịch hẹn nào được xác nhận vào ngày và giờ này chưa
    const existingConfirmedAppointment = await Appointment.findOne({
      appointment_date,
      appointment_time,
      doctorId,
      status: "Đã xác nhận",
    });
    if (existingConfirmedAppointment) {
      return res.status(400).json({
        success: false,
        message: "Khung giờ này đã được xác nhận bởi bệnh nhân khác!",
      });
    }
    // Tạo lịch hẹn với trạng thái "Accepted"
    const appointment = await Appointment.create({
      name,
      email,
      phone,
      dob,
      gender,
      appointment_date,
      appointment_time,
      services,
      address,
      doctorId,
      doctor: { name: doctor.name },
      status: "Đã xác nhận",
    });

    res.status(200).json({
      success: true,
      message: "Appointment Sent Successfully!",
      appointment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống! Vui lòng thử lại sau.",
    });
  }
});

// Lấy chi tiết cuộc hẹn
export const getAppointmentDetails = catchAsyncErrors(
  async (req, res, next) => {
    const { id: appointmentId } = req.params;

    try {
      const appointment = await Appointment.findById(appointmentId)
        .populate("doctorId")
        .populate({
          path: "services.serviceTypeId", // Đường dẫn tới serviceTypeId trong services
          model: "ServiceCate",
        })
        .populate({
          path: "services.serviceId", // Đường dẫn tới serviceId trong services
          model: "Service",
        });

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy cuộc hẹn!",
        });
      }

      res.status(200).json({
        success: true,
        appointment,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Lỗi hệ thống! Vui lòng thử lại sau.",
      });
    }
  }
);

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  const appointments = await Appointment.find();
  res.status(200).json({
    success: true,
    appointments,
  });
});
export const DoctorgetPendingAppointments = catchAsyncErrors(
  async (req, res, next) => {
    try {
      // Lấy ID của bác sĩ hiện tại từ req.user
      const doctorId = req.user._id;

      // Tìm tất cả các lịch hẹn có doctorId là ID của bác sĩ đăng nhập
      const appointments = await Appointment.find({
        doctorId,
        status: "Chờ duyệt",
      });

      res.status(200).json({
        success: true,
        appointments,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Lỗi hệ thống! Vui lòng thử lại sau.",
      });
    }
  }
);

export const DoctorgetAcceptedAppointments = catchAsyncErrors(
  async (req, res, next) => {
    try {
      // Lấy ID của bác sĩ hiện tại từ req.user
      const doctorId = req.user._id;

      // Tìm tất cả các lịch hẹn có doctorId là ID của bác sĩ đăng nhập
      const appointments = await Appointment.find({
        doctorId,
        status: "Đã xác nhận",
      });
      res.status(200).json({
        success: true,
        appointments,
      });
    } catch (error) {
      return next(
        new ErrorHandler("System Error! Please try again later.", 500)
      );
    }
  }
);

export const updateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    let appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(new ErrorHandler("Appointment Not Found", 404));
    }
    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    // Nếu trạng thái là "Accepted", từ chối các lịch hẹn khác trong cùng khung giờ
    if (req.body.status === "Đã xác nhận") {
      // Từ chối tất cả các lịch hẹn khác trong cùng ngày, giờ và bác sĩ
      await Appointment.updateMany(
        {
          appointment_date: appointment.appointment_date,
          appointment_time: appointment.appointment_time,
          doctorId: appointment.doctorId,
          _id: { $ne: id }, // Loại trừ lịch hẹn vừa được xác nhận
          status: "Chờ duyệt", // Chỉ từ chối các lịch hẹn đang chờ
        },
        { status: "Đã từ chối" }
      );
    }
    res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái thành công",
      appointment,
    });
  }
);

export const DoctorupdateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;

    // Lấy ID của bác sĩ từ req.user
    const doctorId = req.user._id;

    // Kiểm tra xem lịch hẹn có thuộc về bác sĩ không
    let appointment = await Appointment.findOne({ _id: id, doctorId });

    if (!appointment) {
      return next(
        new ErrorHandler("Appointment Not Found or Unauthorized Access", 404)
      );
    }

    // Cập nhật trạng thái của lịch hẹn
    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    // Nếu trạng thái được cập nhật là "Accepted"
    if (req.body.status === "Đã xác nhận") {
      appointment.acceptedAt = new Date();
      await appointment.save(); // Lưu lại thay đổi vào database
      // Gửi email xác nhận
      await sendStatusUpdateEmail(
        appointment.email,
        appointment.name,
        appointment.appointment_date,
        appointment.appointment_time,
        "Đã xác nhận"
      );

      // Xử lý các lịch hẹn bị từ chối
      await handleRejectedAppointments(appointment);
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái thành công",
      appointment,
    });
  }
);

export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment Not Found", 404));
  }
  await appointment.deleteOne();
  res.status(200).json({
    success: true,
    message: "Appointment Deleted!",
  });
});
// API to count the total number of appointments
export const countAppointments = catchAsyncErrors(async (req, res, next) => {
  try {
    // Đếm tổng số lượng appointments trong collection
    const totalAppointments = await Appointment.countDocuments();

    // Trả về kết quả thành công
    res.status(200).json({
      success: true,
      totalAppointments,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("System Error! Please try again later.", 500));
  }
});

export const getBookedTime = catchAsyncErrors(async (req, res, next) => {
  const { doctorId, appointment_date } = req.query;
  if (!doctorId || !appointment_date) {
    return res
      .status(400)
      .json({ success: false, message: "Bác sĩ và ngày khám là bắt buộc" });
  }
  const appointments = await Appointment.find({
    doctorId,
    appointment_date,
    status: "Đã xác nhận",
  }).select("appointment_time -_id");
  const bookedTimes = appointments.map(
    (appointment) => appointment.appointment_time
  );
  return res.status(200).json({
    success: true,
    bookedTimes,
  });
});
