import React, { useState, useEffect } from 'react';
import { Container,Button, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider } from '@mui/material';
import { useLocation } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

interface TeacherLessonsProps {
    teacherUsername:string;
}

export default function TeacherLessons({teacherUsername}:TeacherLessonsProps) {
    
interface Lesson {
    day: string;
    startTime: string;
    endTime: string;
    teacherName: string;
    studentUsername:string;
    firstName:string;
    lastName:string;
  }
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchLessons = async () => {
      const apiUrl = process.env.REACT_APP_GET_LESSONS!;
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ teacherUsername }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Response from Lambda:', data);
        if (data.succeeded) {
            console.log("lessons: "+data.lessons);
            setLessons(data.lessons);
        } else {
          console.error('Failed to fetch lessons');
        }
      } catch (error) {
        console.error('Error fetching lessons:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessons();
  }, [teacherUsername]);

  return (
    <Container sx={{ mt: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: '#00796b', fontSize: '2rem', fontWeight:'bold' }}>
        שיעורים קרובים
      </Typography>
      {isLoading ? (
        <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '20px' }}>
         ...טוען
        </Typography>
      ) : lessons.length > 0 ? (
        <List sx={{ bgcolor: 'background.paper', borderRadius: 1, boxShadow: 2, padding: '20px' }}>
          {lessons.map((lesson, index) => (
            <React.Fragment key={index}>
              <ListItem
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  padding: '15px',
                  textAlign: 'right',
                  direction: 'rtl',
                }}
              >
                <ListItemText 
                  dir="rtl"
                  secondary={
                    <>
                      <Typography variant="body2" sx={{ fontSize: '20px',color:'black' }}>
                         {lesson.day}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '20px',color:'black' }}>
                        {lesson.endTime} - {lesson.startTime}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ fontSize: '20px',color:'black' }}>
                        עם {lesson.firstName} {lesson.lastName}
                      </Typography>
                      
                    </>
                  }
                />
              <div>
              <Button
                    variant="outlined"
                    size="large"
                    sx={{backgroundColor:'#009688', width: '120px', color: 'white',fontSize: '14px',mr:2, border: 'none'
                    }}> <b>
                    שינוי שעה</b>
                    
                  </Button><br/>  
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{backgroundColor:'#009688', width: '120px', color: 'white', fontSize: '14px',mr:2,mt:2,border: 'none'
                    }}> <b>
                    ביטול שיעור</b>
                  </Button>
                </div>
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '20px' }}>
          אין שיעורים קרובים
        </Typography>
      )}
    </Container>
  );
}