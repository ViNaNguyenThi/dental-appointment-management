import express from "express";
import { getMonthlyStatsAPI } from "../controller/reportController.js"
import { isAdminAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.get("/report/:month/:year", getMonthlyStatsAPI)

export default router