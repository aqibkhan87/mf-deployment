import React, { useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Container,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useProductStore } from "store/productStore";
import { getAllProductsCategoryies } from "../../apis/products.js";
import BookingWidget from "../../booking/bookingWidget.js";
import "./dashboard.scss";
import bannerImage from "../../assets/images/booking-banner.png";

export default function DashboardPage() {
  const { allCategories } = useProductStore();
  const history = useHistory();
  console.log("allCategories 123", allCategories);

  const navigateToProductCategory = (e, sec) => {
    e.preventDefault();
    history.push(`/product/${sec?.categoryid}`);
  };

  useEffect(() => {
    getAllProductsCategoryies();
  }, []);

  return (
    <Box className="dashboard-page">
      {/* 🔹 Banner Carousel */}
      {/* <Box sx={{ mt: 2 }}>
        <Swiper
          navigation={true}
          modules={[Navigation]}
          spaceBetween={10}
          slidesPerView={1}
          loop={true}
          style={{ height: "300px" }}
        >
          <SwiperSlide>
            <img
              src="https://picsum.photos/id/1015/1200/300"
              alt="banner1"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="https://picsum.photos/id/1074/1200/300"
              alt="banner2"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </SwiperSlide>
        </Swiper>
      </Box> */}
      <Box>
        <img src={bannerImage} alt="banner1" className="banner-image" />
        <BookingWidget />
      </Box>

      {/* 🔹 Product Sections */}
      <Container sx={{ mt: 4 }}>
        {allCategories?.map((sec, idx) => (
          <Box key={idx} sx={{ mb: 5 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">{sec.title}</Typography>
              <Button
                variant="text"
                onClick={(e) => navigateToProductCategory(e, sec)}
              >
                View All
              </Button>
            </Box>

            <Swiper
              navigation={true}
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={4}
              breakpoints={{
                1024: { slidesPerView: 4 },
                768: { slidesPerView: 3 },
                480: { slidesPerView: 2 },
              }}
            >
              {sec?.products?.map((p, i) => (
                <SwiperSlide key={`${i}-${p?.name}`} className="cursor">
                  <a onClick={(e) => navigateToProductCategory(e, sec)}>
                    <Card sx={{ textAlign: "center" }}>
                      <CardMedia
                        component="img"
                        height="180"
                        image={p?.productImage}
                        alt={p?.name}
                      />
                      <CardContent>
                        <Typography variant="body1">{p?.name}</Typography>
                        <Typography variant="body2" color="green">
                          {p?.price}
                        </Typography>
                      </CardContent>
                    </Card>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        ))}
      </Container>
    </Box>
  );
}
