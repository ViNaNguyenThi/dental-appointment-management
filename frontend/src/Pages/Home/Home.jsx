import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.jsx";
import "./Home.css";
import { assets } from "../../assets/assets.js";
import Footer from "../../components/Footer/Footer.jsx";
import axios from "axios";
import ImageSlider from "../../components/ImageSliderHome/ImageSliderHome.jsx";
import AOS from "aos"; // Import AOS
import "aos/dist/aos.css"; // Import AOS CSS
const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const slidesPerPage = 3;
  const [doctors, setDoctors] = useState([]);
  const [, setIsScrollingDisabled] = useState(false); // Trạng thái để kiểm soát cuộn
  const introTextRef = useRef(null);
  const navigate = useNavigate();

  // Tự động chuyển slide sau 3 giây
  useEffect(() => {
    AOS.init({
      duration: 1000, // Thời gian cho hiệu ứng
      easing: "ease-in-out", // Cách thức chuyển động
      once: true, // Chỉ chạy hiệu ứng một lần
    }); // Khởi tạo AOS
    AOS.refresh(); // Làm mới AOS

    // Cập nhật trạng thái cuộn
    const handleScroll = () => {
      if (introTextRef.current) {
        const rect = introTextRef.current.getBoundingClientRect();
        // Nếu phần "intro-text" hiện lên trong viewport, chặn cuộn
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          setIsScrollingDisabled(true); // Bắt đầu hiệu ứng, không cho cuộn
          setTimeout(() => setIsScrollingDisabled(false), 2000); // Sau 2 giây (khoảng thời gian của hiệu ứng), cho phép cuộn lại
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    // Kiểm tra nếu có dữ liệu doctors
    if (doctors.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide(
          (prevSlide) =>
            (prevSlide + 1) % Math.ceil(doctors.length / slidesPerPage)
        );
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [currentSlide, doctors]); // Thêm doctors vào danh sách phụ thuộc

  const moveToSlide = (slideIndex) => {
    if (slideIndex >= Math.ceil(doctors.length / slidesPerPage)) {
      setCurrentSlide(0);
    } else if (slideIndex < 0) {
      setCurrentSlide(Math.ceil(doctors.length / slidesPerPage) - 1);
    } else {
      setCurrentSlide(slideIndex);
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/doctors",
          {
            withCredentials: true, // Gửi cookie trong yêu cầu
          }
        );
        setDoctors(response.data.doctors || []);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bác sĩ:", error);
      }
    };
    fetchDoctors();
  }, []);

  const handleDoctorClick = (doctor) => {
    navigate(`/doctordetail/${doctor._id}`);
  };
  return (
    <div className="homepage-container">
      <Navbar />
      <section className="banner-main">
        <img src={assets.banner} alt="banner" className="img-main" />
      </section>

      <section
        className="why-choose-us"
        data-aos="fade-up"
        data-aos-duration="2000"
      >
        <div className="intro-text lato-bold" ref={introTextRef}>
          <p>
            <span className="staggered-line line-1">
              <span>Từ</span> <span>khoảnh</span> <span>khắc</span>{" "}
              <span>bạn</span> <span>đặt</span> <span>lịch</span>{" "}
              <span>hẹn</span> <span>cho</span> <span>đến</span>{" "}
              <span>khi</span> <span>hoàn</span> <span>tất</span>{" "}
              <span>liệu</span>
            </span>
            <span className="staggered-line line-2">
              <span>trình</span> <span>điều</span> <span>trị,</span>{" "}
              <span>bạn</span> <span>sẽ</span> <span>cảm</span>{" "}
              <span>nhận</span> <span>được</span> <span>sự</span>{" "}
              <span>khác</span> <span>biệt</span> <span>vượt</span>
            </span>
            <span className="staggered-line line-3">
              <span>trội</span> <span>tại</span> <span>nha</span>{" "}
              <span>khoa</span> <span>Mountain</span> <span>View.</span>
            </span>
          </p>
        </div>
        <hr
          className="divider-home"
          data-aos="fade-up"
          data-aos-duration="2000"
        />
        <div className="container-text-home" data-aos="fade-up">
          <h5 className="container-tittle-home lato-bold">
            Vì sao nên chọn chúng tôi?
          </h5>
          <h3 className="description-home lato-regular">
            Tại Mountain View, chúng tôi cam kết mang đến dịch vụ chăm sóc răng
            miệng tốt nhất cho mọi khách hàng. Chúng tôi giúp cải thiện sức khỏe
            răng miệng và thay đổi nụ cười của bạn với tẩy trắng, cấy ghép
            implant hay tái tạo nụ cười toàn diện. Hãy để chúng tôi đồng hành
            cùng bạn đạt được mục tiêu nha khoa.
          </h3>
        </div>
      </section>
      <ImageSlider />
      <section
        className="highlights-section"
        data-aos="fade-up"
        data-aos-duration="2000"
      >
        <div className="info-section">
          <div className="info-item" data-aos="fade-up">
            <div className="info-icon">
              <i className="icon-user">
                <img src={assets.people} />
              </i>
            </div>
            <h2 className="lato-bold">AN TOÀN NHẤT</h2>
            <h4 className="lato-regular">
              Đội ngũ bác sĩ tốt nghiệp chuyên khoa Răng – Hàm – Mặt tại Trường
              Đại Học Y Dược TP Hồ Chí Minh, đều trên 5.000h thực hành.
            </h4>
          </div>
          <div
            className="info-item"
            data-aos="fade-up"
            data-aos-duration="1500"
          >
            <div className="info-icon">
              <i className="icon-saving">
                <img src={assets.save_money} />
              </i>
            </div>
            <h2 className="lato-bold">TIẾT KIỆM NHẤT</h2>
            <h4 className="lato-regular">
              Chúng tôi luôn nghiên cứu để cho chi phí luôn tối ưu nhất, bình ổn
              giá và có hợp đồng rõ ràng minh bạch.
            </h4>
          </div>
          <div
            className="info-item"
            data-aos="fade-up"
            data-aos-duration="2000"
          >
            <div className="info-icon">
              <i className="icon-tooth">
                <img src={assets.tooth} />
              </i>
            </div>
            <h2 className="lato-bold">KHÔNG ĐAU NHẤT</h2>
            <h4 className="lato-regular">
              Công nghệ hiện đại như CT ConeBeam 3D, Scan 3D,... hỗ trợ giúp bác
              sĩ thực hiện nhanh chóng. Hạn chế đau – ê buốt.
            </h4>
          </div>
          <div
            className="info-item"
            data-aos="fade-up"
            data-aos-duration="2500"
          >
            <div className="info-icon">
              <i className="icon-heart">
                <img src={assets.dental_love} />
              </i>
            </div>
            <h2 className="lato-bold">LƯƠNG Y NHƯ</h2>
            <h2 className="lato-bold">TỪ MẪU</h2>
            <h4 className="lato-regular">
              Phẩm chất cao quý của Thầy thuốc theo tư tưởng Hồ Chí Minh – Kim
              chỉ nam của Alisa.
            </h4>
          </div>
        </div>
      </section>

      <section
        className="featured-services-section"
        data-aos="fade-up"
        data-aos-duration="2000"
      >
        <div className="content-section">
          <div className="header-content">
            <h1 className="lato-bold">DỊCH VỤ NỔI BẬT</h1>
          </div>
          <div className="line-divider"></div>
          <div className="body-content">
            <div className="service-item">
              <div className="service-img-wrapper">
                <img
                  src={assets.img}
                  alt="Chỉnh Nha - Niềng Răng"
                  className="service-img"
                />
              </div>
              <div className="service-title lato-bold">
                CHỈNH NHA - NIỀNG RĂNG
              </div>
            </div>
            <div className="service-item">
              <div className="service-img-wrapper">
                <img
                  src={assets.img2}
                  alt="Cấy Ghép Implant"
                  className="service-img"
                />
              </div>
              <div className="service-title lato-bold">CẤY GHÉP IMPLANT</div>
            </div>
            <div className="service-item">
              <div className="service-img-wrapper">
                <img
                  src={assets.img3}
                  alt="Mặt Dán Sứ Veneer"
                  className="service-img"
                />
              </div>
              <div className="service-title lato-bold">MẶT DÁN SỨ VENEER</div>
            </div>
            <div className="service-item">
              <div className="service-img-wrapper">
                <img
                  src={assets.img4}
                  alt="Dịch Vụ Tổng Quát"
                  className="service-img"
                />
              </div>
              <div className="service-title lato-bold">DỊCH VỤ TỔNG QUÁT</div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="doctor-introduction-section"
        data-aos="fade-up"
        data-aos-duration="2000"
      >
        <div className="house-container-home">
          <div className="roof-home"></div>
          <div className="house-body-home">
            <h1 className="lato-bold">NGÔI NHÀ CỦA NHỮNG CHUYÊN GIA</h1>
            <h3 className="lato-regular">
              Mountain View Dental tự hào là nơi hội tụ của nhiều chuyên gia
              hàng đầu trong Nha khoa. Không chỉ điều trị tốt nhất cho khách
              hàng, bác sĩ tại Mountain View Dental còn liên tục trau dồi kiến
              thức và thường xuyên tổ chức các buổi hội thảo, chia sẻ kiến thức
              nha khoa trong ngành.
            </h3>

            {doctors.length > 0 ? (
              <div className="slider-wrapper-home">
                <div className="doctor-slider-home" ref={sliderRef}>
                  <div
                    className="doctor-slider-track"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {doctors.map((doctor) => (
                      <div
                        key={doctor._id}
                        className="doctor-item-home"
                        onClick={() => handleDoctorClick(doctor)}
                      >
                        <img
                          src={doctor.docAvatar?.url || "/placeholder.jpg"}
                          alt={doctor.name}
                        />
                        <div className="doctor-name-home lato-regular">
                          <p>Bác sĩ</p> {doctor.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dots control */}
                <div className="slider-dots">
                  {[...Array(Math.ceil(doctors.length / slidesPerPage))].map(
                    (_, index) => (
                      <span
                        key={index}
                        className={`dot ${
                          index === currentSlide ? "active-dot" : ""
                        }`}
                        onClick={() => moveToSlide(index)}
                      ></span>
                    )
                  )}
                </div>
              </div>
            ) : (
              <p>Không có bác sĩ nào để hiển thị</p>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
