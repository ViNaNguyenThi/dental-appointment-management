import express from "express"
import { createPatientRecord, getPatientRecordsByPatientId} from "../controller/patientRecordController.js"
import { isDoctorAuthenticated, isPatientAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/createpatientrecord", isDoctorAuthenticated, createPatientRecord)
router.get("/getpatientrecord/:userId", getPatientRecordsByPatientId);
export default router