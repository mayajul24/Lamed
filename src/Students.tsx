import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import mylogo from './pictures/mylogo.png';
import {List,ListItem,ListItemText,ListItemAvatar,Avatar,Button,Divider,Box,Typography,Toolbar,AppBar,Container,Tabs,Tab,Paper} from '@mui/material';

interface StudentsProps {
  teacherUsername:string;
}
function Students({teacherUsername}:StudentsProps)
{
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(1); // Default to the "Students" tab

  interface Student {
      firstName: string,
      lastName: string,
      city: string,
      age: number,
      username: string
  }
  useEffect(()=>{
    const getStudents = async () => {
        const apiUrl = process.env.REACT_APP_GET_STUDENTS!;
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({teacherUsername})
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Response from Lambda:', data);
            if (data.succeeded) {
                setStudents(data.students);
                console.log("students: "+data.students);

            } else {
                console.error('Failed to fetch students');
            }
    
        } catch (error) {
            console.error('Error sending data to Lambda:', error);
        }
        finally {
            setIsLoading(false); // Set loading to false once fetch is complete
        }
          
      };
      getStudents();
  },[]);

    interface Teacher {
        firstName: string;
        lastName: string;
        city: string;
        username: string;
    }
    interface Student {
        firstName: string;
        lastName: string;
        city: string;
        age: number;
        username: string;
        profilePicture?: string;
      }
    
      return (
            <Container sx={{ mt: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
                <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: '#00796b', fontSize: '2rem' }}>
                תלמידים
              </Typography>
              {isLoading ? (
                <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '20px' }}>
                  Loading...
                </Typography>
              ) : students.length > 0 ? (
                <List sx={{ bgcolor: 'background.paper', borderRadius: 1, boxShadow: 2, padding: '20px' }}>
                  {students.map((student) => (
                    <React.Fragment key={student.username}>
                      <ListItem
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '15px',
                          textAlign: 'right',
                          direction: 'rtl',
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={student.profilePicture || '/path/to/default/image.jpg'}
                            alt={`${student.firstName} ${student.lastName}`}
                            sx={{ width: 70, height: 70, mx: 3 }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          dir="rtl"
                          primary={
                            <Typography variant="h6" sx={{ fontSize: '24px' }}>
                              {student.firstName} {student.lastName}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" sx={{ fontSize: '20px' }}>
                                עיר: {student.city}
                              </Typography>
                              <Typography variant="body2" sx={{ fontSize: '20px' }}>
                                גיל: {student.age}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '20px' }}>
                  אין תלמידים
                </Typography>
              )}
          </Container>
      );
}

export default Students;