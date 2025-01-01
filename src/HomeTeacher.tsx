import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import mylogo from './pictures/mylogo.png';
import { 
  Avatar, 
  Box, 
  Typography, 
  AppBar, 
  Tabs, 
  Tab, 
  Toolbar, 
  Container 
} from '@mui/material';
import Requests from './Requests';
import Students from './Students';
import TeacherSlots from './TeacherSlots';
import TeacherLessons from './TeacherLessons';

function HomeTeacher() {
  interface Teacher {
    firstName: string;
    lastName: string;
    username: string;
    profilePicture?: string;
    city?: string;
    cost?: number;
  }

  const location = useLocation();
  const { teacher } = location.state;
  const [selectedTab, setSelectedTab] = useState(0);

  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return <Requests teacherUsername={teacher.username}/>;
      case 1:
        return <Students teacherUsername={teacher.username} />;
      case 2:
        return <TeacherSlots teacherUsername={teacher.username}/>;
        case 3:
          return <TeacherLessons teacherUsername={teacher.username}/>;
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
      display: 'flex',
      flexDirection: 'column',
      height: '100vh', 
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: '#f0f2f5',
    }}
    >
      {/* Top Navbar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: '#009688', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo and Greeting */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src={mylogo} 
              alt="My Logo" 
              style={{ height: '40px', marginRight: '16px' }} 
            />
            <Typography 
              variant="h6" 
              fontFamily="Arial" 
              dir="rtl" 
              sx={{ color: 'white' }}
            >
              שלום, {teacher.firstName}
            </Typography>
          </Box>

          {/* Tabs */}
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="teacher navigation"
            textColor="inherit"
            indicatorColor="secondary"
            centered
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: 'transparent', // Remove indicator
              },
            }}
          >
            <Tab label="בקשות" sx={{ color: 'white' }} />
            <Tab label="תלמידים" sx={{ color: 'white' }} />
            <Tab label="קביעת זמנים" sx={{ color: 'white' }} />
            <Tab label="לוח שיעורים" sx={{color:'white'}}/>
          </Tabs>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        sx={{
          width: '100%',
          mt: 12,  
          flex: 1,  
          paddingBottom: '20px', 
        }}
      >
        {/* Render Tab Content */}
        {renderTabContent()}
      </Box>
    </Box>
  );
}

export default HomeTeacher;
