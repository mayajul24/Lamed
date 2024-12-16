import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import carsBackground from './pictures/cars_background2.jpg';
import {List,ListItem,ListItemText,ListItemAvatar,Avatar,Button,Divider,Box,Typography,} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

function Requests() {
  const location = useLocation();
  const { username } = location.state;
  const [requests, setRequests] = useState<Student[]>([]);
  const teacherUsername = username;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getStudentRequests = async () => {
      const apiUrl = 'https://xw778bjxn4.execute-api.us-east-1.amazonaws.com/Deployment/getStudentRequestsRes';
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
          setRequests(data.students);
          console.log("students: ", data.students);
        } else {
          console.error('Failed to fetch requests');
        }
      } catch (error) {
        console.error('Error sending data to Lambda:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getStudentRequests();
  }, []);

  interface Student {
    firstName: string;
    lastName: string;
    city: string;
    age: number;
    username: string;
    profilePicture?: string;
  }

  async function handleReject(studentUsername: string) {
    const apiUrl = process.env.REACT_APP_REJECT_STUDENT!;
    const req = { teacherUsername, studentUsername };

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
        setRequests(requests.filter((request) => request.username !== studentUsername));
      } else {
        console.error('Failed to process request');
      }
    } catch (error) {
      console.error('Error sending data to Lambda:', error);
    }
  }

  async function handleApprove(studentUsername: string) {
    const apiUrl = process.env.REACT_APP_ACCEPT_APPROVE!;
    const req = { teacherUsername, studentUsername };

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
        setRequests(requests.filter((request) => request.username !== studentUsername));
      } else {
        console.error('Failed to process request');
      }
    } catch (error) {
      console.error('Error sending data to Lambda:', error);
    }
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
        <Typography variant="h5" fontSize="32px" fontFamily="Roboto" dir="rtl" sx={{ mb: 2 }}>
          בקשות תלמידים
        </Typography>
        {isLoading ? (
          <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '20px' }}>
            Loading...
          </Typography>
        ) : requests.length > 0 ? (
          <List sx={{ bgcolor: 'background.paper', borderRadius: 1, boxShadow: 2, padding: '20px' }}>
            {requests.map((request) => (
              <React.Fragment key={request.username}>
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
                  <ListItemAvatar>
                    <Avatar
                      src={request.profilePicture || '/path/to/default/image.jpg'}
                      alt={`${request.firstName} ${request.lastName}`}
                      sx={{ width: 70, height: 70, mx: 3 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    dir="rtl"
                    primary={
                        <Typography variant="h6" sx={{ fontSize: '24px' }}>
                          {request.firstName} {request.lastName}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" sx={{ fontSize: '20px' }}>
                            עיר: {request.city}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: '20px' }}>
                            גיל: {request.age}
                          </Typography>
                        </>
                      }
                  />
                  

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      marginLeft: '20px',
                    }}
                  >
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => handleApprove(request.username)}
                      startIcon={<CheckIcon />}
                      sx={{color:"#009688", justifyContent: 'center', 
                        alignItems: 'center'}}
                    >
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => handleReject(request.username)}
                      startIcon={<DeleteIcon />}
                      sx={{color:"#009688"}}

                    >
                      
                    </Button>
                  </div>
                </ListItem>

                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '20px' }}>
            אין
          </Typography>
        )}
      </Box>
    </Box>
 
  );
}

export default Requests;
