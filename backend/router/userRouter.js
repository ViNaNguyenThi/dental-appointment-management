import express from "express"
import passport from "passport";
import { generateToken } from '../utils/jwtToken.js'; 

import { addNewAdmin, addNewDoctor, getAllDoctors, getFourDoctors, getUserDetails, login, logoutDoctor, logoutAdmin, logoutPatient, patientRegister, countDoctors, getUser, updateUser, forgotPassword, resetPassword, updateDoctor, deleteDoctor, getDoctorById } from "../controller/userController.js";
import { isAdminAuthenticated,isPatientAuthenticated, isDoctorAuthenticated } from "../middlewares/auth.js";   
const router = express.Router();

router.post("/patient/register", patientRegister)
router.post("/login", login);
router.post("/admin/addnew",isAdminAuthenticated,addNewAdmin);
router.get("/doctors",getAllDoctors);
router.get("/fourdoctors",getFourDoctors);
router.get("/admin/me",isAdminAuthenticated,getUserDetails);
router.get("/patient/me",isPatientAuthenticated,getUserDetails);
router.get("/doctor/me",isDoctorAuthenticated,getUserDetails);
router.get("/admin/logout",isAdminAuthenticated,logoutAdmin);
router.get("/doctor/logout",isDoctorAuthenticated,logoutDoctor);
router.get("/patient/logout",isPatientAuthenticated,logoutPatient);
router.post("/doctor/addnew",isAdminAuthenticated, addNewDoctor);
router.get("/doctors/count", countDoctors);
router.get("/getdoctordetail/:id",getDoctorById);

router.put("/doctor/update/:doctorId",updateDoctor);
router.delete("/doctor/delete/:doctorId",deleteDoctor);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/login", // Nếu xác thực thất bại
    }),
    (req, res) => {
        // Gọi hàm generateToken để tạo JWT và lưu vào cookie tương ứng
        generateToken(req.user, res);

        res.redirect("http://localhost:5173/?googleLoginSuccess=true");
    }
);

//quên mật khẩu
router.post("/forgot-password",forgotPassword);
router.post("/reset-password/:token",resetPassword);

router.put("/updateuser/:userId", updateUser);
router.get("/getdetailuser/:userId", getUser );

export default router;