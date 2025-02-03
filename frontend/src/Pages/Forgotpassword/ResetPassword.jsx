// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
// import { motion } from "framer-motion";
// eslint-disable-next-line no-unused-vars
import { useNavigate, useParams } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
import { Lock } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../assets/assets.js";

import './Forgot_Reset.css'
// Định nghĩa API_URL
const API_URL = "http://localhost:4000/api/v1/user";

const ResetPassword = () => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	// eslint-disable-next-line no-unused-vars
	const [error, setError] = useState(null);
	const [message, setMessage] = useState(null);

	const { token } = useParams();
	const navigate = useNavigate();

	// Hàm reset password
	const resetPassword = async (token, password) => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await axios.post(`${API_URL}/reset-password/${token}`, { 
				password,
				withCredentials: true,

			});
			setMessage(response.data.message);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			setError(error.response?.data?.message || "Error resetting password");
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			toast.warning("Mật khẩu không trùng khớp");
			return;
		}
		try {
			await resetPassword(token, password);

			toast.success("Đặt lại mật khẩu thành công");
			setTimeout(() => {
				navigate("/login");
			}, 2000);
		} catch (error) {
			console.error(error);
			toast.error(error.message || "Lỗi đặt lại mật khẩu");
		}
	};

	return (
		<div className="forgot-container">
			<div className="image-container-forgot">
				<img src={assets.loginpatient} alt="login" />
			</div>
			{/* <motion.div
				initial={{ x: -100 }}
				animate={{ x: 0 }}
				exit={{ x: -100 }}
				transition={{ duration: 0.5 }}
				className='image-container-forgot'
			>
			</motion.div> */}
			<div className='forgot-form'>
				<h1>Đặt lại mật khẩu</h1>
				{/* {error && <p className='error-message'>{error}</p>} */}
				{message && <p className='success-message'>{message}</p>}

				<form onSubmit={handleSubmit}>
					<div className="input-icon-container">
						<Lock className="input-icon" />
						<input
							type='password'
							placeholder='Mật khẩu mới'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="input-box-with-icon"
						/>
					</div>
					<div className="input-icon-container">
						<Lock className="input-icon" />
						<input
							type='password'
							placeholder='Xác nhận mật khẩu mới'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
							className="input-box-with-icon"
						/>
					</div>

					<button type="submit" className="btn-primary-forgot" disabled={isLoading}>
						{isLoading ? "Đang đặt lại..." : "Đặt mật khẩu mới"}
					</button>
				</form>
			</div>
			<ToastContainer/>
		</div>
	);
};
export default ResetPassword;
