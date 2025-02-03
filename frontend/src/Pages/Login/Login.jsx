import axios from "axios";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../../main";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { assets } from "../../assets/assets.js";
import "./Login.css";
import Password from "../../components/Input/Password"; // Giả sử bạn đã tạo component Password

const Login = () => {
  console.log("Component Login mounted");

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigateTo = useNavigate();
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const googleLoginSuccess = queryParams.get("googleLoginSuccess");
    console.log("Google Login Success:", googleLoginSuccess); // Log kiểm tra

    if (googleLoginSuccess) {
      toast.success("Đăng nhập bằng Google thành công!");
      setIsAuthenticated(true);
      navigateTo("/", { replace: true });
    }
  }, [navigateTo, setIsAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu email hoặc password bị bỏ trống
    if (!email.trim()) {
      toast.error("Vui lòng nhập email!");
      return;
    }

    if (!password.trim()) {
      toast.error("Vui lòng nhập mật khẩu!");
      return;
    }

    // Kiểm tra định dạng email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Email phải chứa ký tự '@'!");
      return;
    }

    try {
      await axios
        .post(
          "http://localhost:4000/api/v1/user/login",
          { email, password, role: "Patient" },
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
      console.error(error);
      toast.error(error.response.data.message);
    }
  };
  const handleGoogleLogin = () => {
    window.location.href = `http://localhost:4000/api/v1/user/google`;
  };
  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }
  const handleRegister = () => {
    navigateTo("/register"); // Thay /register bằng đường dẫn trang đăng ký của bạn
  };

  return (
    <div className="login-container">
      <div className="image-container">
        <img src={assets.loginpatient} alt="login" />
      </div>
      {/* <motion.div
        className="image-container"
        initial={{ x: -100 }} // Vị trí bắt đầu
        animate={{ x: 0 }} // Vị trí kết thúc
        exit={{ x: -100 }} // Vị trí ra khỏi
        transition={{ duration: 0.5 }} // Thời gian chuyển động
      ></motion.div> */}

      <div className="login-form lato-bold">
        <h1 className="lato-bold">Đăng Nhập</h1>
        <form onSubmit={handleLogin}>
          {/* <input type="email" id="email" name="email" placeholder="Email" required />
          <input type="password" id="password" name="password" placeholder="Mật khẩu" required />
          <a href="#" className="forgot-password">Quên mật khẩu?</a>
          <button type="submit" className="btn-submit">Đăng nhập</button> */}
          <p>
            Email <span style={{ color: "red", fontSize: "28px" }}>*</span>
          </p>
          <input
            type="text"
            className="input-box"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p>
            Mật khẩu <span style={{ color: "red", fontSize: "28px" }}>*</span>
          </p>
          <Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="password-box"
          />
          <p className="forgot-password">
            <Link to="/forgot-password" className="link lato-regular">
              Quên mật khẩu
            </Link>
          </p>
          <button type="submit" className="btn-primary lato-bold">
            Đăng Nhập
          </button>
          {/* <div className="create-account">
            Bạn chưa có tài khoản? {" "}
            <Link to="/signup" className="link-create">
              Đăng ký
            </Link>
          </div> */}
          <div className="create-account">
            Bạn chưa có tài khoản? {""}
            <a onClick={handleRegister} className="link-create">
              Đăng Ký
            </a>
          </div>
        </form>
        <div className="social-login">
          <button className="google-btn" onClick={handleGoogleLogin}>
            <img src={assets.gg} alt="login" />
            Đăng nhập bằng Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
