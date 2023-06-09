import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack,Card} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

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

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 * 
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  let arr=[];
  // console.log(cartData,"cartsITem")
  if(cartData.length && productsData.length)
  {
    for(let i=0;i<cartData.length;i++)
    {
      for(let j=0;j<productsData.length;j++)
      {
        if(cartData[i].productId===productsData[j]._id)
        {
          arr.push({...productsData[j], qty:cartData[i].qty});
        }
      }
    }
  }
  console.log(arr,"after Filter");
  return arr;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  let val=0;
  for(let i=0;i<items.length;i++)
  {
    val+=(items[i].cost)*(items[i].qty);
  }
  return val;
};

export const getTotalItems=(items=[])=>{
  let total=0;
  for(let i=0;i<items.length;i++)
  {
    total+=items[i].qty;
  }
  return total;
};


/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,  
}) => {
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

/**
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const Cart = ({
  products,
  items=[],
  handleQuantity,
  isReadOnly=false
}) => {
  // console.log(items,"Itemns from cart")
  const history=useHistory();
  if (!items.length) {
    return (
      <Card>
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
      </Card>
    );
  }
  function checkout(){
    history.push('/checkout');
  }

  return (
    <>
      <Box className="cart">
        {/* console.log(items); */}
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        {items.map((item)=>(
        <Box display="flex" alignItems="flex-start" padding="1rem" key = {item._id}>
          <Box className="image-container">
            <img
            // Add product image
            src={item.image}
            // Add product name as alt eext
            alt={item.name}
            width="100%"
            height="100%"
          />
          </Box>
          <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          height="6rem"
          paddingX="1rem">
            <div>
              {item.name}
              {/* Add product name */}</div>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
          {isReadOnly?
          <Box style={{fontSize: "1rem"}}> Qty:{item.qty} </Box>
          :<ItemQuantity
             value={item.qty}
             handleAdd={()=>{
              console.log("value: " + item._id)
              handleQuantity(item._id,item.qty+1)
             }
             }
             handleDelete={()=>{
              handleQuantity(item._id,item.qty-1)
             }
             }
        // Add required props by checking implementation
          />}         
          <Box padding="0.5rem" fontWeight="700">
            ${item.cost}
          </Box>
          </Box>
        </Box>
        </Box>
        ))}
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>
        {(isReadOnly)?null:
        <Box display="flex" justifyContent="flex-end" className="cart-footer">
          <Button
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            className="checkout-btn"
            onClick={checkout}
          >
            Checkout
          </Button>
        </Box>
        }
      </Box>
      {isReadOnly?
      <Box className="cart" paddingY='1rem'>
      <Box display="flex" alignItems="flex-start" padding="1rem">
      <Box alignSelf="center" fontWeight="700" fontSize="1.5rem">
        Order Details
        </Box>
        </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding="1rem">
          <Box alignSelf="center">Products</Box>
          <Box alignSelf="center">{getTotalItems(items)}</Box>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        paddingX="1rem">
          <Box alignSelf="center">Subtotal</Box>
          <Box alignSelf="center">${getTotalCartValue(items)}</Box>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding="1rem">
          <Box alignSelf="center">Shipping Charges</Box>
          <Box alignSelf="center">$0</Box>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding="1rem">
          <Box alignSelf="center" fontWeight="600"fontSize="1rem">Total</Box>
          <Box alignSelf="center" fontWeight="600"fontSize="1rem">${getTotalCartValue(items)}</Box>
      </Box>
    </Box>
      :null
    }
    </>
  );
};

export default Cart;
