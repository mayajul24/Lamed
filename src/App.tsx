import React from 'react';
import logo from './logo.svg';
import WelcomePage from './WelcomePage';
import './App.css';
import Login from './Login';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import CreateStudent from './CreateStudent';
import { Amplify } from 'aws-amplify';
import CreateTeacher from './CreateTeacher';
import awsConfig from './aws-exports';
import WelcomeTeacher from './WelcomeTeacher';
import WelcomeStudent from './WelcomeStudent';
import TeacherInfo from './TeacherInfo';
import Requests from './Requests';
import Students from './Students';
Amplify.configure(awsConfig as any);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="welcome-page" element = {<WelcomePage/>}/>
        <Route path='/' element={<Login />}/>
        <Route path='create-student' element={<CreateStudent/>}/>
        <Route path='create-teacher' element={<CreateTeacher/>}/>
        <Route path='welcome-teacher' element={<WelcomeTeacher/>}/>
        <Route path='welcome-student' element={<WelcomeStudent/>}/>
        <Route path='teacher-info' element={<TeacherInfo/>}/>
        <Route path='requests' element={<Requests/>}/>
        <Route path='students' element={<Students/>}/>
        

        
      </Routes>
    </Router>
  );
}

export default App;
