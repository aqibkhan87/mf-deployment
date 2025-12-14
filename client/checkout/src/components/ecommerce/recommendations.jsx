import React from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Rating,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useProductStore } from "store/productStore";
import "./recommendation.scss";

const Recommendations = () => {
  const history = useHistory();
  const { productsByCategory } = useProductStore();

  const navigateToProductDetail = (e, p) => {
    e.preventDefault();
    history.push(`/product/${p?.categoryid}/${p?._id}`);
  };

  return (
    <div className="p-4 border rounded recommendation">
      <h3 className="font-bold mb-2">Recommended for you</h3>
      <div className="flex gap-2">
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
          {productsByCategory?.map((p, i) => (
            <SwiperSlide key={`${i}-${p?.name}`} className="cursor-pointer">
              <a
                onClick={(e) => navigateToProductDetail(e, p)}
                className="cursor-pointer"
              >
                <Card sx={{ height: "100%" }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={p?.productImage}
                    alt={p?.name}
                    style={{ height: 250 }}
                  />
                  <CardContent>
                    <Typography variant="body1" gutterBottom>
                      {p?.name}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Rating
                        name="rating"
                        value={Number(p?.rating)}
                        precision={0.1}
                        readOnly
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary">
                        ({p?.reviews?.toLocaleString()})
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="green">
                      ₹{p?.price}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ textDecoration: "line-through", mr: 1 }}
                    >
                      ₹{p?.actualPrice}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "green", fontWeight: "bold" }}
                    >
                      {p?.discountedPrice}
                    </Typography>
                  </CardContent>
                </Card>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Recommendations;
