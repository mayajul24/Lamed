import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import background from "./pictures/background3.png";
import mylogo from "./pictures/mylogo.png";
import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Container,
  Typography,
} from "@mui/material";

export default function SignIn() {
  const location = useLocation();
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get("username");
    const password = data.get("password");
    const apiUrl = process.env.REACT_APP_LOGIN!;
    const user_data = {
      username,
      password,
    };
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user_data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Response from Lambda:", data);

      if (data.succeeded) {
        const user = data.user;
        const userType = user.userType;
        if (userType === "teacher") {
          const teacher = user;
          navigate("/home-teacher", { state: { teacher } });
        } else {
          const student = user;
          const hasTeacher = student.teacher != null && student.teacher.length > 0;
          if (hasTeacher) {
            navigate("/home-student", { state: { student } });
          } else {
            navigate("/find_teacher", { state: { student } });
          }
        }
      } else {
        alert("שם משתמש או סיסמה לא נכונים");
      }
    } catch (error) {
      console.error("Error sending data to Lambda:", error);
    }
  }

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.5, 
      }}
    >
      
    <Container
      component="main"
      dir="rtl"
      maxWidth="xs"
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        padding: 4,
        borderRadius: 4,
        boxShadow: 3,
      }}
    >
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mb: 3,
      }}
    >
    <img src={mylogo} alt="Logo" style={{ height: 50 }} />
    </Box>
    <Typography
      component="h1"
      variant="h5"
      align="center"
      sx={{ fontWeight: 600, mb: 2 }}
    >
      כניסה
    </Typography>
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="שם משתמש"
        name="username"
        autoFocus
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          },
        }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="סיסמה"
        type="password"
        id="password"
        autoComplete="current-password"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          },
        }}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{
          mt: 2,
          mb: 2,
          background: "#009688",
          color: "#fff",
          fontWeight: 600,
          padding: "10px 0",
          borderRadius: 2,
          "&:hover": {
            background: "linear-gradient(90deg, #5E35B1, #7B1FA2)",
          },
        }}
      >
        כניסה
      </Button>
      <Grid container justifyContent="center">
        <Grid item>
          <Link
            href="#"
            variant="body2"
            onClick={(e) => {
              e.preventDefault();
              navigate("/welcome-page");
            }}
            sx={{ color: "#009688", fontWeight: 500 }}
          >
            אין לך עדיין משתמש?
          </Link>
        </Grid>
      </Grid>
    </Box>
  </Container>
  </Box>
  );
}
