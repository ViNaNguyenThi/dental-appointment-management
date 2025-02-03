import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "First Name Is Required!"],
    },
    email: {
      type: String,
      required: [true, "Email Is Required!"],
      validate: [validator.isEmail, "Provide A Valid Email!"],
    },
    phone: {
      type: String,
      required: [true, "Phone Is Required!"],
      minLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
      maxLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
    },
    dob: {
      type: Date,
      required: [true, "DOB Is Required!"],
    },
    gender: {
      type: String,
      required: [true, "Gender Is Required!"],
      enum: ["Male", "Female"],
    },
    appointment_date: {
      type: String,
      required: true,
    },
    appointment_time: {
      type: String,
      required: true,
    },
    services:[
      {
        serviceTypeId: {
          type: mongoose.Schema.ObjectId,
          ref: "ServiceCate",
          required: true,
        },
        serviceId: {
          type: mongoose.Schema.ObjectId,
          ref: "Service",
          required: true,
        },
      }
    ],
    doctor: {
      name: {
        type: String,
        required: true,
      },
    },
    hasVisited: {
      type: Boolean,
      default: false,
    },
    doctorId: {
      type: mongoose.Schema.ObjectId,
      required: true
    },
    patientId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Chờ duyệt", "Đã xác nhận", "Đã từ chối", "Hoàn thành"],
      default: "Chờ duyệt",
    },
    note: {
      type:String,
    }
  });

export const Appointment = mongoose.model("Appointment", appointmentSchema);
