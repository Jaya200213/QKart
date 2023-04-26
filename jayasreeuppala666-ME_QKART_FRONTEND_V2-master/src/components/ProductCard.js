import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";
const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardContent className="card">
        <CardMedia component="img" size="100" image={product.image} alt={product.name} sx={{objectFit:"contain"}}/>
        <Typography variant="p" component="p" sx={{fontWeight:"bold"}}>
          {product.name}
        </Typography>
        <Typography variant="p" sx={{fontWeight:"bold"}}>
          ${product.cost}
        </Typography>
        <br/>
        <Rating
        name="simple-controlled"
        readOnly 
        value={product.rating}
        />
        <CardActions>
          <Button size="small" variant="contained" fullWidth onClick={handleAddToCart}><AddShoppingCartOutlined/>ADD TO CART</Button>
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
