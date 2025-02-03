import express from "express";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
  isDoctorAuthenticated,
} from "../middlewares/auth.js";
import {
  getFollowUpAppointment,
  detailFollowUpAppointment,
  checkoutFollowUpAppointment,
  getCreatedFollowUpAppointment
} from "../controller/followUpAppointment.js";
const router = express.Router();

router.get(
  "/getfollowupappointment",
  isDoctorAuthenticated,
  getFollowUpAppointment
);
router.get(
  "/getcreatedfollowupappointment",
  isDoctorAuthenticated,
  getCreatedFollowUpAppointment
);
router.get(
  "/detailfollowupappointment/:id",
  isDoctorAuthenticated,
  detailFollowUpAppointment
);
// Để tạo mới phiếu tái khám khi có ngày tái khám (POST)
router.post(
  "/checkoutfollowupappointment",
  isDoctorAuthenticated,
  checkoutFollowUpAppointment
);

// Để cập nhật phiếu tái khám khi không có ngày tái khám (PUT)
router.put(
  "/checkoutfollowupappointment/:followUpAppointmentId",
  isDoctorAuthenticated,
  checkoutFollowUpAppointment
);

export default router;
