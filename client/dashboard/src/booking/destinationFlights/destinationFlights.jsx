import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import "./destinationFlights.scss";
import { useBookingStore } from "store/bookingStore";
import { getDestinationList } from "../../apis/flights/booking"

const DestinationSwiper = () => {
  const { destinationListDetails } = useBookingStore();
  const flights = destinationListDetails?.flights;

  useEffect(() => {
    getDestinationList()
  }, [])

  // chunk 9 items per slide
  const slides = [];
  for (let i = 0; i < flights?.length; i += 9) {
    slides.push(flights?.slice(i, i + 9));
  }
  return (
    <div className="destination-container">
      <Swiper
        navigation={true}
        modules={[Navigation]} 
        spaceBetween={20} 
        slidesPerView={1}>
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="grid-wrapper">
              {/* ROW 1 (30 / 40 / 30) */}
              <div className="row row-1">
                {slide.slice(0, 3).map((item) => (
                  <DestinationCard key={item.id} item={item} />
                ))}
              </div>

              {/* ROW 2 (33 / 33 / 33) */}
              <div className="row row-2">
                {slide.slice(3, 6).map((item) => (
                  <DestinationCard key={item.id} item={item} />
                ))}
              </div>

              {/* ROW 3 (30 / 40 / 30) */}
              <div className="row row-1">
                {slide.slice(6, 9).map((item) => (
                  <DestinationCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const DestinationCard = ({ item }) => {
  const { destinationListDetails } = useBookingStore();
  const connectingAirports = destinationListDetails?.connectingAirports;
  const sourceAirport = connectingAirports?.find(airport => airport?.iata === item?.origin)
  const destinationAirport = connectingAirports?.find(airport => airport?.iata === item?.destination)
  console.log("connectingAirportsconnectingAirports", item, sourceAirport, destinationAirport)
  return (
    <div className="destination-card" key={`${sourceAirport?.iata}-${destinationAirport?.iata}`} >
      <img src={`${process.env.API_BASE_URL}/images/${item?.destination}.png`} alt={item?.city} />
      <div className="overlay">
        <span>{sourceAirport?.city} - {destinationAirport?.city}</span>
        <span>
          Starting at <p>₹{item?.fare?.totalPrice}*</p>
        </span>
      </div>
    </div>
  )
};

export default DestinationSwiper;
