import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    serviceType:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceCate",
        require: true
    },
    serviceName:{
        type: String,
        required: [true, "Tên dịch vụ là bắt buộc"],
    },
    servicePrice:{
        type: Number,
        required: [true, "Giá dịch vụ là bắt buộc"],
    },
    isActive: { 
        type: Boolean, 
        default: true }, 

})

export const Service = mongoose.model("Service", serviceSchema)