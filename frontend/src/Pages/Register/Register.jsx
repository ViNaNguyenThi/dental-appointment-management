import axios from "axios";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../../main";
import { Navigate, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets.js";
import "./Register.css";
import { Link } from "react-router-dom";  // Import Link
import Password from "../../components/Input/Password"; // Giả sử bạn đã tạo component Password

const Register = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigateTo = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState(""); // Thêm confirmPassword

  const handleRegistration = async (e) => {
    e.preventDefault();
     // Kiểm tra từng trường nhập liệu
  if (!name) {
    toast.error("Vui lòng nhập tên đăng nhập!");
    return;
  }
  if (!email) {
    toast.error("Vui lòng nhập email!");
    return;
  }
  if (!email.includes("@")) {
    toast.error("Email phải chứa ký tự '@'!");
    return;
  }
  if (!password) {
    toast.error("Vui lòng nhập mật khẩu!");
    return;
  }
  if (!confirmPassword) {
    toast.error("Vui lòng nhập lại mật khẩu!");
    return;
  }

  // Kiểm tra mật khẩu trùng khớp
  if (password !== confirmPassword) {
    toast.error("Mật khẩu không khớp!");
    return;
  }

    try {
      await axios
        .post(
          "http://localhost:4000/api/v1/user/patient/register",
          { name, email, password, role: "Patient" },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => {
          toast.success(res.data.message);
          setIsAuthenticated(true);
          navigateTo("/");
          setName("");
          setEmail("");
          setPassword("");
          setConfirmPassword(""); // Reset confirmPassword
        });
    } catch (error) {
      console.error(error)
      toast.error(error.response.data.message);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  const handleLoginRedirect = () => {
    navigateTo("/login"); // Thay /register bằng đường dẫn trang đăng ký của bạn
  };

  return (
    <div className="signup-container">
      <div className="signup-form lato-bold">
        <h1 className="lato-bold">Đăng Ký</h1>
        <form onSubmit={handleRegistration} noValidate>
          <p>Tên đăng nhập <span style={{ color: 'red' }}>*</span></p>
          <input
            type="text"
            className="input-box"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p>Email <span style={{ color: 'red' }}>*</span></p>
          <input
            type="email"
            className="input-box"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p>Mật khẩu <span style={{ color: 'red' }}>*</span></p>
          <Password
            type="password"
            className="input-box"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p>Nhập lại mật khẩu <span style={{ color: 'red' }}>*</span></p>
          <Password
            type="password"
            className="input-box"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className="button-dk">
            <button type="submit" className="btn-primary-signup lato-bold">
              Đăng Ký
            </button>
          </div>
          <div className="create-account-signup">
            Bạn đã có tài khoản? {" "}
            <a onClick={handleLoginRedirect} className="link-create-signup lato-bold">
              Đăng Nhập
            </a>
          </div>
        </form>
      </div>
      <div className="image-container-signup">
        <img src={assets.logo} alt="register" />
      </div>
    </div>
  );
};

export default Register;
