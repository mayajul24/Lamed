import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import background from "./pictures/background3.png";
import mylogo from "./pictures/mylogo.png";
import {Avatar,ButtonGroup,Button,TextField,Link,Grid,Box,Container,Typography} from "@mui/material";
import SignIn from "./signIn";
import WelcomePage from "./WelcomePage";

export default function Main() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showWelcomePage, setShowWelcomePage] = React.useState(false);

  return (
    <Box
    sx={{
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden"
  }}
>
  <Box
    sx={{
      position: "absolute", 
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url(${background})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      opacity: 0.8, 
    }}
  />

  <Container
    component="main"
    dir="rtl"
    maxWidth="xs"
    sx={{
      backgroundColor: "white", 
      padding: 4,
      borderRadius: 4,
      boxShadow: 3,
      zIndex: 1, 
      position: "relative", 
    }}
  ><img src={mylogo} alt="Logo" style={{ height: 50 }} />
    {showWelcomePage ?(<WelcomePage/>) :(<SignIn/>)}
          <Link
            href="#"
            variant="body2"
            onClick={(e) => { 
              setShowWelcomePage(!showWelcomePage);
            }}
            sx={{ color: "#009688", fontWeight: 500 }}
          >
            {showWelcomePage ? "יש לך משתמש? התחבר" : "אין לך עדיין משתמש? הירשם"}
          </Link>
  </Container>
</Box>
  );
}
