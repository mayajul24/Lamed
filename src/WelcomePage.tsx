import React from 'react';
import { useNavigate } from 'react-router-dom';
import {Button,Box,ButtonGroup,Avatar,Typography} from '@mui/material';
import mylogo from './pictures/mylogo.png';
import carsBackground from './pictures/cars_background2.jpg';
import Container from '@mui/material/Container';

function WelcomePage() {
  const navigate = useNavigate();

  const handleLogin = (userType: string) => {
    if (userType === 'student') {
      navigate('/student-sign-up', { state: userType });
    } else {
      navigate('/teacher-sign-up', { state: userType });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${carsBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: 4,
          boxShadow: 3,
          padding: 4,
          width: '100%',
          maxWidth: '600px',
          textAlign: 'center',
          minHeight: '300px',  

        }}
      >
        <img
          src={mylogo}
          alt="My Logo"
          style={{
            marginBottom: '20px',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        />
        
        <ButtonGroup
  orientation="vertical"
  variant="outlined"
  sx={{
    width: '100%',
    '& .MuiButton-root': {
      fontSize: '24px',
      py: 1.5,
      borderColor: '#009688',  // Set border color
      color: '#009688',        // Set text color
      '&:hover': {
        borderColor: '#00796b',  // Darker shade for border on hover
        color: '#00796b',         // Darker text color on hover
      }
    },
    gap: 2,
  }}
>
  <Button onClick={() => handleLogin('student')}>אני תלמיד</Button>
  <Button onClick={() => handleLogin('teacher')}>אני מורה</Button>
</ButtonGroup>

      </Box>
    </Box>
  );
}

export default WelcomePage;