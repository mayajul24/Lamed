import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import mylogo from './pictures/mylogo.png';
import { 
  Avatar, 
  Box, 
  Typography, 
  AppBar, 
  Tabs, 
  Tab, 
  Toolbar, 
  Container, 
  Paper 
} from '@mui/material';

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
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);

  function handleTabChange(event: React.SyntheticEvent, newValue: number) {
    setSelectedTab(newValue);
    const username = teacher.username;

    switch (newValue) {
      case 0:
        navigate('/requests', { state: { username } });
        break;
      case 1:
        navigate('/students', { state: { username } });
        break;
      case 2:
        navigate('/lessons', { state: { username } });
        break;
      case 3:
        navigate('/slots', { state: { username } });
        break;
      default:
        break;
    }
  }

  return (
    <Box sx={{ 
      backgroundColor: '#f0f2f5', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Navbar */}
      <AppBar position="fixed" sx={{ 
        backgroundColor: '#009688', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
      }}>
        <Toolbar>
          <img 
            src={mylogo} 
            alt="My Logo" 
            style={{ 
              height: '40px', 
              marginRight: '16px' 
            }} 
          />
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="teacher navigation"
            sx={{ 
              width: '100%', 
              justifyContent: 'center',
              '& .MuiTabs-indicator': {
              backgroundColor: 'transparent' // Remove the indicator completely
            }
            }}
            textColor="inherit"
            indicatorColor="secondary"
          >
            <Tab label="בקשות" sx={{ color: 'black' }} />
            <Tab label="תלמידים" sx={{ color: 'black' }} />
            <Tab label="שיעורים" sx={{ color: 'black' }} />
            <Tab label="קביעת זמנים" sx={{ color: 'black' }} />
          </Tabs>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container 
        sx={{ 
          mt: '80px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: '100%', 
            maxWidth: '500px', 
            textAlign: 'center', 
            backgroundColor: 'white' 
          }}
        >
          <Typography 
            variant="h5" 
            fontSize="32px" 
            fontFamily="Roboto" 
            dir="rtl" 
            sx={{ mb: 2 }}
          >
            שלום, {teacher.firstName}
          </Typography>
          
          <Avatar
            src={teacher.profilePicture || '/path/to/default/image.jpg'}
            alt={`${teacher.firstName} ${teacher.lastName}`}
            sx={{ 
              width: 100, 
              height: 100, 
              margin: 'auto', 
              mb: 4 
            }}
          />
        </Paper>
      </Container>
    </Box>
  );
}

export default HomeTeacher;