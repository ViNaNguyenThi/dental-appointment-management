import mongoose from "mongoose";

const patientrecord = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientName: {
      type: String,
      required: [true, "Patient name is required!"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required!"],
      validate: {
        validator: function (v) {
          return /^[0-9]{10}$/.test(v); // Kiểm tra chuỗi có đúng 10 chữ số không
        },
        message: "Vui lòng nhập số điện thoại là 10 chữ số",
      },
    },
    email: {
      type: String,
    },
    appointment_date: {
      type: String,
      required: [true, "Appointment date is required!"],
    },
    appointment_time: {
      type: String,
      required: [true, "Appointment time is required!"],
    },
    followUpDate: {
      type: Date,
    },
    services: [
      {
        serviceTypeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ServiceCate",
          required: true,
        },
        serviceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service",
          required: true,
        },
        servicePrice: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1!"],
        },
      },
    ],
    description: {
      type: String,
      maxLength: [500, "Description can contain a maximum of 500 characters."],
    },
    invoiceCode: {
      type: String,
      required: true,
      unique: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      validate: {
        validator: function (val) {
          return val >= 0;
        },
        message: "Total Price must be a positive number!",
      },
    },
    address: {
      type: String,
      required: [true, "Address is required!"],
    },
    status: {
      type: String,
      enum: ["Chờ tái khám", "Hoàn thành"],
      default: "Hoàn thành",
    },
  },
  { timestamps: true }
);

export const PatientRecord = mongoose.model("PatientRecord", patientrecord);
