import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import carsBackground from './pictures/cars_background2.jpg';
import {List,ListItem,ListItemText,ListItemAvatar,Avatar,Button,Divider,Box,Typography,Toolbar,AppBar,Container,Tabs,Tab,Paper} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import mylogo from './pictures/mylogo.png';

function Requests() {
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = location.state;
  const [requests, setRequests] = useState<Student[]>([]);
  const teacherUsername = username;
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(1); // Default to the "Students" tab

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
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
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
  };

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
    <Box sx={{ backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
     {/* Top Navbar */}
     <AppBar position="fixed" sx={{ backgroundColor: '#009688', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <Toolbar>
              <img
                src={mylogo}
                alt="My Logo"
                style={{
                  height: '40px',
                  marginRight: '16px',
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
                    backgroundColor: 'transparent',
                  },
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
          <Container sx={{ mt: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                width: '100%',
                maxWidth: '500px',
                textAlign: 'center',
                backgroundColor: 'white',
              }}>
       <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: '#00796b', fontSize: '2rem' }}>
                      בקשות
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
            אין בקשות
          </Typography>
        )}
         </Paper>
      </Container>
    </Box>
    
  );
  
}

export default Requests;
