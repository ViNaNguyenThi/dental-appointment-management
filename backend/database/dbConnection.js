import mongoose from "mongoose";
import { autoCancelAppointment } from "../email/emailService.js";

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to database");
      // Khởi động cron job tự động hủy lịch hẹn
      autoCancelAppointment();
    })
    .catch((err) => {
      console.log(`Some error occured while connecting to database ${err}`);
    });
};
