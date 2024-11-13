import React, {useState} from 'react';
import './style.css';
import mylogo from './pictures/mylogo.png';
import {useNavigate} from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function WelcomeTeacher()
{
    interface Teacher {
        firstName: string;
        lastName: string;
        city: string;
        username: string;
    }
    const location = useLocation();
    const {teacher} = location.state;
    const navigate = useNavigate();

    function handleRequests()
    {
        const username = teacher.username;
        console.log("username in welcome "+username);
        navigate('/requests',{state:{username}});
    }
    function handleStudents()
    {
        const username = teacher.username;
        console.log("button clicked");
        navigate('/students',{state:{username}});

    }

    return (<div className="page-container">
                <img src={mylogo}/>
                <h1 dir='rtl'>שלום, {teacher.firstName}</h1>
                <br/>
                <button className='button' onClick={handleRequests} >בקשות</button>
                <button className='button' onClick={handleStudents} >תלמידים</button>
                <button className='button'>שיעורים</button>
            </div> 
    )
}
export default WelcomeTeacher;