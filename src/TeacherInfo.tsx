import React, { useState } from 'react';
import './style.css';
import mylogo from './pictures/mylogo.png';
import carsBackground from './pictures/cars_background2.jpg';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Avatar, Button, Card, CardContent, Typography, Box } from '@mui/material';

function TeacherInfo() {
  interface Teacher {
    firstName: string;
    lastName: string;
    city: string;
    username: string;
    profilePicture: string;
    cost: number;
  }
  interface Student {
    firstName: string;
    lastName: string;
    username: string;
  }

  interface TeacherStudentDetails {
    teacher: Teacher;
    student: Student;
  }

  const location = useLocation();
  const { teacher_student_details } = location.state;
  const teacher = teacher_student_details.teacher;
  const student = teacher_student_details.student;

  const req = {
    teacherUsername: teacher.username,
    studentUsername: student.username,
  };

  async function handleRequest(event: React.MouseEvent<HTMLButtonElement>) {
    const apiUrl = process.env.REACT_APP_REQUEST_TEACHER!;
    try {
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Response from Lambda:', data);
      if (data.succeeded) {
        alert('הבקשה נשלחה בהצלחה');
      } else {
        console.error('Failed to fetch');
      }
    } catch (error) {
      console.error('Error sending data to Lambda:', error);
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      padding={4}
      sx={{
        width: '70vw',
        height: '90vh',
        borderRadius: 4,
        boxShadow: 3,
        margin: 'auto',
        backgroundImage: `url(${carsBackground})`
      }}
    >
      <Card sx={{ height:600,maxWidth: 600,maxHeight: 700, padding: '16px', textAlign: 'center', width: '100%' }}>
        <Avatar
          alt={`${teacher.firstName} ${teacher.lastName}`}
          src={teacher.profilePicture || '/path/to/default/image.jpg'} // Fallback to default logo if no profile picture
          sx={{ width: 180, height: 180, margin: 'auto', mb: 2,borderRadius:0}}
        />

        <CardContent>
          <Typography variant="h5" component="div" sx={{ mb: 1,fontSize: '1.5rem'  }}>
            {teacher.firstName} {teacher.lastName}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1,fontSize:'1.5rem' }}>
            {"מלמד ב"} {teacher.city}
          </Typography>
          <Typography variant="body1" color="text.primary"  sx={{ fontSize: '1.2rem' }}>
          ₪{teacher.cost}  
          </Typography>
        </CardContent>

        {/* Request Button */}
        <Button
          onClick={handleRequest}
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          הגש בקשה
        </Button>
      </Card>
    </Box>
  );
}

export default TeacherInfo;