import React, {useState} from 'react';
import './style.css';
import mylogo from './pictures/mylogo.png';
import {useNavigate} from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function WelcomeStudent()
{
    interface Teacher {
        firstName: string;
        lastName: string;
        username: string;
        city: string;
        cost: number;
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
    
    const navigate = useNavigate();
    const location = useLocation();
    const {student} = location.state;
    console.log("student: "+student.username);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
    const [showTeachers,setShowTeachers] = useState(false);
    const [searchVal,setSearchVal] = useState("");
    const getTeachersList = async (event: React.MouseEvent<HTMLButtonElement>) => {
        
    const apiUrl = 'https://xw778bjxn4.execute-api.us-east-1.amazonaws.com/Deployment/getTeachersRes';
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
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
function handleInputChange(event: React.ChangeEvent<HTMLInputElement>)
{
    setSearchVal(event.target.value);
    const filterBySearch = teachers.filter((teacher) =>
        `${teacher.firstName} ${teacher.lastName}`.toLowerCase().startsWith(event.target.value.toLowerCase())
    );
    setFilteredTeachers(filterBySearch);
}
function teacherClick(teacher:Teacher)
{
    console.log("teacher: "+teacher.username);
    const teacher_student_details = {teacher,student}
    navigate('/teacher-info',{state:{teacher_student_details}});
}

return (
    <div className="page-container">
        <img src={mylogo} alt="My Logo" />
        <h1 dir='rtl'>שלום, {student.firstName}</h1>
        <button onClick={getTeachersList}>מציאת מורה חדש</button>
        {showTeachers && (<>
            <input value={searchVal} onChange={handleInputChange} placeholder='חיפוש מורה'></input>
            <div className='teacherList'>
                {filteredTeachers.length > 0 ? (
                    <ul className='teacherItem'>
                        {filteredTeachers.map((teacher: any, index: number) => (
                            <li onClick={()=>{teacherClick(teacher)}} key={index} className="teacherItem">
                                <h2 className='teacherName'>{teacher.firstName} {teacher.lastName}</h2>
                                <p className='teacherLocation'>{teacher.city}</p>
                                <p className='teacherCost'>₪{teacher.cost}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>אין מורים זמינים</p> // Message only shown if teachers array is empty
                )}
            </div>
            </>)}
    </div>
    
    );
}
export default WelcomeStudent;