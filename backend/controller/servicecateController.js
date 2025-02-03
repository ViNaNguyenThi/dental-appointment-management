import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { ServiceCate } from "../models/servicecateSchema.js";
import { Service } from "../models/serviceSchema.js";
import cloudinary from "cloudinary"

//Tạo mới loại dịch vụ
export const createServiceCate = catchAsyncErrors(async (req, res, next) => {
    const { serviceCateName, descriptionservice } = req.body;

    // Kiểm tra xem ảnh có được tải lên không
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Hình ảnh của loại dịch vụ là bắt buộc", 400));
    }

    // const serviceCateImages = Array.isArray(req.files.serviceCateImage)
    //     ? req.files.serviceCateImage
    //     : [req.files.serviceCateImage];

    const {serviceCateImage} = req.files;
    const uploadedImages = [];
    const imagesArray = Array.isArray(serviceCateImage) ? serviceCateImage : [serviceCateImage];
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

    // Kiểm tra định dạng từng ảnh
    for (const image of serviceCateImage) {
        if (!allowedFormats.includes(image.mimetype)) {
            return next(new ErrorHandler("Định dạng ảnh không được hỗ trợ", 400));
        }
    }

    // Kiểm tra tên loại dịch vụ
    if (!serviceCateName || !descriptionservice) {
        return next(new ErrorHandler("Vui lòng cung cấp tên và mô tả loại dịch vụ", 400));
    }

    // Upload từng ảnh lên Cloudinary và lưu kết quả

    for (const image of serviceCateImage) {
        const cloudinaryResponse = await cloudinary.uploader.upload(
            image.tempFilePath,
            { folder: "service_categories" } // Optional: tạo folder trên Cloudinary để dễ quản lý
        );

        if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary error");
            return next(new ErrorHandler("Không thể tải ảnh lên Cloudinary", 500));
        }

        uploadedImages.push({
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        });
    }

    // Tạo loại dịch vụ mới với thông tin ảnh từ Cloudinary
    const newServiceCate = await ServiceCate.create({
        serviceCateName,
        serviceCateImage: uploadedImages,
        descriptionservice,
    });

    res.status(200).json({
        success: true,
        message: "Loại dịch vụ được thêm thành công",
        data: newServiceCate,
    });
});


//Lấy tất cả loại dịch vụ
export const getallServiceCate = catchAsyncErrors(async(req, res, next) => {
    const serviceCates = await ServiceCate.find()

    res.status(200).json({
        success: true,
        data: serviceCates
    })
})

//Hoạt động loại dịch vụ
export const getActiveServiceCates = catchAsyncErrors(async (req, res, next) => {
    const serviceCates = await ServiceCate.find({ isActive: true });

    res.status(200).json({
        success: true,
        data: serviceCates,
    });
})

//Hiển thị loai dịch vụ chi tiết từng id
export const getServiceCateById = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const serviceCate = await ServiceCate.findById(id);

    if (!serviceCate) {
        return next(new ErrorHandler("Không tìm thấy loại dịch vụ", 404));
    }

    res.status(200).json({
        success: true,
        data: serviceCate,
    });
});


//Cập nhật dịch vụ
export const updateServiceCate = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { serviceCateName, descriptionservice} = req.body;

    // Tìm loại dịch vụ cần cập nhật
    const serviceCate = await ServiceCate.findById(id);
    if (!serviceCate) {
        return next(new ErrorHandler("Không tìm thấy loại dịch vụ", 404));
    }
        // Kiểm tra nếu có upload ảnh mới
        if (req.files && req.files.serviceCateImage) {
        const { serviceCateImage } = req.files;
        const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

        // Kiểm tra định dạng ảnh
        if (!allowedFormats.includes(serviceCateImage.mimetype)) {
            return next(new ErrorHandler("Định dạng ảnh không được hỗ trợ", 400));
        }

        // Xóa ảnh cũ trên Cloudinary nếu có
        if (serviceCate.serviceCateImage?.public_id) {
            await cloudinary.uploader.destroy(serviceCate.serviceCateImage.public_id);
        }

        // Upload ảnh mới lên Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(
            serviceCateImage.tempFilePath,
            { folder: "service_categories" }
        );

        if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown error");
            return next(new ErrorHandler("Không thể tải ảnh lên Cloudinary", 500));
        }

        // Cập nhật thông tin ảnh trong đối tượng dịch vụ
        serviceCate.serviceCateImage = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        };
    }

    // Cập nhật tên loại dịch vụ nếu có
    if (serviceCateName) {
        serviceCate.serviceCateName = serviceCateName;
    }
    if (descriptionservice) {
        serviceCate.descriptionservice = descriptionservice;
    }
    // Lưu lại thay đổi vào database
    await serviceCate.save();

    res.status(200).json({
        success: true,
        message: "Cập nhật loại dịch vụ thành công",
        data: serviceCate,
    });
});


//cập nhật trạng thái loại dịch vụ
export const disableServiceCate = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const serviceCate = await ServiceCate.findById(id);
    if (!serviceCate) {
        return next(new ErrorHandler("Không tìm thấy loại dịch vụ", 404));
    }

    // Vô hiệu hóa loại dịch vụ
    serviceCate.isActive = !serviceCate.isActive;
    await serviceCate.save();

    // Vô hiệu hóa tất cả dịch vụ thuộc loại này
    await Service.updateMany({ serviceType: id }, { isActive: serviceCate.isActive });

    res.status(200).json({
        success: true,
        message: "Loại dịch vụ và các dịch vụ liên quan đã bị ẩn",
    })
})