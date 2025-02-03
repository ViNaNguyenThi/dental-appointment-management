import express from "express";
import { deleteAppointment, getAppointmentDetails, getAllAppointments,DoctorgetAcceptedAppointments, postAppointment, updateAppointmentStatus, countAppointments, DoctorgetPendingAppointments, DoctorupdateAppointmentStatus, getBookedTime } from "../controller/appointmentController.js";
import { isAdminAuthenticated,isPatientAuthenticated, isDoctorAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/post",isPatientAuthenticated, postAppointment);
router.get("/getall",isAdminAuthenticated, getAllAppointments);
router.get("/getpendingappointments", isDoctorAuthenticated, DoctorgetPendingAppointments);
router.get("/getacceptedappointments", isDoctorAuthenticated, DoctorgetAcceptedAppointments);
router.get("/getappointment/:id", isDoctorAuthenticated, getAppointmentDetails);
router.put("/update/:id",isAdminAuthenticated, updateAppointmentStatus);
router.put("/doctorupdate/:id", isDoctorAuthenticated, DoctorupdateAppointmentStatus);
router.delete("/delete/:id",isAdminAuthenticated, deleteAppointment);
router.get("/count", countAppointments);
router.get("/getbookedtime", getBookedTime);

//router.get("/historyappointments/:userId",getAppointmentHistory);
export default router;