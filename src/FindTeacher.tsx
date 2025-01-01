import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import mylogo from './pictures/mylogo.png';
import SearchIcon from '@mui/icons-material/Search';
import { SelectChangeEvent } from '@mui/material/Select';
import {Select,DialogActions,Dialog,DialogTitle,DialogContent,DialogContentText,FormControl,MenuItem,InputLabel,Avatar,Box,Button,Divider,List,ListItem,ListItemAvatar,ListItemText,TextField,Typography,InputAdornment,Container,
} from '@mui/material';

function FindTeacher() {
  interface Teacher {
    firstName: string;
    lastName: string;
    username: string;
    city: string;
    cost: number;
    profilePicture: string;
  }
  interface Student {
    firstName: string;
    lastName: string;
    username: string;
    teacher: string;
    profilePicture: string;
  }

  interface TeacherStudentDetails {
    teacher: Teacher;
    student: Student;
  }

  const navigate = useNavigate();
  const location = useLocation();
  const { student } = location.state;
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [showTeachers, setShowTeachers] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [selected, setSelected] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  
  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  useEffect(()=> {const getTeachersList = async()=>{
    const apiUrl = process.env.REACT_APP_GET_TEACHERS_URL!;
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Response from Lambda:', data);
      if (data.succeeded) {
        setTeachers(data.teachers);
        setFilteredTeachers(data.teachers);
        setShowTeachers(true);
      } else {
        console.error('Failed to fetch teachers');
      }
    } catch (error) {
      console.error('Error sending data to Lambda:', error);
    }
  
  };
getTeachersList();
 },[]);
   

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchVal(event.target.value);
    const filterBySearch = teachers.filter(
      (teacher) =>
        `${teacher.firstName} ${teacher.lastName}`
          .toLowerCase()
          .startsWith(event.target.value.toLowerCase())
    );
    setFilteredTeachers(filterBySearch);
  }

  function teacherClick(teacher: Teacher) {
    console.log('teacher: ' + teacher.username);
    const teacher_student_details = { teacher, student };
    navigate('/teacher-info', { state: { teacher_student_details } });
  }

  function handleChange(event: SelectChangeEvent) {
    const value = event.target.value;
    setSelected(value);
    let sortedTeachers = [...teachers];
    if (value === "מהזול ליקר") {
      sortedTeachers.sort((a, b) => a.cost - b.cost);
    } else if (value === "מהיקר לזול") {
      sortedTeachers.sort((a, b) => b.cost - a.cost);
    }
    setFilteredTeachers(sortedTeachers);
  }

  return (
    <Container sx={{ width:"100vh",height: '100vh', py: 2 }}>
      <Box
        sx={{
          height: '90%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 1,
          overflow: 'hidden', 
        }}
      >
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <img 
            src={mylogo} 
            alt="Logo" 
            style={{ 
              maxWidth: '150px', 
              display: 'block', 
              margin: '0 auto 1rem' 
            }} 
          />

          <Typography 
            variant="h4" 
            fontFamily={'Roboto'} 
            textAlign="center" 
            dir="rtl" 
            sx={{ mb: 2 }}
          >
            שלום, {student.firstName}
          </Typography>

          <Avatar
            src={student.profilePicture || '/path/to/default/image.jpg'}
            alt={`${student.firstName} ${student.lastName}`}
            sx={{ 
              width: 80, 
              height: 80, 
              mx: 'auto', 
              mb: 2 
            }}
          />
        </Box>

        <Box sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {showTeachers ? (
            <>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <TextField
                    dir="rtl"
                    value={searchVal}
                    onChange={handleInputChange}
                    placeholder="חיפוש מורה"
                    variant="outlined"
                    size="small"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel dir="rtl">מיין לפי</InputLabel>
                    <Select
                      value={selected}
                      onChange={handleChange}
                      label="מיין לפי"
                    >
                      <MenuItem value="מהזול ליקר">מהזול ליקר</MenuItem>
                      <MenuItem value="מהיקר לזול">מהיקר לזול</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <List 
                sx={{ 
                  flexGrow: 1,
                  overflow: 'auto',
                  maxHeight: '100%',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: 'background.paper',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#bbb',
                    borderRadius: '4px',
                  },
                }}
              >
                {filteredTeachers.map((teacher, index) => (
                  <React.Fragment key={index}>
                    <ListItem
                      alignItems="flex-start"
                      onClick={() => setOpenConfirmDialog(true)}
                      sx={{ 
                        textAlign: 'right', 
                        direction: 'rtl',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          alt={`${teacher.firstName} ${teacher.lastName}`}
                          src={teacher.profilePicture || '/path/to/default/image.jpg'}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="h6" dir="rtl">
                            {teacher.firstName} {teacher.lastName}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{ color: 'text.primary', display: 'block' }}
                            >
                              {teacher.city}
                            </Typography>
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{ color: 'text.primary', display: 'block' }}
                            >
                              {'מחיר: ₪' + teacher.cost}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            </>
          ) : (
            <Typography textAlign="center" color="text.secondary" sx={{ p: 3 }}>
              Loading
            </Typography>
          )}
        </Box>
        <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
          <DialogTitle>הגש בקשה</DialogTitle>
          <DialogContent>
              <DialogContentText>
                  האם אתה בטוח שאתה רוצה להיות תלמיד שלו?
              </DialogContentText>
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} color="secondary">
                        לא
                    </Button>
                    <Button 
                    onClick={()=>{}}  
                    color="primary" 
                        autoFocus
                    >
                        כן
                    </Button>
                </DialogActions>
            </Dialog>
      </Box>
    </Container>
  );
}

export default FindTeacher;