import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import carsBackground from './pictures/cars_background2.jpg';
import {List,ListItem,ListItemText,ListItemAvatar,Avatar,Button,Divider,Box,Typography,Toolbar,AppBar,Container,Tabs,Tab,Paper} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router-dom';

function Lessons() {
  const location = useLocation();
  const { username } = location.state;
  const [requests, setRequests] = useState<LessonRequest[]>([]);
  const teacherUsername = username;
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(1); // Default to the "Students" tab
  const navigate = useNavigate();
  
  useEffect(() => {
    const getStudentRequests = async () => {
      const apiUrl = process.env.REACT_APP_GET_LESSONS_URL!;
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
          setRequests(data.lessons);
          console.log("requests: ", data.lessons);
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

  interface LessonRequest {
    firstName: string;
    lastName: string;
    date: string;
    time: string;
    username:string
    profilePicture:string;
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
שיעורים        </Typography>
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
                            תאריך {request.date}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: '20px' }}>
                            שעה {request.time}
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
            אין
          </Typography>
        )}
      </Box>
    </Box>
 
  );
}

export default Lessons;
