import React, { useState } from 'react';
import './style.css';
import mylogo from './pictures/mylogo.png';
import carsBackground from './pictures/cars_background2.jpg';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Rating,Avatar,Container, Button, Card, CardContent, Typography, Box } from '@mui/material';

interface Teacher {
    firstName: string;
    lastName: string;
    city: string;
    username: string;
    profilePicture?: string;
    cost: number;
  }
interface TeacherInfoProps
{
    teacher:Teacher;
}
function TeacherInfo({teacher}:TeacherInfoProps) {
  return (
    <Container
    maxWidth="xs"
    sx={{
      backgroundColor: "white", 
      padding: 4,
      borderRadius: 4,
      boxShadow: 3,
      zIndex: 1, 
      position: "relative", 
    }}>
      {/* <Card sx={{ height:600,maxWidth: 600,maxHeight: 700, padding: '16px', textAlign: 'center', width: '100%' }}> */}
        <Avatar
          alt={`${teacher.firstName} ${teacher.lastName}`}
          src={teacher.profilePicture || '/path/to/default/image.jpg'} 
          sx={{ 
            width: 150, 
            height: 150, 
            mx: 'auto', 
            mb: 2 
          }}        />
        <CardContent>
          <Typography variant="h5" component="div" sx={{ mb: 1,fontSize: '1.5rem', fontWeight: 'bold'}}>
            {teacher.firstName} {teacher.lastName}
          </Typography>
          <Typography variant="body1" color="text.primary" sx={{ mb: 1,fontSize:'1.5rem' }}>
            {"מלמד ב"}{teacher.city}
          </Typography>
          <Typography dir="rtl" variant="body1" color="text.primary"  sx={{ fontSize: '1.2rem' }}>
          ₪{teacher.cost} לשעה          
          </Typography>
          <br/>
          <Rating size='large' name="half-rating-read" defaultValue={2} precision={0.5} readOnly />
        </CardContent>
      {/* </Card> */}
    </Container>
  );
}

export default TeacherInfo;