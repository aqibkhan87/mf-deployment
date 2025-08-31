import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Typography, Box, Button, Container, Grid, Card, CardMedia, CardContent } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { ProductContext } from "store/productContext";

export default function DashboardPage() {
  const { productsCategories } = useContext(ProductContext);
  console.log("productsCategories", productsCategories)
  return (
    <Box>
      {/* 🔹 Banner Carousel */}
      <Box sx={{ mt: 2 }}>
        <Swiper
          navigation={true}
          modules={[Navigation]}
          spaceBetween={10}
          slidesPerView={1}
          loop={true}
          style={{ height: "300px" }}
        >
          <SwiperSlide>
            <img src="https://picsum.photos/id/1015/1200/300"  alt="banner1" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://picsum.photos/id/1074/1200/300"  alt="banner2" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </SwiperSlide>
        </Swiper>
      </Box>

      {/* 🔹 Product Sections */}
      <Container sx={{ mt: 4 }}>
        {productsCategories?.map((sec, idx) => (
          <Box key={idx} sx={{ mb: 5 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">{sec.title}</Typography>
              <Button variant="text">View All</Button>
            </Box>

            <Swiper
              navigation={true}
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={5}
              breakpoints={{
                1024: { slidesPerView: 5 },
                768: { slidesPerView: 3 },
                480: { slidesPerView: 2 },
              }}
            >
              {sec?.products?.map((p, i) => (
                <SwiperSlide key={i}>
                  <Link to={`/product/${sec?.categoryid}`}>
                  <Card sx={{ textAlign: "center"}}>
                    <CardMedia component="img" height="120" image={p?.productImage} alt={p?.name} />
                    <CardContent>
                      <Typography variant="body1">{p?.name}</Typography>
                      <Typography variant="body2" color="green">{p?.price}</Typography>
                    </CardContent>
                  </Card>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        ))}
      </Container>
    </Box>
  );
}
