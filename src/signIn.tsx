import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import mylogo from "./pictures/mylogo.png";
import {Avatar,ButtonGroup,Button,TextField,Link,Grid,Box,Container,Typography} from "@mui/material";
import CustomTextField from "./CustomTextField";
import CustomButton from "./CustomButton";

export default function SignIn() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showWelcomePage, setShowWelcomePage] = React.useState(false);
  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    }
  };
  
    const handleLogin = (userType: string) => {
      if (userType === 'student') {
        navigate('/student-sign-up', { state: userType });
      } else {
        navigate('/teacher-sign-up', { state: userType });
      }
    };
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    console.log("Form submission started"); 
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
        console.log("user: "+user);
        if (userType === "teacher") {
          const teacher = user;
          navigate("/home-teacher", { state: { teacher } });
        } else {
          const student = user;
          console.log("teacher: "+student.teacher);
          const hasTeacher = student.teacher != null;
          console.log("student: "+student);
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
    <>
      
    <Typography
      component="h1"
      variant="h5"
      align="center"
      sx={{ fontWeight: 600, mb: 2 }}
    >
      התחברות
    </Typography>
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <CustomTextField
        id="username"
        label="שם משתמש"
        name="username"
      />
      <CustomTextField
        name="password"
        label="סיסמה"
        type="password"
        id="password"
      />
      <CustomButton
        type="submit"
        >
        כניסה
      </CustomButton>
    </Box>
    </>)
}