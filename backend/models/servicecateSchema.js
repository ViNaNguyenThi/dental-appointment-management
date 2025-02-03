import mongoose from "mongoose";

const servicecateSchema = new mongoose.Schema({
    serviceCateName:{
        type: String,
        require: true
    },
    isActive: { 
        type: Boolean, 
        default: true 
    }, 
    serviceCateImage: [{
        public_id: String,
        url: String,
    }],
    descriptionservice:{
        type:String,
    }
})

export const ServiceCate = mongoose.model("ServiceCate", servicecateSchema)