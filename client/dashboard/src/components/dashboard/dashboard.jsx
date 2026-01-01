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
import { getAllProductsCategoryies } from "../../apis/ecommerce/products";
import BookingWidget from "../../booking/bookingwidget/bookingWidget";
import "./dashboard.scss";
import bannerImage from "../../assets/images/booking-banner.png";

export default function DashboardPage() {
  const { allCategories } = useProductStore();
  const history = useHistory();

  const navigateToProductCategory = (e, sec) => {
    e.preventDefault();
    history.push(`/product/${sec?.categoryid}`);
  };

  useEffect(() => {
    getAllProductsCategoryies();
  }, []);

  return (
    <Box className="dashboard-page" data-page-type="dashboard">
      
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
              breakpoints={{
                1024: { slidesPerView: 4 },
                768: { slidesPerView: 3.3 },
                480: { slidesPerView: 1.3 },
              }}
            >
              {sec?.products?.map((p, i) => (
                <SwiperSlide key={`${i}-${p?.name}`} className="cursor-pointer">
                  <a onClick={(e) => navigateToProductCategory(e, sec)}>
                    <Card sx={{ textAlign: "center" }}>
                      <CardMedia
                        component="img"
                        image={p?.productImage}
                        alt={p?.name}
                        style={{ height: 200 }}
                      />
                      <CardContent style={{ paddingBottom: "16px" }}>
                        <Typography variant="body1">{p?.name}</Typography>
                        <Typography variant="body2" color="green">
                          ₹{p?.price}
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
