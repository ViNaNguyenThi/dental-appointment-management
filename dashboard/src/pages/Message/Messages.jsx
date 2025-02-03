import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import './Messages.css'

const Messages = () => {
  const [message, setMessages] = useState([]);
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    const fetchMessages = async () => {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/message/getall",
          { withCredentials: true }
        );
        console.log(data)
        setMessages(data.message);
    };
    fetchMessages();
  }, []);

  if (!isAuthenticated) {
    toast.info("Chưa đăng nhập");
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page messages">
      <h1>MESSAGE</h1>
      <div className="banner">
        {message && message.length > 0 ? (
          message.map((element) => (
            <div className="card" key={element._id}>
              <div className="details">
                <p>
                  Tên: <span>{element.name}</span>
                </p>
                <p>
                  Email: <span>{element.email}</span>
                </p>
                <p>
                  Số điện thoại: <span>{element.phone}</span>
                </p>
                <p>
                 Tin nhắn: <span>{element.message}</span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <h1>No Messages!</h1> // Hiển thị khi không có tin nhắn nào
        )}
      </div>
    </section>
  );
};

export default Messages;