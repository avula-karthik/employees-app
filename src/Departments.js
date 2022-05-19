import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

//Displayng all available departments in table
//consists of logout and go back features/buttons
const Departments = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [departmentsData, setDepartmentsData] = useState([]);

    useEffect(() => {
        axios
            .get('/departments', {
                headers: {
                    token,
                },
            })
            .then((res) => {
                console.log(res);
                setDepartmentsData(res.data);
            })
            .catch((error) => {
                console.log('token expired', error.response.status);
                if (error.response.status === 404) {
                    navigate('/login');
                } else {
                    alert('Something went wrong');
                }
            });
    }, []);

    return (
        <div>
            <h4 className='displayHomeAppName'>Displaying all departments</h4>
            <button
                className='btn btn-primary m-2'
                onClick={() => {
                    navigate('/home');
                }}
            >
                Go Back
            </button>
            <button
                className='btn btn-danger m-2'
                onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('isLoggedIn');
                    navigate('/login');
                }}
            >
                Logout
            </button>
            <table>
                <tr>
                    <th>Department ID</th>
                    <th>Department Name</th>
                </tr>
                {departmentsData.map((val, index) => {
                    return (
                        <tr>
                            <td>{val.id}</td>
                            <td>{val.dept_name}</td>
                        </tr>
                    );
                })}
            </table>
        </div>
    );
};
export default Departments;
