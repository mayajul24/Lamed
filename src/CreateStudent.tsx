import React, { useState } from 'react';
import mylogo from './pictures/mylogo.png';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './style.css';
function CreateStudent()
{
    const navigate = useNavigate();
    const [firstName,setFirstName] = useState("");
    const [lastName,setLastName] = useState("");
    const [city,setCity] = useState("");
    const [age,setAge] = useState(0);
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
    function handleAge(event:React.ChangeEvent<HTMLInputElement>)
    {
        setAge(parseInt(event.target.value));
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
        
        const studentData = {
            "firstName": firstName,
            "lastName": lastName,
            "city": city,
            "age": age,
            "username": username,
            "password": password,
        }
        const apiUrl = 'https://xw778bjxn4.execute-api.us-east-1.amazonaws.com/Deployment/createStudentRes';
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Response from Lambda:', data);
            if(data.succeeded)
            {
                const firstName = data.user.FirstName;
                navigate('/welcome-student',{state: {firstName}});
            } 

        } catch (error) {
            console.error('Error sending data to Lambda:', error);
        }
    };

    return (
        <div className='page-container'>
            <h1>הרשמה</h1>
            <form className='form-container' onSubmit={handleSubmit}>
                <input value = {firstName} onChange={handleFirstName} placeholder='שם פרטי'></input>
                <input value = {lastName} onChange={handleLastName} placeholder='שם משפחה'></input>
                <input value = {city} onChange={handleCity} placeholder='עיר מגורים'></input>
                <input value = {age} onChange={handleAge} placeholder='גיל' type='number'></input>
                <input value = {username} onChange={handleUsername} placeholder='שם משתמש'></input>
                <input value = {password} onChange={handlePassword} type="password" placeholder='סיסמה'></input>
                <input type="file" onChange={handlePicture} accept="image/*" />
                <button>הגש</button>
                </form>
        </div>
    )
}

export default CreateStudent;