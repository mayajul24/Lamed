import React, {useState} from 'react';
import './style.css';
import mylogo from './pictures/mylogo.png';
import StudentLogin from './Login';
import {useNavigate} from 'react-router-dom';
function WelcomePage()
{
    const navigate = useNavigate();
    function handleLogin(userType:string)
    {
        if(userType==="student")
        {
            navigate('/create-student',{state: userType});
        }
        else
        {
            navigate('/create-teacher',{state:userType});
        }
    }
    
    return (<div className="page-container">
                <img src={mylogo}/>
                <br/>
                <button className='button' onClick={()=>handleLogin("student")}>!אני תלמיד</button>
                <button className='button' onClick={()=>handleLogin("teacher")}>!אני מורה</button>
            </div> 
    )
}
export default WelcomePage;