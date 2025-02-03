import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: function() { return !this.isOAuthUser; },  // Chỉ bắt buộc nếu không phải từ OAuth
  },
  email: {
    type: String,
    required: [true, "Email Is Required!"],
    validate: [validator.isEmail, "Provide A Valid Email!"],
  },
  phone: {
    type: String,
    //required: function() { return !this.isOAuthUser; },  // Chỉ bắt buộc nếu không phải từ OAuth
    minLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
    maxLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
  },
  dob: {
    type: Date,
    //required: function() { return !this.isOAuthUser; },  // Chỉ bắt buộc nếu không phải từ OAuth
  },
  gender: {
    type: String,
   // required: function() { return !this.isOAuthUser; },  // Chỉ bắt buộc nếu không phải từ OAuth
    enum: ["Nam", "Nữ"],
  },
  password: {
    type: String,
    required: function() { return !this.isOAuthUser; },  // Chỉ bắt buộc nếu không phải từ OAuth
    minLength: [8, "Password Must Contain At Least 8 Characters!"],
    select: false,
  },
  role: {
    type: String,
    required: [true, "User Role Required!"],
    enum: ["Patient", "Doctor", "Admin"],
  },
  doctorDepartment:{
    type: String,
  },
  docAvatar: {
    public_id: String,
    url: String,
  },
  isOAuthUser: {
    type: Boolean,
    default: false, // Để biết người dùng có từ OAuth hay không
  },
  address:{
    type: String,
  },
  
Introduceyourself:{
  type:String
},
resetPasswordToken: String,
resetPasswordExpiresAt: Date,
});


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcryptjs.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const User = mongoose.model("User", userSchema);