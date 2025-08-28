import React from "react";
import { Link } from "react-router-dom";
import { Typography, Box, Button, Container, Grid, Card, CardMedia, CardContent } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

export default function DashboardPage() {
  // Dummy product data
  const sections = [
    {
      title: "Best of Electronics",
      products: [
        { name: "TrueWireless Earbuds", price: "₹699", img: "https://picsum.photos/id/1015/1200/300"  },
        { name: "Mirrorless Camera", price: "₹25,999", img: "https://picsum.photos/id/1025/1200/300"  },
        { name: "Monitor", price: "₹6,999", img: "https://picsum.photos/id/1074/1200/300"  },
        { name: "Smartwatch", price: "₹1,399", img: "https://picsum.photos/id/1062/1200/300"  },
        { name: "Projector", price: "₹6,999", img: "https://picsum.photos/id/1074/1200/300"  },
        { name: "Mirrorless Camera", price: "₹25,999", img: "https://picsum.photos/id/1025/1200/300"  },
      ],
    },
    {
      title: "Beauty, Food, Toys & More",
      products: [
        { name: "Action Toys", price: "₹499", img: "https://picsum.photos/id/1015/1200/300" },
        { name: "Coffee Powder", price: "₹299", img: "https://picsum.photos/id/1025/1200/300" },
        { name: "Stationery", price: "₹49", img: "https://picsum.photos/id/1074/1200/300" },
        { name: "Cycle", price: "₹3,999", img: "https://picsum.photos/id/1062/1200/300" },
        { name: "Soft Toys", price: "₹799", img: "https://picsum.photos/id/1074/1200/300" },
        { name: "Coffee Powder", price: "₹299", img: "https://picsum.photos/id/1025/1200/300" },
      ],
    },
  ];

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
        {sections.map((sec, idx) => (
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
              {sec.products.map((p, i) => (
                <SwiperSlide key={i}>
                  <Link to="/product/listing">
                  <Card sx={{ textAlign: "center"}}>
                    <CardMedia component="img" height="120" image={p.img} alt={p.name} />
                    <CardContent>
                      <Typography variant="body1">{p.name}</Typography>
                      <Typography variant="body2" color="green">{p.price}</Typography>
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
