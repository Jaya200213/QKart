import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { useHistory } from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons }) => {
  let history = useHistory();
  const explore=()=>{
    history.push("/");
  }
  const logout=()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("balance");
    history.push("/");
    window.location.reload();   
  }
  if(hasHiddenAuthButtons)
  {
    return(
    <Box className="header">
      <Box className="header-title">
          <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      <Button
        className="explore-button"
        startIcon={<ArrowBackIcon />}
        onClick={explore}
        variant="text"
      >
      Back to explore
      </Button>
    </Box>
    );
  }
  return(
    <Box className="header">
      <Box className="header-title">
          <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {children}
      <Stack direction="row" spacing={2} alignItems="center">
        {localStorage.getItem("username")?
        (
        <>
        <Avatar src="avatar.png" alt={localStorage.getItem("username")||"profile"}></Avatar>
        <p>{localStorage.getItem("username")}</p>
        <Button variant="text" onClick={logout}>LOGOUT</Button>
        </>
        )
        :
        (<>
          <Button variant="text" onClick={()=>history.push("/login")}>LOGIN</Button>
          <Button variant="contained" onClick={()=>history.push("/register")}>REGISTER</Button>
        </>)
        }
        </Stack>
    </Box>
  );
  
  };


export default Header;
