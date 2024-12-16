import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import mylogo from './pictures/mylogo.png';
import carsBackground from './pictures/cars_background2.jpg';
import { Avatar, Box, Button, Typography } from '@mui/material';

function HomeStudent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { student } = location.state;

  interface Student {
    firstName: string;
    lastName: string;
    username: string;
    teacher: string;
    profilePicture: string;
  }

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
    <Typography variant="h5" fontSize="32px" fontFamily="Roboto" dir="rtl" sx={{ mb: 2 }}>
      שלום, {student.firstName}
    </Typography>
    <Avatar
      src={student.profilePicture || '/path/to/default/image.jpg'}
      alt={`${student.firstName} ${student.lastName}`}
      sx={{ width: 100, height: 100, margin: 'auto', mb: 2 }}
    />
    <Button
      variant="contained"
      color="primary"
      sx={{ fontSize: '16px', px: 3 }}
      onClick={() => navigate('/schedule-lesson', { state: { student } })}
    >
        קביעת שיעור חדש עם {student.teacher}
    </Button>
  </Box>
</Box>
  );
}

export default HomeStudent;
