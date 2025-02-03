import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../../main";
import { Navigate } from "react-router-dom";
import "./Doctors.css";
import Sidebar from "../../components/Sidebar/Sidebar";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true); // Trạng thái đang tải
  const { isAuthenticated } = useContext(Context);
  const [selectedDoctor, setSelectedDoctor] = useState(null); // Lưu bác sĩ được chọn để chỉnh sửa
  const [modalOpen, setModalOpen] = useState(false); // Trạng thái modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // Trạng thái modal xóa
  const [isSaving, setIsSaving] = useState(false); // Trạng thái cho lưu bác sĩ
  const [isDeleting, setIsDeleting] = useState(false); // Trạng thái cho xóa bác sĩ

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/doctors",
          { withCredentials: true }
        );
        setDoctors(data.doctors);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Lỗi kết nối với máy chủ!";
        toast.error(errorMessage); // Thông báo lỗi
      } finally {
        setLoading(false); // Dừng trạng thái tải
      }
    };
    fetchDoctors();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  if (loading) {
    return <h1>Đang tải danh sách bác sĩ...</h1>;
  }

  const handleEditClick = (doctor) => {
    setSelectedDoctor(doctor); // Lưu bác sĩ được chọn
    setModalOpen(true); // Mở modal
  };

  const handleDeleteClick = (doctor) => {
    setSelectedDoctor(doctor); // Lưu bác sĩ được chọn để xóa
    setDeleteModalOpen(true); // Mở modal xác nhận xóa
  };

  const handleCloseModal = () => {
    setModalOpen(false); // Đóng modal chỉnh sửa
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false); // Đóng modal xóa
  };

  const handleSaveChanges = async (updatedDoctor) => {
    if (isSaving) return; // Ngăn spam nút lưu
    setIsSaving(true); // Bắt đầu trạng thái loading cho lưu

    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/user/doctor/update/${selectedDoctor._id}`,
        updatedDoctor,
        { withCredentials: true }
      );
      toast.success("Thông tin bác sĩ đã được cập nhật!");
      setDoctors(
        doctors.map((doctor) =>
          doctor._id === selectedDoctor._id ? data.doctor : doctor
        )
      );
      setModalOpen(false); // Đóng modal sau khi cập nhật thành công
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Lỗi cập nhật thông tin bác sĩ!";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false); // Kết thúc trạng thái loading
    }
  };

  const handleDeleteDoctor = async () => {
    if (isDeleting) return; // Ngăn spam nút xóa
    setIsDeleting(true); // Bắt đầu trạng thái loading cho xóa
    try {
      await axios.delete(
        `http://localhost:4000/api/v1/user/doctor/delete/${selectedDoctor._id}`,
        { withCredentials: true }
      );
      toast.success("Bác sĩ đã được xóa thành công!");
      setDoctors(doctors.filter((doctor) => doctor._id !== selectedDoctor._id));
      setDeleteModalOpen(false); // Đóng modal xác nhận xóa sau khi xóa thành công
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Lỗi xóa bác sĩ!";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false); // Kết thúc trạng thái loading
    }
  };

  return (
    <div style={{ marginLeft: "250px", padding: "20px" }}>
      <Sidebar />
      <section className="page doctors">
        <h1>DANH SÁCH BÁC SĨ</h1>
        <div className="banner">
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <div className="card" key={doctor._id}>
                <img src={doctor.docAvatar?.url} alt="doctor avatar" />
                <h4>{`${doctor.name}`}</h4>
                <div className="details">
                  <p>
                    Email: <span>{doctor.email}</span>
                  </p>
                  <p>
                    Điện thoại: <span>{doctor.phone}</span>
                  </p>
                  <p>
                    Ngày sinh: <span>{doctor.dob.substring(0, 10)}</span>
                  </p>
                  <p>
                    Giới tính: <span>{doctor.gender}</span>
                  </p>
                  <button onClick={() => handleEditClick(doctor)}>
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => handleDeleteClick(doctor)}
                    className="delete-btn"
                  >
                    Xóa tài khoản
                  </button>
                </div>
              </div>
            ))
          ) : (
            <h1>Không tìm thấy bác sĩ nào!</h1>
          )}
        </div>

        {/* Modal chỉnh sửa bác sĩ */}
        {modalOpen && selectedDoctor && (
          <div className="modal">
            <div className="modal-content">
              <h2>Chỉnh sửa thông tin bác sĩ</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const updatedDoctor = {
                    name: e.target.name.value,
                    email: e.target.email.value,
                    phone: e.target.phone.value,
                    dob: e.target.dob.value,
                    gender: e.target.gender.value,
                    Introduceyourself: e.target.Introduceyourself.value,
                  };
                  handleSaveChanges(updatedDoctor);
                }}
              >
                <label>Tên bác sĩ:</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={selectedDoctor.name}
                />
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={selectedDoctor.email}
                />
                <label>Điện thoại:</label>
                <input
                  type="text"
                  name="phone"
                  defaultValue={selectedDoctor.phone}
                />
                <label>Ngày sinh:</label>
                <input
                  type="date"
                  name="dob"
                  defaultValue={selectedDoctor.dob.substring(0, 10)}
                />
                <label>Giới tính:</label>
                <select name="gender" defaultValue={selectedDoctor.gender}>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
                <label>Giới thiệu bản thân:</label>
                <textarea
                  name="Introduceyourself"
                  defaultValue={selectedDoctor.Introduceyourself}
                ></textarea>
                <div className="modal-actions">
                  <button type="button" onClick={handleCloseModal}>
                    Hủy
                  </button>
                  <button type="submit" disabled={isSaving}>
                    {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal xác nhận xóa bác sĩ */}
        {deleteModalOpen && selectedDoctor && (
          <div className="modal">
            <div className="modal-content">
              <h2>Xác nhận xóa tài khoản</h2>
              <p>
                Bạn có chắc chắn muốn xóa tài khoản của bác sĩ{" "}
                <strong>{selectedDoctor.name}</strong> không?
              </p>
              <div className="modal-actions">
                <button onClick={handleCloseDeleteModal}>Hủy</button>
                <button
                  onClick={handleDeleteDoctor}
                  className="delete-confirm-btn"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Doctors;
