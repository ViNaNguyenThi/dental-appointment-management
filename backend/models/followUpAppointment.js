import mongoose from "mongoose";

const followUpAppointmentSchema = new mongoose.Schema(
  {
    patientRecordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PatientRecord",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      default: null,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    notes: {
      type: String,
    },
    totalPrice: {
      type: Number,
      validate: {
        validator: function (val) {
          return val >= 0;
        },
        message: "Total Price must be a positive number!",
      },
    },
    services: [
      {
        serviceTypeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ServiceCate",
        },
        serviceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service",
        },
        servicePrice: {
          type: Number,
        },
        quantity: {
          type: Number,
          min: [1, "Quantity must be at least 1!"],
        },
      },
    ],
    followUpDate: {
      type: Date,
    },
    isReminderSent: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Chờ tái khám", "Đã tái khám"],
      default: "Chờ tái khám",
    },
  },
  { timestamps: true }
);

export const FollowUpAppointment = mongoose.model(
  "FollowUpAppointment",
  followUpAppointmentSchema
);
