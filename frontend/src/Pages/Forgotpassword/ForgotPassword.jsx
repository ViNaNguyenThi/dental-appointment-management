/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
// import { motion } from "framer-motion";
import axios from 'axios'; // Nhớ import axios nếu bạn dùng nó
//import Input from "../../components/Input.jsx";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets.js";

import './Forgot_Reset.css'

const API_URL = "http://localhost:4000/api/v1/user"; // dòng này là dòng dắt tới api

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [message, setMessage] = useState("");

	// Hàm forgotPassword xử lý gọi API
	const forgotPassword = async (email) => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await axios.post(`${API_URL}/forgot-password`, {
				email,
				withCredentials: true,
			});
			setMessage(response.data.message); // Có thể trả về thông điệp từ server
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			setError(error.response?.data?.message || "Error sending reset password email");
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		await forgotPassword(email);
		setIsSubmitted(true);
	};

	return (
		<div className="forgot-container">
			<div className="image-container-forgot">
				<img src={assets.loginpatient} alt="login" />
			</div>
			{/* <motion.div
				initial={{ x: -100 }} // Vị trí bắt đầu
				animate={{ x: 0 }} // Vị trí kết thúc
				exit={{ x: -100 }} // Vị trí ra khỏi
				transition={{ duration: 0.5 }} // Thời gian chuyển động
				className='image-container-forgot'
			>
			</motion.div> */}
			<div className='forgot-form'>
				{/* <h2 className='forgot-title'>
					Forgot Password
				</h2> */}

				{!isSubmitted ? (
					<form onSubmit={handleSubmit}>
						<h1>QUÊN MẬT KHẨU</h1>
						<p>Vui lòng nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu.</p>

						<div className="input-icon-container">
							<Mail className="input-icon" />
							<input
								type='email'
								placeholder='Địa chỉ Email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="input-box-with-icon"
							/>
						</div>

						{/* <input
							type='email'
							placeholder='Địa chỉ Email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="input-box"
						/> */}
						{/* <motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
							type='submit'
						>
							{isLoading ? <Loader className='size-6 animate-spin mx-auto' /> : "Send Reset Link"}
						</motion.button> */}


						<button type="submit" className="btn-primary-forgot">
							{isLoading ? <Loader className='size-6 animate-spin mx-auto' /> : "Gửi liên kết đặt lại mật khẩu"}
						</button>

						{error && <p className='text-red-500 mt-4 text-center'>{error}</p>}
					</form>
				) : (
					<div className='text-center'>
						{/* <motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ type: "spring", stiffness: 500, damping: 30 }}
							className='w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4'
						>
							<Mail className='h-8 w-8 text-white' />
						</motion.div> */}
						<h1>Hãy kiểm tra hộp thư thoại email của bạn</h1>
						<p>
							{message ? message : `Nếu tài khoản tồn tại cho ${email}, bạn sẽ nhận được liên kết đặt lại mật khẩu trong thời gian sớm nhất.`}
						</p>
					</div>
				)}
				<Link to="/login" className='backHome'>
					&larr; Quay về trang đăng nhập
				</Link>
			</div>

			{/* <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
				<Link to={"/login"} className='text-sm text-green-400 hover:underline flex items-center'>
					<ArrowLeft className='h-4 w-4 mr-2' /> Back to Login
				</Link>
			</div> */}

		</div>
	);
};
export default ForgotPassword;
