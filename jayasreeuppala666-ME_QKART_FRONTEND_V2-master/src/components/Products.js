import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { Fragment, useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";
import Cart from "./Cart.js";
import {generateCartItemsFrom} from "./Cart.js";
// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [prod,setProd]=useState([]);
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState(false);
  const [debounce,setdebounce]=useState(0);
  const[loggedin,setLoggedin]=useState(false);
  const Token=localStorage.getItem('token');
  const [prodDetails,setProdDetails]=useState([]);
  const [cartItems,setCartItems]=useState([]);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  useEffect(()=>{
    performAPICall();
  },[]);

  useEffect( ()=>{
    checklogin();
  },[]);

  useEffect(()=>{
    fetchCart(Token);
  },[prodDetails]);

 
  const performAPICall = async () => {
    let q=`${config.endpoint}/products`;
    setLoading(true);
    await axios.get(q)
    .then(response=>{
      setProd(response.data);
      setProdDetails(response.data);
      setLoading(false);
      return response.data;
    })
    .catch(error=>{
      // console.error('There was an error!', error);
      if(error.response.status>=400){
        enqueueSnackbar(error.response.data.message, {variant: 'error'});
        setLoading(false);
      }
      else{
        enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.",{variant: 'error'});
        
      }
    });
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const checklogin=()=>{
    if(localStorage.getItem("token"))
    setLoggedin(true);
  }
  const performSearch = async (text) => {
    let f=`${config.endpoint}/products/search?value=${text}`;
    await axios.get(f)
    .then(response=>{
      console.log(response.data);
      setErr(false);
      setProd(response.data);
    })
    .catch(error=>{
      setErr(true);
      enqueueSnackbar("No products found",{variant:'error'});
      // console.error('There was an error!', error);
    })

  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */

  const debounceSearch = (event, debounceTimeout) => {
    clearTimeout(debounce);
    const time=setTimeout(()=>{performSearch(event.target.value)},debounceTimeout);
    setdebounce(time);
  }
   /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
    const fetchCart = async (token) => {
      if (!token) return;
  
      try {
        // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
        let res=await axios.get(`${config.endpoint}/cart`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data,"Fectch Cart");
        const dat = generateCartItemsFrom(res.data, prodDetails);
        console.log(dat,"After filter");
        setCartItems(dat);
        
       
      } catch (e) {
        if (e.response && e.response.status === 400) {
          enqueueSnackbar(e.response.data.message, { variant: "error" });
        } else {
          enqueueSnackbar(
            "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
            {
              variant: "error",
            }
          );
        }
        return null;
      }
    };
  
  
    // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
    /**
     * Return if a product already is present in the cart
     *
     * @param { Array.<{ productId: String, quantity: Number }> } items
     *    Array of objects with productId and quantity of products in cart
     * @param { String } productId
     *    Id of a product to be checked
     *
     * @returns { Boolean }
     *    Whether a product of given "productId" exists in the "items" array
     *
     */
    const isItemInCart = (items, productId) => {
      for(let i=0;i<items.length;i++)
      {
        if(items[i]._id===productId)
        {
          return true;
        }
        return false;
      }
    };
  
    /**
     * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
     *
     * @param {string} token
     *    Authentication token returned on login
     * @param { Array.<{ productId: String, quantity: Number }> } items
     *    Array of objects with productId and quantity of products in cart
     * @param { Array.<Product> } products
     *    Array of objects with complete data on all available products
     * @param {string} productId
     *    ID of the product that is to be added or updated in cart
     * @param {number} qty
     *    How many of the product should be in the cart
     * @param {boolean} options
     *    If this function was triggered from the product card's "Add to Cart" button
     *
     * Example for successful response from backend:
     * HTTP 200 - Updated list of cart items
     * [
     *      {
     *          "productId": "KCRwjF7lN97HnEaY",
     *          "qty": 3
     *      },
     *      {
     *          "productId": "BW0jAAeDJmlZCF8i",
     *          "qty": 1
     *      }
     * ]
     *
     * Example for failed response from backend:
     * HTTP 404 - On invalid productId
     * {
     *      "success": false,
     *      "message": "Product doesn't exist"
     * }
     */
    const handleQuantity=async (productId,qty)=>{
      console.log(productId)
      try{
        let response=await axios.post(`${config.endpoint}/cart`,
        {'productId':productId,'qty':qty},
        {
          headers:{
          Authorization: `Bearer ${Token}`,
          },
        });
        setCartItems(generateCartItemsFrom(response.data,prodDetails));
        enqueueSnackbar("Item added to cart", { variant: "success" });
      }
      catch(e){
        if(e.response && e.response.status===400)
        {
          enqueueSnackbar(e.response.data.message, { variant: "warning" });
        }
        else{
          enqueueSnackbar("Could not added product to Cart", { variant: "warning" });
        }
      }
    } 
    const addToCart = async (
      token,
      items,
      products,
      productId,
      qty,
      options = { preventDuplicate: false }
    ) => {
      if(!token){
        enqueueSnackbar("Login to add an item to the Cart",{variant:"warning"});
      }
      else
      {
        if(isItemInCart(items,productId)){
          enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.",{variant:"warning"});
        }
        else{
          try{
            let response=await axios.post(`${config.endpoint}/cart`,
            {'productId':productId,'qty':qty},
            {
              headers:{
              Authorization: `Bearer ${Token}`,
              },
            });
            setCartItems(generateCartItemsFrom(response.data,prodDetails));
            enqueueSnackbar("Item added to cart", { variant: "success" });
          }
          catch(e){
            if(e.response && e.response.status===400)
            {
              enqueueSnackbar(e.response.data.message, { variant: "warning" });
            }
            else{
              enqueueSnackbar("Could not added product to Cart", { variant: "warning" });
            }
          }
        }
      }
    };
  
  //console.log(cartItems)
  
  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField 
        className="search-desktop"
        size="small"
        InputProps={{
          sx:{width:300},
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(event)=>debounceSearch(event,500)}
      />

      </Header>
      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        fullWidth
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        // sx={width:300}
        placeholder="Search for items/categories"
        name="search"
        onChange={(event)=>debounceSearch(event,500)}
      />
       <Grid container spacing={1} columns={{xs:4,sm:8,md:12}}>
        <Grid item xs md>
         <Grid item className="product-grid">
           <Box className="hero">
             <p className="hero-heading">
               India's <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>
         </Grid>
         <Grid item md={12} mx={2} my={5} >
          <Grid container spacing={2}>
            {loading?(
            <Box className="loading" sx={{display:'flex'}}>
            <CircularProgress />
            <br/>
            <p align="center">Loading Products</p>
            </Box>
            ):err?(
            <Grid  className="loading" item xs={12} md={12} direction="column">
            <SentimentDissatisfied/>
            <br/>
            <p>No products found</p> 
            </Grid>
            ):
            prod.map((p)=>
            <Grid item xs={6} md={3} key={p._id}>
            <ProductCard product={p} handleAddToCart={()=>addToCart(Token,cartItems,prodDetails,p._id,1)}/>
            </Grid>
            )
            }
          </Grid> 
         </Grid>
         </Grid>
         {loggedin?(
         <Grid item sm={12} md={3} my={2} bgcolor="#E9F5E1">
          <Cart items={cartItems} handleQuantity={handleQuantity}/>
          </Grid>)
          :null}             
        </Grid>
      <Footer />
    </div>
  );
};

export default Products;
