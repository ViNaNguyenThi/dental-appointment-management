import "./SpecialOffer.css";
import { assets } from "../../assets/assets.js";

const SpecialOffer = () => {
  return (
    <div className="special-offer">
      <img
        src={assets.special_offer}
        className="special-offer__content"
        alt="Special Offer"
      />
      <ul className="special-offer__text">
        <h1 className="special-offer__title lato-bold">
          ƯU ĐÃI GIÁ TỐT NHẤT HÔM NAY
        </h1>
        <button className="special-offer__button lato-bold">
          Đặt lịch khám ngay
          <img
            src={assets.calendar_booking}
            className="calendar-booking"
            alt="calendar-booking"
          />
        </button>
      </ul>
    </div>
  );
};

export default SpecialOffer;
