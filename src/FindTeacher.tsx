import React, { useState } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import mylogo from './pictures/mylogo.png';
import carsBackground from './pictures/cars_background2.jpg';
import SearchIcon from '@mui/icons-material/Search';
import  { SelectChangeEvent } from '@mui/material/Select';
import {Select,FormControl,MenuItem,InputLabel,Avatar,Box,Button,Divider,List,ListItem,ListItemAvatar,ListItemText,TextField,Typography,InputAdornment,
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
  const [selected,setSelected] = useState("");

  async function getTeachersList  (event: React.MouseEvent<HTMLButtonElement>) {
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
    console.log("in handle");
    const value = event.target.value;
    setSelected(value);
    // Perform sorting based on the selected value
    let sortedTeachers = [...teachers];
    if (value === "מהזול ליקר") {
      sortedTeachers.sort((a, b) => a.cost - b.cost);
    } else if (value === "מהיקר לזול") {
      sortedTeachers.sort((a, b) => b.cost - a.cost);
    }
    setFilteredTeachers(sortedTeachers);
  }
  

  return (
    <Box
      sx={{
        display: 'flex',
        width: '70vw',
        height: '90vh',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        maxHeight: '500vh',
        backgroundImage: `url(${carsBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: 4,
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
      }}
    >
    <img src={mylogo}></img>

    <Typography variant="h5" fontSize="48px" fontFamily={'Roboto'} textAlign="center" dir="rtl" sx={{ mb: 2 }}>
      שלום, {student.firstName}
    </Typography>
    <Avatar
      src={student.profilePicture || '/path/to/default/image.jpg'}
      alt={`${student.firstName} ${student.lastName}`}
      sx={{ width: 100, height: 100, margin: 'auto', mb: 2 }}
    />
    <Button
      variant="contained"
      color="primary"
      onClick={getTeachersList}
      sx={{ mb: 2, fontSize: '16px', px: 3 }}
    >
      מציאת מורה חדש
    </Button>

    {showTeachers ? (
      <>
        <TextField
          dir="rtl"
          value={searchVal}
          onChange={handleInputChange}
          placeholder="חיפוש מורה"
          variant="outlined"
          fullWidth
          sx={{
            mb: 2,
            bgcolor: 'white',
            borderRadius: 1,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
      <InputLabel dir="rtl" id="demo-simple-select-standard-label">מיין לפי</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={selected}
          onChange={handleChange}
        >
      <MenuItem value="מהזול ליקר">מהזול ליקר</MenuItem>
      <MenuItem value="מהיקר לזול">מהיקר לזול</MenuItem>
        </Select>
  </FormControl>
  <List
        sx={{
          width: '100%',
          maxHeight: '500px',
          overflowY: 'auto',
          bgcolor: 'background.paper',
        }}
      >
    {filteredTeachers.map((teacher, index) => (
      <React.Fragment key={index}>
        <ListItem
          alignItems="flex-start"
          onClick={() => teacherClick(teacher)}
          sx={{ textAlign: 'right', direction: 'rtl' }}
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
                  {'Cost: ₪' + teacher.cost}
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
      <Typography textAlign="center" color="text.secondary">
        אין מורים זמינים
      </Typography>
    )}
    </Box>
  </Box>
  );
}
export default FindTeacher;