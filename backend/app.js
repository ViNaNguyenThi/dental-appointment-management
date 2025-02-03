import  express from "express";
import {config} from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js"
import serviceRouter from "./router/serviceRouter.js"
import appointmentRouter from "./router/appointmentRouter.js"
import followUpAppointmentRouter from "./router/followupappointmentRouter.js";

import reportRouter from "./router/reportRouter.js";
import patientRecordRouter from "./router/patientrecordRouter.js"
import session from "express-session"; 
import passport from "passport"; 
import "./passport.js"; 

const app = express();
config({path : "./config/.env"})

app.get("/test", async (req , res ) => {
    res.json({ message : "Hello!" })
});
app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL, process.env.DOCTOR_URL],
    method: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
// Cấu hình express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
  // Khởi tạo Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}))

app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment",appointmentRouter);
app.use("/api/v1/service", serviceRouter)
app.use("/api/v1/patient", patientRecordRouter)
app.use("/api/v1/followupappointment", followUpAppointmentRouter);
app.use("/api/v1/report", reportRouter);

dbConnection();

export default app;