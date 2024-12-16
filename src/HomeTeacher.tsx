import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import mylogo from './pictures/mylogo.png';
import carsBackground from './pictures/cars_background2.jpg';
import { Avatar, Box, Button, ButtonGroup, Typography } from '@mui/material';

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

  function handleRequests(){
    const username = teacher.username;
    console.log("username in welcome " + username);
    navigate('/requests', { state: { username } });
  };

  function handleStudents(){
    const username = teacher.username;
    console.log("button clicked");
    navigate('/students', { state: { username } });
  };

  function handleLessons() {
    const username = teacher.username;
    console.log("button clicked");
    navigate('/lessons', { state: { username } });
  };
  function handleSlots()
  {
    const username = teacher.username;
    navigate('/slots', { state: { username } });
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
        שלום, {teacher.firstName}
      </Typography>
      <Avatar
        src={teacher.profilePicture || '/path/to/default/image.jpg'}
        alt={`${teacher.firstName} ${teacher.lastName}`}
        sx={{ width: 100, height: 100, margin: 'auto', mb: 4 }}
      />
        <ButtonGroup
          orientation="vertical"
          variant="contained"
          color="primary"
          sx={{
            width: '100%',
            '& .MuiButton-root': {
              fontSize: '16px',
              py: 1.5,
            },
            gap: 2,
          }}
        >
          <Button onClick={handleRequests}>בקשות</Button>
          <Button onClick={handleStudents}>תלמידים</Button>
          <Button onClick={handleLessons}>שיעורים</Button>
          <Button onClick={handleSlots}>קביעת זמנים</Button>

        </ButtonGroup>
      </Box>
    </Box>
  );
}

export default HomeTeacher;