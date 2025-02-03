import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
import Banner from "../components/Banner/Banner";
import BacktoTop from "../components/BacktoTop/BacktoTop";
import AppointmentForm from "../components/AppoinmentForm/AppointmentForm";
import SpecialOffer from "../components/SpecialOffer/SpecialOffer";
const Appointment = () => {
  return (
    <div>
      <Navbar />
      <Banner image="src/assets/Banner_DLK.jpg" />
      <AppointmentForm />
      <BacktoTop />
      <SpecialOffer />
      <Footer />
    </div>
  );
};

export default Appointment;
