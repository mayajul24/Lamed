import React, {useState} from 'react';
import './style.css';
import mylogo from './pictures/mylogo.png';
import {useNavigate} from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function TeacherInfo()
{
    interface Teacher {
        firstName: string;
        lastName: string;
        city: string;
        username: string;
    }
    interface Student {
        firstName: string;
        lastName: string;
        username: string;
    }
    
    interface TeacherStudentDetails {
        teacher: Teacher;
        student: Student;
    }
    const location = useLocation();
    const {teacher_student_details} = location.state;
    console.log(teacher_student_details);
    const teacher = teacher_student_details.teacher;
    console.log("teacher in info: "+teacher_student_details.teacher);
    const student = teacher_student_details.student;
    const req = {"teacherUsername":teacher.username,
                 "studentUsername":student.username};
    
    async function handleRequest(event: React.MouseEvent<HTMLButtonElement>)
    {
        const apiUrl = 'https://xw778bjxn4.execute-api.us-east-1.amazonaws.com/Deployment/requestTeacherRes';
    try {
        const response = await fetch(apiUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Response from Lambda:', data);
        if (data.succeeded) {
            alert("הבקשה נשלחה בהצלחה");

        } else {
            console.error('Failed to fetch');
        }

    } catch (error) {
        console.error('Error sending data to Lambda:', error);
    }
    }     
return (<div className='teacherCard'>
            <img src={mylogo}></img>
            <p className='teacherNameCard'>{teacher.firstName} {teacher.lastName}</p>
            <p className='teacherCityCard'>{teacher.city}</p>
            <p className='teacherCityCard'> ₪{teacher.cost}</p>
            <button onClick={handleRequest} className='requestButton'>הגש בקשה</button>
        </div>)
}
export default TeacherInfo;