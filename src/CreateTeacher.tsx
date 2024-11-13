import React, { useState } from 'react';
import mylogo from './pictures/mylogo.png';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import './style.css';

function CreateTeacher()
{
    const navigate = useNavigate();
    const [firstName,setFirstName] = useState("");
    const [lastName,setLastName] = useState("");
    const [city,setCity] = useState("");
    const [cost,setCost] = useState(0);
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [picture, setPicture] = useState<File | null>(null);

    function handleFirstName(event:React.ChangeEvent<HTMLInputElement>)
    {
        setFirstName(event.target.value);
    }
    function handleLastName(event:React.ChangeEvent<HTMLInputElement>)
    {
        setLastName(event.target.value);
    }
    function handleCity(event:React.ChangeEvent<HTMLInputElement>)
    {
        setCity(event.target.value);
    }
    function handleCost(event:React.ChangeEvent<HTMLInputElement>)
    {
        setCost(parseInt(event.target.value));
    }
    function handleUsername(event:React.ChangeEvent<HTMLInputElement>)
    {
        setUsername(event.target.value);
    }
    function handlePassword(event:React.ChangeEvent<HTMLInputElement>)
    {
        setPassword(event.target.value);
    }
    function handlePicture(event:React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setPicture(file);
        }
    }
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const teacherData = {
            "firstName": firstName,
            "lastName": lastName,
            "cost": cost,
            "city": city,
            "username": username,
            "password": password,
            "picture": picture
        }
        const apiUrl = 'https://xw778bjxn4.execute-api.us-east-1.amazonaws.com/Deployment/createTeacherRes';
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(teacherData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Response from Lambda:', data);
            if(data.succeeded)
            {
                const firstName = data.user.FirstName;
                navigate('/welcome-teacher',{state: {firstName}});              
            } 
        } catch (error) {
            console.error('Error sending data to Lambda:', error);
        }
    };
        
    return (
        <div className='page-container'>
            <h1>הרשמה</h1>
            <form  className='form-container' onSubmit={handleSubmit}>
                <input value={firstName} onChange={handleFirstName} placeholder='שם פרטי'></input>
                <input value={lastName} onChange={handleLastName}placeholder='שם משפחה'></input>
                <input value={city} onChange={handleCity} placeholder='עיר מגורים'></input>
                <input value={cost} onChange={handleCost} placeholder='מחיר לשיעור' type='number'></input>
                <input value={username} onChange={handleUsername} placeholder='שם משתמש'></input>
                <input value={password} onChange={handlePassword} type="סיסמה" placeholder='Password'></input>
                <div className='checkbox-container'>
                    <label className='checkbox-label'>Automatic</label>
                    <input type='checkbox'></input>
                    <label className='checkbox-label'>Gears</label>
                    <input type='checkbox'></input>
                </div>
                <input type="file" onChange={handlePicture} accept="image/*" />
            <button type='submit'>הגש</button>
            </form>
            </div>
        );
}

export default CreateTeacher;