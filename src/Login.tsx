import React, { useState } from 'react';
import './style.css'; 
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import mylogo from './pictures/mylogo.png';

function Login()
{
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    function handleUsername(event:React.ChangeEvent<HTMLInputElement>)
    {
        setUsername(event.target.value);
    }
    function handlePassword(event:React.ChangeEvent<HTMLInputElement>)
    {
        setPassword(event.target.value);
    }
    function handleCreate()
    {
      navigate("/welcome-page");
    }

    const handleLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
        const apiUrl = "https://xw778bjxn4.execute-api.us-east-1.amazonaws.com/Deployment/loginRes";
        const user_data = {
                "username":username,
                "password":password   
        }
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user_data)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            console.log('Response from Lambda:', data);
            if(data.succeeded)
            {
                const firstName = data.user.firstName;
                const userType = data.user.userType;
                const user = data.user;
                if(userType==="teacher")
                {
                    const teacher = user;
                    navigate('/welcome-teacher',{state: {teacher}});
                }
                else{
                    const student = user;
                    navigate('/welcome-student',{state: {student}});

                } 
            }
            else{
                alert("שם משתמש או סיסמה לא נכונים");
            }            

        } catch (error) {
            console.error('Error sending data to Lambda:', error);
        }
    };

    return (<div className="page-container">
        <img src={mylogo}></img>
        <input value = {username} onChange={handleUsername} placeholder='שם משתמש'></input>
        <br/>
        <input value = {password} onChange={handlePassword} type="password" placeholder='סיסמה'></input>
        <br/>
        <button onClick={handleLogin}>כניסה</button>
        <br/>
        <a href="" onClick={handleCreate}>?עדיין אין לך חשבון</a>
        </div>)
}
export default Login;