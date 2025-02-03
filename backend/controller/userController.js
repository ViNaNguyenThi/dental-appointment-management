import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js"
import ErrorHandler from "../middlewares/error.js"
import { User } from "../models/userSchema.js";
import crypto from "crypto";
import bcryptjs from "bcryptjs"; // Correct import
import {sendPasswordResetEmail,sendResetSuccessEmail} from "../mailtrap/emails.js"
import {generateToken} from "../utils/jwtToken.js"
import cloudinary from "cloudinary"

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, role } = req.body;


  if (!name || !email || !password || !role) {
    return next(new ErrorHandler("Please Fill Full Form", 400));
  }

  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("User already registered", 400));
  }

  user = await User.create({ name, email, password, role });

  generateToken(user, res);  // Assuming generateToken adds the token in the response


  res.status(201).json({
    success: true,
    message: "User registered successfully!",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  });
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Vui lòng điền đầy đủ thông tin!", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Password or Email", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Password or Email", 400));
  }
  if (role !== user.role) {
    return next(new ErrorHandler("Người dùng không phải role này", 400));
  }

  generateToken(user, res);

  // Gửi phản hồi JSON cho client
  res.status(200).json({
    success: true,
    message: "Đăng nhập thành công",
    user,
  });
})


export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  console.log(req.body);
  const { name, email, phone, dob, gender, password } = req.body;
  if (!name ||
    !email ||
    !phone ||
    !dob ||
    !gender ||
    !password) {
    return next(new ErrorHandler("Please Fill Full Form", 400))
  }
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler(`${isRegistered.role} with this email already exists!`, 400));
  }
  const admin = await User.create({ name, email, phone, dob, gender, password, role: "Admin", });
  res.status(200).json({
    success: true,
    message: "New Admin Registered!",
    admin,
  })
});

export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" });
  res.status(200).json({
    success: true,
    doctors,
  });
});



export const getFourDoctors = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là 1
  const limit = parseInt(req.query.limit) || 4; // Số lượng bác sĩ mỗi trang, mặc định là 4
  const skip = (page - 1) * limit; // Số lượng bác sĩ cần bỏ qua
  
  // Lấy danh sách bác sĩ
  const doctors = await User.find({ role: "Doctor" }).skip(skip).limit(limit);

  // Tính tổng số bác sĩ
  const totalDoctors = await User.countDocuments({ role: "Doctor" });
  const totalPages = Math.max(1, Math.ceil(totalDoctors / limit)); // Đảm bảo ít nhất 1 trang

  res.status(200).json({
    success: true,
    doctors,
    totalDoctors,
    totalPages,
    currentPage: page,
  });
});


export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  })
})

export const getUser = catchAsyncErrors(async (req, res) => {
  const userId = req.params.userId;
  try {    
   
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      dob: user.dob,    
      gender: user.gender,
      address: user.address,  
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tải thông tin người dùng' });
  }
});

export const updateUser = catchAsyncErrors(async (req, res) => {
  const userId = req.params.userId;
  const { name, email, phone, dob, gender, address } = req.body;


  // Tạo một đối tượng chỉ chứa các trường cần cập nhật
  const updatedData = {
    ...(name && { name }),
    ...(email && { email }),
    ...(phone && { phone }),
    ...(dob && { dob }),
    ...(gender && { gender }),
    ...(address && { address }),
  };

  // Tìm và cập nhật user cùng lúc
  const user = await User.findByIdAndUpdate(userId, updatedData, {
    new: true,            // Trả về user sau khi cập nhật
    runValidators: true,  // Kiểm tra tính hợp lệ của dữ liệu
  });

  if (!user) {
    return res.status(404).json({ message: 'Không tìm thấy người dùng' });
  }
  res.json({ message: 'Cập nhật thông tin thành công', user });
});

export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res.status(200).cookie("adminToken", " ", {
    httpOnly: true,
    expires: new Date(Date.now()),
  }).json({
    success: true,
    message: "Đăng xuất thành công",
  })
})
export const logoutDoctor = catchAsyncErrors(async (req, res, next) => {
  res.status(200).cookie("doctorToken", " ", {
    httpOnly: true,
    expires: new Date(Date.now()),
  }).json({
    success: true,
    message: "Đăng xuất thành công",
  })
})


