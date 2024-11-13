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

function Students()
{
    const location = useLocation();
    const {username} = location.state;
    const [students, setStudents] = useState<Student[]>([]);
    const teacherUsername = username;
    const [isLoading, setIsLoading] = useState(true); // Add a loading state

    interface Student {
        firstName: string,
        lastName: string,
        city: string,
        age: number,
        username: string
    }
    useEffect(()=>{
        const getStudents = async () => {
        
            const apiUrl = 'https://xw778bjxn4.execute-api.us-east-1.amazonaws.com/Deployment/getStudentsRes';
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
    }
    
    return (
        <div style={{ maxWidth: 800, width: 600, height: 600 ,margin: 'auto', padding: '20px' }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: '#00796b', fontSize: '2rem' }}>
            </Typography>
            {isLoading ? (
            <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '20px' }}>
                Loading...
            </Typography>): students.length > 0 ? (
            <List sx={{ bgcolor: 'background.paper', borderRadius: 1, boxShadow: 2, padding: '20px' }}>
                {students.map((student) => (
                    <React.Fragment key={student.username}>
                        <ListItem alignItems="flex-start" sx={{ display: 'flex', justifyContent: 'space-between', padding: '15px' }}>
                            <div>
                                <Typography variant="h6" sx={{ marginBottom: 1, fontSize: '1.25rem' }}>
                                    {student.firstName} {student.lastName}
                                </Typography>
                                <Typography variant="body2" color="primary" sx={{ marginBottom: 1, fontSize: '1rem' }}>
                                    {student.city}
                                </Typography>
                                <Typography variant="body2" sx={{ marginBottom: 1, fontSize: '1rem' }}>
                                    {student.age}
                                </Typography>
                            </div>
                        </ListItem>
                        <Divider component="li" />
                    </React.Fragment>
                ))}
            </List>
        ) : (
            <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '20px' }}>
                No Students
            </Typography>
        )}
    </div>
);
}

export default Students;