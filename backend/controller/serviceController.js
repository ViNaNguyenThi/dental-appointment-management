import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { ServiceCate } from "../models/servicecateSchema.js";
import { Service } from "../models/serviceSchema.js";

// Hàm tạo dịch vụ mới
export const createService = catchAsyncErrors(async (req, res, next) => {
    const { serviceType, serviceName, servicePrice } = req.body;
  
    // Kiểm tra các field có đủ không
    if (!serviceType || !serviceName || !servicePrice) {
      return next(new ErrorHandler("Vui lòng cung cấp đầy đủ thông tin dịch vụ", 400));
    }
  
    // Kiểm tra xem loại dịch vụ có tồn tại không
    const category = await ServiceCate.findById(serviceType);
    if (!category) {
      return next(new ErrorHandler("Loại dịch vụ không tồn tại", 404));
    }
  
    // Tạo dịch vụ mới
    const newService = await Service.create({
      serviceType,
      serviceName,
      servicePrice,
    });
  
    res.status(200).json({
      success: true,
      message: "Dịch vụ mới đã được tạo thành công",
      data: newService,
    });
  })


  //Hàm hiển thị dịch vụ khi trạng thái hoạt động
  export const getActiveServices = catchAsyncErrors(async (req, res, next) => {
    const services = await Service.find({ isActive: true }).populate('serviceType');
    
    res.status(200).json({
        success: true,
        data: services,
    })
})

// Lấy tất cả dịch vụ hoặc lọc theo serviceTypeId
export const getAllServices = catchAsyncErrors(async (req, res, next) => {
  const { id: serviceTypeId } = req.params; // Lấy serviceTypeId từ params

  const query = serviceTypeId ? { serviceType: serviceTypeId } : {};
  const services = await Service.find(query).populate('serviceType'); // populate đúng tên trường ref

  res.status(200).json({
    success: true,
    data: services,
  });
});


//Hàm sửa dịch vụ
export const updateService = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { serviceType, serviceName, servicePrice } = req.body;

  let service = await Service.findById(id);
  if (!service) {
    return next(new ErrorHandler("Dịch vụ không tồn tại", 404));
  }

  // Cập nhật thông tin dịch vụ
  service.serviceType = serviceType || service.serviceType;
  service.serviceName = serviceName || service.serviceName;
  service.servicePrice = servicePrice || service.servicePrice;

  await service.save();

  res.status(200).json({
    success: true,
    message: "Dịch vụ đã được cập nhật thành công",
    data: service,
  });
});


//Hàm xóa dịch vụ
export const deleteService = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const service = await Service.findById(id);
  if (!service) {
      return next(new ErrorHandler("Dịch vụ không tồn tại", 404));
  }

  await Service.findByIdAndDelete(id);

  res.status(200).json({
      success: true,
      message: "Dịch vụ đã được xóa thành công",
  });
});


// Hàm cập nhật trạng thái `isActive`
export const toggleServiceStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  let service = await Service.findById(id);
  if (!service) {
    return next(new ErrorHandler("Dịch vụ không tồn tại", 404));
  }

  // Đảo ngược trạng thái `isActive`
  service.isActive = !service.isActive;
  await service.save();

  res.status(200).json({
    success: true,
    message: `Trạng thái dịch vụ đã được cập nhật thành công`,
    data: service,
  })
})



