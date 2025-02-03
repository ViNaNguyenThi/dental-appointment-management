import nodemailer from 'nodemailer';
import cron from 'node-cron';
import { FollowUpAppointment } from "../models/followUpAppointment.js"
import { PatientRecord } from "../models/patientrecordSchema.js"
import { User } from "../models/userSchema.js"
import moment from "moment";
import { Appointment } from "../models/appointmentSchema.js"; // Import model lịch hẹn


export const sendReminderEmail = async (email, patientName, followUpDate, doctorPhone) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "6bagshospital@gmail.com",
      pass: "alns tynx lplp otua",
    },
  });


  const mailOptions = {
    from: "dentalcare@gmail.com <6bagshospital@gmai.com>",
    to: email,
    subject: "Nhắc nhở lịch hẹn tái khám",
    text: `Xin chào ${patientName},\n\nBạn có lịch hẹn tái khám vào ngày ${followUpDate}. Vui lòng liên hệ với bác sĩ thông qua số điện thoại ${doctorPhone} để được hỗ trợ về lịch khám.\n\nTrân trọng,\nPhòng khám`,
  };


  await transporter.sendMail(mailOptions);
};
// Hàm gửi email cập nhật trạng thái lịch hẹn
export const sendStatusUpdateEmail = async (email, patientName, appointmentDate, appointmentTime, status) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "6bagshospital@gmail.com",
      pass: "alns tynx lplp otua",
    },
  });


  let subject, text;


  if (status === "Đã xác nhận") {
    subject = "Lịch hẹn của bạn đã được xác nhận";
    text = `Xin chào ${patientName},\n\nLịch hẹn của bạn vào ngày ${appointmentDate} lúc ${appointmentTime} đã được xác nhận. Vui lòng đến đúng giờ để được phục vụ tốt nhất.\n\nTrân trọng,\nPhòng khám`;
  } else if (status === "Đã từ chối") {
    subject = "Lịch hẹn của bạn đã bị hủy";
    text = `Xin chào ${patientName},\n\nLịch hẹn của bạn vào ngày ${appointmentDate} lúc ${appointmentTime} đã bị hủy do trùng lịch hoặc do bác sĩ bận. Bạn có thể liên hệ lại để sắp xếp lịch hẹn khác.\n\nTrân trọng,\nPhòng khám`;
  }


  const mailOptions = {
    from: "dentalcare@gmail.com <6bagshospital@gmail.com>",
    to: email,
    subject,
    text,
  };


  await transporter.sendMail(mailOptions);
};
cron.schedule("0 7 * * *", async () => {
  try {
    const tomorrow = moment().add(1, "days").startOf("day");
    const endOfTomorrow = moment(tomorrow).endOf("day");
    // Truy vấn các bản ghi FollowUpAppointment có followUpDate là ngày hôm sau
    const followUpAppointments = await FollowUpAppointment.find({
      followUpDate: {
        $gte: tomorrow.toDate(),
        $lt: endOfTomorrow.toDate(),
      },
      isReminderSent: false, // chỉ lấy những bản ghi chưa gửi email
    });
    console.log(followUpAppointments)
    // Duyệt qua từng followUpAppointment để lấy thông tin từ PatientRecord
    for (const followUpAppointment of followUpAppointments) {
      try {
        const { patientRecordId, doctorId, followUpDate } = followUpAppointment;
        const patientRecord = await PatientRecord.findById(patientRecordId);
        const doctor = await User.findById(doctorId);
       
        if (patientRecord && doctor) {
          const { email, patientName } = patientRecord;
          const doctorPhone = doctor.phone;
   
          await sendReminderEmail(
            email,
            patientName,
            moment(followUpDate).format("DD/MM/YYYY"),
            doctorPhone
          );
   
          await FollowUpAppointment.findByIdAndUpdate(followUpAppointment._id, {
            isReminderSent: true,
          });
          console.log(`Gửi email nhắc nhở thành công cho ${patientName}`);
        }
      } catch (error) {
        console.error(`Lỗi khi gửi email nhắc nhở cho lịch hẹn ID ${followUpAppointment._id}:`, error);
      }
    }    
  } catch (error) {
    console.error("Có lỗi xảy ra khi gửi email nhắc nhở:", error);
  }
});
export const handleRejectedAppointments = async (appointment) => {
  const conditions = {
    appointment_date: appointment.appointment_date,
    appointment_time: appointment.appointment_time,
    doctorId: appointment.doctorId,
    _id: { $ne: appointment._id },
    status: "Pending",
  };


  // Từ chối các lịch hẹn khác cùng thời gian
  await Appointment.updateMany(conditions, {
    status: "Rejected",
    emailSent: false,
  });


  // Gửi email và cập nhật emailSent
  const rejectedAppointments = await Appointment.find({
    ...conditions,
    status: "Rejected",
    emailSent: false,
  });


  // Gửi email và cập nhật emailSent trong 1 vòng lặp
  const emailPromises = rejectedAppointments.map(async (rejectedAppointment) => {
    await sendStatusUpdateEmail(
      rejectedAppointment.email,
      rejectedAppointment.name,
      rejectedAppointment.appointment_date,
      rejectedAppointment.appointment_time,
      "Rejected"
    );


    return Appointment.updateOne(
      { _id: rejectedAppointment._id },
      { emailSent: true }
    );
  });


  await Promise.all(emailPromises); // Chạy song song
};
export const autoCancelAppointment = () => {
  cron.schedule("*/15 * * * *", async () => {
    try {
      const currentTime = moment();
      const oneHourAgo = moment().subtract(1, "hours");
      // Tìm các lịch hẹn `Accepted` mà đã quá 1 giờ nhưng chưa thay đổi trạng thái
      const appointmentsToCancel = await Appointment.find({
        status: "Accepted",
        hasVisited: false, // Bệnh nhân chưa đến
        appointment_date: { $lte: currentTime.format("YYYY-MM-DD") },
        appointment_time: {
          $lte: oneHourAgo.format("HH:mm"),
        },
      });
      // Cập nhật trạng thái thành "Canceled"
      for (const appointment of appointmentsToCancel) {
        await Appointment.findByIdAndUpdate(appointment._id, {
          status: "Canceled",
        });
        console.log(
          `Đã tự động hủy lịch hẹn ID: ${appointment._id}, Bệnh nhân: ${appointment.name}`
        );
      }
    } catch (error) {
      console.error("Lỗi trong cron job tự động hủy lịch hẹn:", error);
    }
  });
};



