import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import mylogo from "./pictures/mylogo.png";
import {Avatar,Box,Typography,AppBar,Tabs,Tab,Toolbar,Container} from "@mui/material";
import NewLesson from "./NewLesson";
import UpcomingLessons from "./UpcomingLessons";
import LessonsHistory from "./LessonsHistory";

function HomeStudent() {
  interface Student {
    firstName: string;
    lastName: string;
    username: string;
    profilePicture?: string;
    city?: string;
    age?: number;
  }
  const location = useLocation();
  const { student } = location.state;

  interface Student {
    firstName: string;
    lastName: string;
    username: string;
    teacher: string;
  }

  const [selectedTab, setSelectedTab] = useState(0);

  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return <NewLesson />;
      case 1:
        console.log("username: "+student.username);
        return <UpcomingLessons studentUsername={student.username} />;
      case 2:
        return <LessonsHistory />;
      default:
        return null;
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        backgroundColor: "#f0f2f5",
      }}
    >
      {/* Top Navbar */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#009688",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo and Greeting */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src={mylogo}
              alt="My Logo"
              style={{ height: "40px", marginRight: "16px" }}
            />
            <Typography
              variant="h6"
              fontFamily="Arial"
              dir="rtl"
              sx={{ color: "white" }}
            >
              שלום, {student.firstName}
            </Typography>
          </Box>

          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="student navigation"
            textColor="inherit"
            indicatorColor="secondary"
            centered
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "transparent",
              },
            }}
          >
            <Tab label="קביעת שיעור חדש" sx={{ color: "white",fontSize:'16px' }} />
            <Tab label="שיעורים עתידיים" sx={{ color: "white",fontSize:'16px' }} />
            <Tab label="היסטוריית שיעורים" sx={{ color: "white",fontSize:'16px' }} />
          </Tabs>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          width: "100%",
          mt: 12,
          flex: 1,
          paddingBottom: "20px",
        }}
      >
        {renderTabContent()}
      </Box>
    </Box>
  );
}

export default HomeStudent;
