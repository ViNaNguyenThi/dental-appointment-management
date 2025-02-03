import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import '../Pages/ContactUs/ContactUs.css'

const MessageForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleMessage = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(
          "http://localhost:4000/api/v1/message/send",
          { name, email, phone, message },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => {
          toast.success(res.data.message);
          setName("")
          setEmail("")
          setPhone("")
          setMessage("")
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="body-lh">
      <div className="contact-form">
        <h3 className="lato-bold">
          HÃY LIÊN HỆ NGAY CHO CHÚNG TÔI
        </h3>
        <h3 className="lato-bold">
          NẾU BẠN CÓ BẤT KÌ CÂU HỎI HOẶC YÊU CẦU GÌ
        </h3>
        <form onSubmit={handleMessage}>
          <div>
            <input
              type="text"
              placeholder="Họ và Tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <textarea
            rows={4}
            placeholder="Lời nhắn"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button type="submit">Gửi thông tin</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageForm;
