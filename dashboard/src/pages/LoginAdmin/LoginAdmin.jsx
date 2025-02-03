// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../../main";
import axios from "axios";
import loginadmin from '../../asset/images/login_admin_1.jpg'
import './LoginAdmin.css'
import Password from "../../components/Input/Password"; // Giả sử bạn đã tạo component Password

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(
          "http://localhost:4000/api/v1/user/login",
          { email, password, role: "Admin" },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => {
          toast.success(res.data.message);
          setIsAuthenticated(true);
          navigateTo("/");
          setEmail("");
          setPassword("");
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <section className="login-container-admin lato-bold">
        <div className="image-container-admin">
          <img src={loginadmin} alt="login" />
        </div>
        <div className="login-form-admin lato-bold">
          <h1>Đăng Nhập Quản Trị Viên</h1>
          <form onSubmit={handleLogin}>
            <p>Email <span style={{ color: 'red', fontSize: '28px' }}>*</span></p>
            <input
              type="text"
              className="input-box-admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p>Mật khẩu <span style={{ color: 'red', fontSize: '28px' }}>*</span></p>
            <Password
              type="password"
              className='password-box-admin'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
              <button type="submit" className="btn-primary-admin lato-bold">Đăng Nhập</button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;