export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
  res.status(200).cookie("patientToken", " ", {
    httpOnly: true,
    expires: new Date(Date.now()),
  }).json({
    success: true,
    message: "Đăng xuất thành công",
  })
});

//đăng ký bác sĩ
export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Doctor Avatar Required!", 400));
  }
  const { docAvatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler("File Format Not Supported!", 400));
  }
  const {
    name,
    email,
    phone,
    dob,
    gender,
    password,
  } = req.body;
  const missingFields = [];

  // Kiểm tra từng trường
  if (!name) missingFields.push("Name");
  if (!email) missingFields.push("Email");
  if (!phone) missingFields.push("Phone");
  if (!dob) missingFields.push("Date of Birth");
  if (!gender) missingFields.push("Gender");
  if (!password) missingFields.push("Password");
  if (!docAvatar) missingFields.push("Doctor Avatar");

  // Nếu có trường nào bị thiếu, tạo thông báo lỗi
  if (missingFields.length > 0) {
    return next(new ErrorHandler(`Please fill in the following fields: ${missingFields.join(", ")}`, 400));
  }
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler("Doctor With This Email Already Exists!", 400)
    );
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    docAvatar.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(
      new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
    );
  }
  const doctor = await User.create({
    name,
    email,
    phone,
    dob,
    gender,
    password,
    role: "Doctor",
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "New Doctor Registered",
    doctor,
  });
});

// API to count the total number of registered doctors
export const countDoctors = catchAsyncErrors(async (req, res, next) => {
  try {
    // Đếm số lượng users có role là "Doctor"
    const totalDoctors = await User.countDocuments({ role: "Doctor" });

    // Trả về kết quả thành công
    res.status(200).json({
      success: true,
      totalDoctors,
    });
  } catch (error) {
    console.log(error)
    return next(new ErrorHandler("System Error! Please try again later.", 500));
  }
});

//chỉnh sửa thông tinn bác sĩ
export const updateDoctor = catchAsyncErrors(async (req, res, next) => {
  const { doctorId } = req.params;  // ID bác sĩ cần cập nhật
  const { name, email, phone, dob, gender, Introduceyourself } = req.body;

  const doctor = await User.findById(doctorId);
  if (!doctor) {
    return next(new ErrorHandler("Doctor not found!", 404));
  }
  let updatedAvatar = doctor.docAvatar;  
  if (req.files && req.files.docAvatar) {
    const docAvatar = req.files.docAvatar;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(docAvatar.mimetype)) {
      return next(new ErrorHandler("File Format Not Supported!", 400));
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath);
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary error");
      return next(new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500));
    }
    updatedAvatar = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  doctor.name = name || doctor.name;
  doctor.email = email || doctor.email;
  doctor.phone = phone || doctor.phone;
  doctor.dob = dob || doctor.dob;
  doctor.gender = gender || doctor.gender;
  doctor.Introduceyourself = Introduceyourself || doctor.Introduceyourself;
  doctor.docAvatar = updatedAvatar;

  await doctor.save();

  res.status(200).json({
    success: true,
    message: "Doctor Information Updated",
    doctor,
  });
});

//Xóa tài khoản bác sĩ
export const deleteDoctor = catchAsyncErrors(async (req, res, next) => {
  const { doctorId } = req.params;

  const doctor = await User.findByIdAndDelete(doctorId);

  if (!doctor) {
    return next(new ErrorHandler("Doctor Not Found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Doctor Account Deleted Successfully",
  });
});

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

   user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    // Send email
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${ resetToken}`;
    await sendPasswordResetEmail(user.email, resetURL);

    res.status(200).json({ success: true, message: "Password reset link sent to your email" });
  } catch (error) {
    console.log("Error in forgotPassword", error);
    res.status(400).json({ success: false, message: error.message });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Token is invalid or has expired" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();
    await sendResetSuccessEmail(user.email);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log("Error in resetPassword", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Lấy thông tin chi tiết bác sĩ theo ID
export const getDoctorById = catchAsyncErrors(async (req, res, next) => {
  const doctorId = req.params.id;

  const doctor = await User.findById(doctorId);

  if (!doctor) {
    return res.status(404).json({
      success: false,
      message: "Bác sĩ không tồn tại",
    });
  }

  res.status(200).json({
    success: true,
    doctor, // Trả về thông tin bác sĩ chi tiết
  });
});