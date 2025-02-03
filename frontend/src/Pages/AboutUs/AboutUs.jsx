import Navbar from "../../components/Navbar/Navbar.jsx";
import "./AboutUs.css";
import { assets } from "../../assets/assets.js";
import Footer from "../../components/Footer/Footer.jsx";

const AboutUs = () => {
  return (
    <div>
      <Navbar /> {/* Sử dụng Navbar ở đây */}
      <div className="aboutus">
        <header className="header">
          <h2>GIỚI THIỆU RĂNG HÀM MẶT</h2>
          <p>
            Chào mừng bạn đến với Bệnh viện Răng Hàm Mặt Mountain View – một địa
            chỉ đáng tin cậy trong lĩnh vực chăm sóc sức khỏe răng miệng và thẩm
            mỹ răng hàm mặt. Với sứ mệnh mang đến nụ cười khỏe đẹp và tự tin cho
            mọi người, chúng tôi không ngừng nỗ lực để cung cấp những dịch vụ
            chăm sóc răng miệng tốt nhất và hiện đại nhất.
          </p>
        </header>

        <div className="team-image">
          <img src={assets.bs} alt="Đội ngũ bác sĩ" />
          <p className="image-caption">Đội ngũ bác sĩ Mountain View</p>
        </div>

        <section className="description">
          <p>
            Bệnh viện tự hào có đội ngũ y bác sĩ giỏi chuyên môn, giàu kinh
            nghiệm và tận tâm với nghề. Tất cả các bác sĩ đều được đào tạo
            chuyên sâu trong và ngoài nước, luôn cập nhật những kiến thức và
            công nghệ mới nhất trong lĩnh vực nha khoa.
          </p>
        </section>

        {/* Vision and Mission Section */}
        <div className="section-header">
          <span className="icon">⭐</span>
          <h3>Tầm Nhìn & Sứ Mệnh</h3>
        </div>
        <p className="section-content">
          Tầm nhìn của chúng tôi là trở thành bệnh viện hàng đầu trong việc chăm
          sóc sức khỏe răng miệng, tiên phong trong ứng dụng công nghệ mới và
          mang lại chất lượng dịch vụ y tế cao cấp. Sứ mệnh của chúng tôi là bảo
          vệ, chăm sóc và nâng cao sức khỏe răng miệng cho cộng đồng, mang lại
          nụ cười khỏe đẹp và tự tin cho mọi người.
        </p>

        {/* Vision and Mission Section */}
        <div className="section-header">
          <span className="icon">⭐</span>
          <h3>Hành trình phát triển</h3>
        </div>
        <p className="section-content">
          Bệnh viện Răng Hàm Mặt Mountain View được thành lập với mong muốn trở
          thành trung tâm nha khoa hàng đầu tại Việt Nam, mang lại các giải pháp
          chăm sóc răng miệng chuyên nghiệp và tiên tiến. Trải qua nhiều năm
          hình thành và phát triển, bệnh viện đã không ngừng mở rộng quy mô và
          nâng cao chất lượng dịch vụ. Đến nay, Mountain View đã trở thành một
          thương hiệu quen thuộc, được hàng ngàn bệnh nhân tin tưởng và lựa
          chọn.
        </p>
        <p className="section-content">
          Bắt đầu từ một phòng khám nhỏ với một số ít y bác sĩ, chúng tôi đã
          không ngừng học hỏi và cải tiến để đáp ứng nhu cầu ngày càng cao về
          chăm sóc răng miệng trong cộng đồng. Hiện nay, Bệnh viện Răng Hàm Mặt
          Mountain View sở hữu hệ thống phòng khám hiện đại, đạt tiêu chuẩn quốc
          tế, với đầy đủ các chuyên khoa và công nghệ tiên tiến nhất.
        </p>

        {/* Vision and Mission Section */}
        <div className="section-header">
          <span className="icon">⭐</span>
          <h3>Công nghệ nổi bật</h3>
        </div>
        <p className="section-content">
          Chúng tôi luôn đi đầu trong việc áp dụng những công nghệ hiện đại nhất
          trong lĩnh vực răng hàm mặt, giúp tối ưu hóa hiệu quả điều trị và đảm
          bảo sự an toàn cho bệnh nhân. Một số công nghệ nổi bật tại bệnh viện
          bao gồm:
          <ul className="tech-list">
            <li>
              Hệ thống chụp X-quang 3D Cone Beam CT: Giúp chẩn đoán chính xác
              các bệnh lý răng hàm mặt phức tạp, hỗ trợ tối đa cho việc lên kế
              hoạch điều trị.
            </li>
            <li>
              Công nghệ CAD/CAM: Giúp thiết kế và chế tác răng sứ, mão răng một
              cách chính xác và nhanh chóng, mang lại thẩm mỹ cao.
            </li>
            <li>
              Laser nha khoa: Giúp điều trị các bệnh lý nha khoa không xâm lấn,
              giảm đau, rút ngắn thời gian hồi phục.
            </li>
            <li>
              Kỹ thuật cấy ghép Implant tiên tiến: Sử dụng trụ Implant nhập khẩu
              từ các nước tiên tiến như Thụy Sĩ, Đức, Hoa Kỳ, giúp quá trình cấy
              ghép an toàn và đạt kết quả tối ưu.
            </li>
          </ul>
        </p>
        <div className="team-image">
          <img src={assets.bs2} alt="Đội ngũ bác sĩ" />
        </div>

        {/* Vision and Mission Section */}
        <div className="section-header">
          <span className="icon">⭐</span>
          <h3>Chương trình chăm sóc khách hàng</h3>
        </div>
        <p className="section-content">
          Bên cạnh việc cung cấp các dịch vụ y tế chất lượng, chúng tôi còn đặc
          biệt chú trọng đến trải nghiệm của bệnh nhân. Mountain View thường
          xuyên tổ chức các chương trình khám răng miễn phí, tư vấn chăm sóc
          răng miệng, và các gói ưu đãi đặc biệt cho khách hàng. Chúng tôi tin
          rằng, sự hài lòng và nụ cười của khách hàng chính là niềm vui và động
          lực lớn nhất để bệnh viện không ngừng phát triển.
        </p>
        <div className="team-image">
          <img src={assets.bs3} alt="Đội ngũ bác sĩ" />
        </div>

        {/* Vision and Mission Section */}
        <div className="section-header">
          <span className="icon">⭐</span>
          <h3>Phản hồi khách hàng</h3>
        </div>
        <p className="section-content">
          Chúng tôi luôn lắng nghe và trân trọng mọi ý kiến đóng góp của bệnh
          nhân. Nhiều khách hàng sau khi trải nghiệm dịch vụ tại Mountain View
          đã chia sẻ những đánh giá tích cực, khẳng định rằng bệnh viện không
          chỉ mang lại kết quả điều trị tốt mà còn tạo ra một không gian thân
          thiện, gần gũi. Một số phản hồi điển hình từ bệnh nhân
        </p>
        <div className="team-image">
          <img src={assets.bs4} alt="Đội ngũ bác sĩ" />
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};
export default AboutUs;
