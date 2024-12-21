import React from 'react';
import logo from './logo.svg';
import WelcomePage from './WelcomePage';
import './App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import HomeTeacher from './HomeTeacher';
import FindTeacher from './FindTeacher';
import TeacherInfo from './TeacherInfo';
import Requests from './Requests';
import Students from './Students';
import StudentLessonBooking from './NewLesson';
import HomeStudent from './HomeStudent';
import SignIn from './signIn';
import TeacherSignUp from './TeacherSignUp';
import StudentSignUp from './StudentSignUp';
import Lessons from './Lessons';
import TeacherSlots from './TeacherSlots';
import Main from './Main';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="welcome-page" element = {<WelcomePage/>}/>
        <Route path='/' element={<Main />}/>
        <Route path='home-teacher' element={<HomeTeacher/>}/>
        <Route path='find_teacher' element={<FindTeacher/>}/>
        <Route path='teacher-info' element={<TeacherInfo/>}/>
        <Route path='/home-student' element={<HomeStudent/>}/>
        <Route path='home-teacher' element={<HomeTeacher/>}/>            
        <Route path='/schedule-lesson' element={<StudentLessonBooking/>}/>
        <Route path='teacher-sign-up' element={<TeacherSignUp/>}/>
        <Route path='student-sign-up' element={<StudentSignUp/>}/>
        <Route path='lessons' element={<Lessons/>}/>
      </Routes>
    </Router>
  );
}

export default App;
