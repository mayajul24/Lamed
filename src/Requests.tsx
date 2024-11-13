import React, { useState,useEffect } from 'react';
import './style.css'; 
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import mylogo from './pictures/mylogo.png';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';


function Requests()
{
    const location = useLocation();
    const {username} = location.state;
    const [requests, setRequests] = useState<Student[]>([]);
    const teacherUsername = username;
    const [isLoading, setIsLoading] = useState(true); // Add a loading state

    useEffect(()=>{
        const getStudentRequests = async () => {
        
            const apiUrl = 'https://xw778bjxn4.execute-api.us-east-1.amazonaws.com/Deployment/getStudentRequestsRes';
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
                   setRequests(data.students);
                   console.log("students: "+data.students);

                } else {
                    console.error('Failed to fetch requests');
                }
        
            } catch (error) {
                console.error('Error sending data to Lambda:', error);
            }
            finally {
                setIsLoading(false); // Set loading to false once fetch is complete
            }
            
        };
        getStudentRequests();
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
    }
    
    async function handleReject(studentUsername:string)
    {
        const apiUrl = 'https://xw778bjxn4.execute-api.us-east-1.amazonaws.com/Deployment/rejectStudentRes';
        const req = {"teacherUsername":teacherUsername,
        "studentUsername":studentUsername};
    try {
        const response = await fetch(apiUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Response from Lambda:', data);
        if (data.succeeded) {
            setRequests(requests.filter((request)=>request.username!==studentUsername));
        } else {
            console.error('Failed to fetch teachers');
        }

    } catch (error) {
        console.error('Error sending data to Lambda:', error);
    }
    }
    async function handleApprove(studentUsername:string)
    {
        const apiUrl = 'https://xw778bjxn4.execute-api.us-east-1.amazonaws.com/Deployment/acceptStudentRes';
        const req = {"teacherUsername":teacherUsername,
        "studentUsername":studentUsername};
    try {
        const response = await fetch(apiUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Response from Lambda:', data);
        if (data.succeeded) {
            setRequests(requests.filter((request)=>request.username!==studentUsername));
        } else {
            console.error('Failed to fetch teachers');
        }

    } catch (error) {
        console.error('Error sending data to Lambda:', error);
    }
    }
    
    return (
        <div style={{ maxWidth: 800, width: 600, height: 600 ,margin: 'auto', padding: '20px' }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: '#00796b', fontSize: '2rem' }}>
            </Typography>
            {isLoading ? (
            <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '20px' }}>
                Loading...
            </Typography>): requests.length > 0 ? (
            <List sx={{ bgcolor: 'background.paper', borderRadius: 1, boxShadow: 2, padding: '20px' }}>
                {requests.map((request) => (
                    <React.Fragment key={request.username}>
                        <ListItem alignItems="flex-start" sx={{ display: 'flex', justifyContent: 'space-between', padding: '15px' }}>
                            <div>
                                <Typography variant="h6" sx={{ marginBottom: 1, fontSize: '1.25rem' }}>
                                    {request.firstName} {request.lastName}
                                </Typography>
                                <Typography variant="body2" color="primary" sx={{ marginBottom: 1, fontSize: '1rem' }}>
                                    {request.city}
                                </Typography>
                                <Typography variant="body2" sx={{ marginBottom: 1, fontSize: '1rem' }}>
                                    {request.age}
                                </Typography>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginLeft: '20px' }}>
                                <Button variant="contained" color="success" size="large" className='approveButton' onClick={() => handleApprove(request.username)}>
                                    אשר
                                </Button>
                                <Button variant="outlined" color="error" startIcon={<DeleteIcon />} size="large" onClick={()=> handleReject(request.username)}>
                                    דחה
                                </Button>
                            </div>
                        </ListItem>
                        <Divider component="li" />
                    </React.Fragment>
                ))}
            </List>
        ) : (
            <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '20px' }}>
                No requests
            </Typography>
        )}
    </div>
);
}

export default Requests;