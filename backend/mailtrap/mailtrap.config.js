// backend/nodemailer.config.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({path : "./config/.env"});

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g., smtp.gmail.com for Gmail
  port: process.env.SMTP_PORT, // e.g., 587 for secure SMTP
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // Your email
    pass: process.env.SMTP_PASS, // Your email password or app password
  },
});


// import { MailtrapClient as MailtrapClientSDK } from "mailtrap"; // Đổi tên khai báo để tránh trùng lặp
// import dotenv from "dotenv";

// dotenv.config();

// export const mailtrapClient = new MailtrapClientSDK({
//   token: process.env.MAILTRAP_TOKEN,
//   endpoint: process.env.MAILTRAP_ENDPOINT
// });

// export const sender = {
//   email: "hello@demomailtrap.com",
//   name: "Bệnh viện",
// };

// // mailtrap.config.js
// import axios from 'axios';

// const client = axios.create({
//   baseURL: 'https://sandbox.api.mailtrap.io/api/send/3269811',  // Địa chỉ API của Mailtrap
//   headers: {
//     'Authorization': `Bearer ${process.env.MAILTRAP_API_KEY}`,  // Đảm bảo API Key đúng
//   },
// });

// const sender = {
//   email: 'hello@example.com', // Thay bằng email của bạn
//   name: 'Bệnh viện',
// };

// export { client, sender };


// Gửi email
// client.testing
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log)  // In kết quả thành công
//   .catch(console.error);  // In lỗi nếu có




//const { MailtrapClient } = require("mailtrap");
//import { MailtrapClient as MailtrapClientSDK } from "mailtrap";
//const TOKEN = "ece6c3d9a4ee72de7631710bac6325c2";

// export const client = new MailtrapClient({
//   token: TOKEN,
// });

// export const sender = {
//   email: "hello@demomailtrap.com",
//   name: "Mailtrap Test",
// };
//  export const recipients = [
//   {
//     email: "baduatuilathreebagsne@gmail.com",
//   }
// ];

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);

// const recipients = [
//   {
//     email: "nguyenthivina0511@gmail.com",
//   }
// ];

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);

