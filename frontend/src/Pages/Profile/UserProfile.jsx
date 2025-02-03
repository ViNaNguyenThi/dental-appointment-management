// eslint-disable-next-line no-unused-vars
import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import NavbarProfile from "../../components/Navbar/NavbarProfile.jsx";
import "./UserProfile.css";
import { Context } from "../../main.jsx";

const UserProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useContext(Context);

  const userId = user._id;
  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/user/getdetailuser/${userId}`
      );
      const { name, email, phone, dob, gender, address } = response.data;
      setName(name);
      setEmail(email);
      setPhone(phone);
      setBirthday(dob ? dob.split("T")[0] : "");
      setGender(gender);
      setAddress(address);
    } catch (error) {
      console.error(
        "Error fetching user data:",
        error.response || error.message
      );
    }
  };

  useEffect(() => {
    if (!userId) {
      return;
    }
    fetchUser();
  }, [userId]);

  // eslint-disable-next-line no-unused-vars
  const handleUpdate = async (e) => {
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (age < 18 || (age === 18 && monthDifference < 0)) {
      alert("Bạn phải từ 18 tuổi trở lên.");
      return;
    }
    try {
      const updatedUserData = { name, email, phone, dob, gender, address };

      await axios.put(
        `http://localhost:4000/api/v1/user/updateuser/${userId}`,
        updatedUserData
      );
      alert("Cập nhật thông tin thành công");
      setIsModalOpen(false);
      await fetchUser();
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error);
      // alert("Cập nhật thông tin thất bại");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="all_profile">
        <NavbarProfile />

        <div className="nd_profile">
          <h2>THÔNG TIN KHÁCH HÀNG</h2>

          <div className="muc_profile">
            <label>Tên </label>
            <div className="value_profile">{name}</div>
          </div>

          <div className="muc_profile">
            <label>Email </label>
            <div className="value_profile">{email}</div>
          </div>

          <div className="muc_profile">
            <label>Số điện thoại </label>
            <div className="value_profile">{phone}</div>
          </div>

          <div className="muc_profile">
            <label>Ngày sinh </label>
            <div className="value_profile">
              {dob ? new Date(dob).toLocaleDateString() : ""}
            </div>
          </div>

          <div className="muc_profile">
            <label>Giới tính </label>
            <div className="value_profile">{gender}</div>
          </div>

          <div className="muc_profile">
            <label>Địa chỉ </label>
            <div className="value_profile">{address}</div>
          </div>

          <div className="muc_profile_btn">
            <button
              className="btnedit_profile"
              onClick={() => setIsModalOpen(true)}
            >
              Cập nhật
            </button>
          </div>
        </div>

        {isModalOpen && (
          <div className="modalall_profile">
            <div className="modal_profile">
              <h2>CHỈNH SỬA THÔNG TIN</h2>

              <div className="dialong_content_profile">
                <div className="input_profile">
                  <label>Tên khách hàng</label>

                  <input
                    className="nd_dialong_profile"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="input_profile">
                  <label>Email</label>

                  <input
                    disabled
                    className="nd_dialong_profile"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="input_profile">
                  <label>Số điện thoại</label>

                  <input
                    className="nd_dialong_profile"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="input_profile">
                  <label>Ngày sinh</label>

                  <input
                    className="nd_dialong_profile"
                    type="date"
                    value={dob}
                    onChange={(e) => setBirthday(e.target.value)}
                    required
                  />
                </div>

                <div className="input_profile">
                  <label>Giới tính</label>

                  <select
                    value={gender || ""}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>

                <div className="input_profile">
                  <label>Địa chỉ</label>

                  <input
                    className="nd_dialong_profile"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="dialog_btn_profile">
                <button onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button onClick={handleUpdate}>Lưu</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
