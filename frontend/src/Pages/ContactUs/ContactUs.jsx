import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import Banner from "../../components/Banner/Banner";
import BacktoTop from "../../components/BacktoTop/BacktoTop";
import "./ContactUs.css"
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from "react-icons/fa";
import React, { useState } from 'react';

import MessageForm from '../../components/MessageForm'
const Contact = () => {

  return (
    <div>
      <Navbar/>
      <Banner
        image="src/assets/Banner_LH.jpg"
      />
      {/* Contact Information Section */}
      <div className="contact-container">
        <span className="line-lh-1"></span>
        <span className="contact-title lato-bold">Liên hệ Mountain View Dental Care để được tư vấn nhanh chóng về dịch vụ răng miệng.</span>
        <span className="line-lh-2"></span>
      </div>
      <div className="contact-info-section">
        <div className="contact-info">
          <div className="contact-item lato-bold" >
            <FaMapMarkerAlt size={24} color="#507aa3" />
            <p>828 Sư Vạn Hạnh, Phường 13, Quận 10, TPHCM</p>
          </div>
          <div className="contact-item">
            <FaPhoneAlt size={24} color="#507aa3" />
            <p>1900 8059</p>
          </div>
          <div className="contact-item">
            <FaEnvelope size={24} color="#507aa3" />
            <p>mountainview@gmail.com</p>
          </div>
        </div>
      </div>
      <div className="opening-hours lato-bold">
        <FaClock size={32} color="white" />
        <p>Thứ 2 - Thứ 7 | 08h00 - 20h00</p>
      </div>
      <div className="body-lh">
        {/* Contact form */}
        {/* <div className="contact-form"> */}
          {/* <h3>
            HÃY LIÊN HỆ NGAY CHO CHÚNG TÔI
          </h3>
          <h3>
            NẾU BẠN CÓ BẤT KÌ CÂU HỎI HOẶC YÊU CẦU GÌ
          </h3> */}
          {/* <form>
            <input type="text" placeholder={fullnamePlaceholder} required />
            <input type="tel" placeholder={phonePlaceholder} required />
            <input type="email" placeholder={emailPlaceholder} required />
            <textarea placeholder="Nội dung" rows={4} required></textarea>
            <button type="submit">GỬI THÔNG TIN</button>
          </form> */}
          <MessageForm/>
        {/* </div> */}
        <div className="location-lh lato-bold">
          <h3>VỊ TRÍ PHÒNG KHÁM</h3>
          <div className="map-container">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4167.160841477365!2d106.66773915025917!3d10.775636743034099!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3ae5901877%3A0x42c37972de865906!2zODI4IMSQLiBTxrAgVuG6oW4gSOG6oW5oLCBQaMaw4budbmcgMTIsIFF14bqtbiAxMCwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1698473075297!5m2!1svi!2s" ></iframe>
          </div>
        </div>
      </div>
      <BacktoTop />
      <Footer/>
    </div>
  );
};

export default Contact;
