import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import background from "./pictures/background3.png";
import mylogo from "./pictures/mylogo.png";
import {Avatar,ButtonGroup,Button,TextField,Link,Grid,Box,Container,Typography} from "@mui/material";

export default function SignIn() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showWelcomePage, setShowWelcomePage] = React.useState(false);
  
  
    const handleLogin = (userType: string) => {
      if (userType === 'student') {
        navigate('/student-sign-up', { state: userType });
      } else {
        navigate('/teacher-sign-up', { state: userType });
      }
    };
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
    <>
    <img src={mylogo} alt="Logo" style={{ height: 50 }} />
    <Typography
      component="h1"
      variant="h5"
      align="center"
      sx={{ fontWeight: 600, mb: 2 }}
    >
      רישום
    </Typography>
    <Box component="form" onSubmit={handleSubmit} noValidate>
    </Box>
    
        <div>
<Button
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
        }}
        onClick={() => handleLogin('student')}
      >
        אני תלמיד
      </Button>
      
      <Button
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
        }}
        onClick={() => handleLogin('teacher')}
      >
        אני מורה
      </Button>
  </div>
</>);

}
