import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import background from "./pictures/background3.png";
import mylogo from "./pictures/mylogo.png";
import {Avatar,ButtonGroup,Button,TextField,Link,Grid,Box,Container,Typography} from "@mui/material";
import StudentSignUp from "./StudentSignUp";
import TeacherSignUp from "./TeacherSignUp";
import CustomButton from "./CustomButton";

export default function SignIn() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showWelcomePage, setShowWelcomePage] = React.useState(false);
  const [type,setType] = React.useState("");
  
 
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
     type!==""?
      (type==="student"?<StudentSignUp/>:<TeacherSignUp/>):
      <>
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
  <CustomButton
        onClick={() => setType("student")}
      >
        אני תלמיד
      </CustomButton> 
      <CustomButton
        onClick={() => setType("teacher")}
      >
        אני מורה
      </CustomButton>
  </div></>);
}
