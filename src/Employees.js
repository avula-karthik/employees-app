import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import {
    Card,
    CardImg,
    CardBody,
    CardTitle,
    CardSubtitle,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
} from 'reactstrap';

const Employees = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    let [employeesData, setEmployeesData] = useState([]);
    let [departmentsData, setDepartmentsData] = useState([]);
    let [inputName, setInputName] = useState();
    let [inputEmail, setInputEmail] = useState();
    let [inputRole, setInputRole] = useState();
    let [inputDepartment, setInputDepartment] = useState();
    let [inputStatus, setInputStatus] = useState();
    const [file, setFile] = useState();
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const saveFile = (e) => {
        setFile(e.target.files[0]);
    };
    //modal for editing employee details
    const [editModal, setEditModal] = useState(false);
    const editToggle = () => {
        setEditModal(!editModal);
    };
    const [idToDelete, setIdToDelete] = useState();
    //modal for deleting employees
    const [deleteModal, setDeleteModal] = useState(false);
    const deleteToggle = () => {
        setDeleteModal(!deleteModal);
    };
    //Method to get single employee data
    const getSingleEmployeeDataAndSave = (id) => {
        axios.get(`/employees/${id}`, { headers: { token } }).then((res) => {
            if (res.status === 200) {
                setEditedName(res.data.data.name);
                setEditedMail(res.data.data.email);
                setEditedRole(res.data.data.role);
                setToEditUserID(res.data.data.id);
            } else {
                alert('Session expired or no user exists');
            }
        });
    };
    //delete employee by id
    const deleteEmployee = (id) => {
        axios
            .delete(`/employees/${id}`, {
                headers: {
                    token,
                },
            })
            .then((res) => {
                getEmployeeDataAndSet();
            })
            .catch((error) => {
                console.log(error);
                getEmployeeDataAndSet();
            });
    };
    //method to save editted data and clearing the editted values in usestate after request is done
    const saveEdittedData = (e) => {
        e.preventDefault();
        axios({
            method: 'PUT',
            url: `/employees/${toEditUserID}`,
            data: {
                name: editedName,
                email: editedMail,
                deptID: editedDepartment,
                role: editedRole,
                isActive: editedStatus,
            },
            headers: { token },
        })
            .then(() => {
                editToggle();
                setTimeout(() => {
                    setEditedName();
                    setEditedMail();
                    setEditedRole();
                    setEditedDepartment();
                    setEditedStatus();
                    getEmployeeDataAndSet();
                }, 1000);
            })
            .catch((error) => {
                if (error.response.status === 400) {
                    alert(
                        'Invalid content. Please check email, names fields and validate'
                    );
                } else {
                    console.log(error);
                }
            });
    };

    //method to validate the user email input
    function ValidateEmail(mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(inputEmail)) {
            return true;
        }
        return false;
    }
    function validateName(name) {
        if (/^[A-Za-z]+$/.test(inputName)) {
            return true;
        }
        return false;
    }

    const formSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', inputName);
        formData.append('email', inputEmail);
        formData.append('deptID', inputDepartment);
        formData.append('role', inputRole);
        formData.append('isActive', inputStatus);
        formData.append('imageurl', file);

        if (
            typeof inputName === 'undefined' ||
            typeof inputEmail === 'undefined' ||
            typeof inputRole === 'undefined' ||
            typeof inputStatus === 'undefined' ||
            ValidateEmail(inputEmail) === false ||
            validateName(inputName) === false
        ) {
            alert('Please fill and validate all required fields ');
        } else {
            try {
                axios({
                    method: 'POST',
                    url: '/employees',
                    data: formData,
                    headers: { token },
                })
                    .then((res) => {
                        console.log('adding employee', res);
                        if (res.data === 'No such department') {
                            alert('Please select department..');
                        } else {
                            toggle();
                            alert('Employee Added Successfully');
                            setFile();
                            getEmployeeDataAndSet();
                        }
                    })
                    .catch((error) => {
                        if (error.response.status === 409) {
                            alert('User already exists with email');
                        } else {
                            alert('Something went wrong, please login again');
                        }
                    });
            } catch (ex) {
                console.log(ex);
            }
        }
    };

    const [editedName, setEditedName] = useState();
    let [editedMail, setEditedMail] = useState();
    let [editedRole, setEditedRole] = useState();
    let [editedDepartment, setEditedDepartment] = useState();
    let [editedStatus, setEditedStatus] = useState();
    let [toEditUserID, setToEditUserID] = useState();
    const [pageNumber, setPageNumber] = useState(0);

    const employeesPerPage = 9;
    const pagesVisited = pageNumber * employeesPerPage;
    const displayEmployees = employeesData
        .slice(pagesVisited, pagesVisited + employeesPerPage)
        .map((val, index) => {
            return (
                <Card className='employee_card' key={index}>
                    <CardImg
                        className='employee_image'
                        top
                        width='100%'
                        src={val.imageurl}
                        alt='Employee Image'
                    />
                    <CardBody>
                        <CardTitle>
                            <h4>{val.name}</h4>
                        </CardTitle>
                        <CardSubtitle>
                            <p>Role: {val.role}</p>
                            <p>Employee ID : {val.id}</p>
                        </CardSubtitle>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='16'
                            height='16'
                            fill='currentColor'
                            className='bi bi-envelope-fill'
                            viewBox='0 0 16 16'
                        >
                            <path d='M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z' />
                        </svg>{' '}
                        {val.email}
                        <p>
                            {' '}
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='16'
                                height='16'
                                fill='currentColor'
                                className='bi bi-clock-history'
                                viewBox='0 0 16 16'
                            >
                                <path d='M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z' />
                                <path d='M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z' />
                                <path d='M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z' />
                            </svg>{' '}
                            Status :{val.isActive ? 'Active' : 'In-Active'}
                        </p>
                        {departmentsData.map((depVal) => {
                            if (depVal.id === val.deptID) {
                                return (
                                    <p key={depVal.id}>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            width='16'
                                            height='16'
                                            fill='currentColor'
                                            className='bi bi-people-fill'
                                            viewBox='0 0 16 16'
                                        >
                                            <path d='M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' />
                                            <path
                                                fillRule='evenodd'
                                                d='M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z'
                                            />
                                            <path d='M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z' />
                                        </svg>{' '}
                                        {depVal.dept_name}
                                    </p>
                                );
                            }
                        })}
                        <p>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='16'
                                height='16'
                                fill='currentColor'
                                className='bi bi-facebook m-2'
                                viewBox='0 0 16 16'
                            >
                                <path d='M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z' />
                            </svg>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='16'
                                height='16'
                                fill='currentColor'
                                className='bi bi-twitter m-2'
                                viewBox='0 0 16 16'
                            >
                                <path d='M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z' />
                            </svg>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='16'
                                height='16'
                                fill='currentColor'
                                className='bi bi-instagram m-2'
                                viewBox='0 0 16 16'
                            >
                                <path d='M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z' />
                            </svg>
                        </p>
                    </CardBody>

                    <Button
                        className='m-3'
                        color='primary'
                        onClick={() => {
                            editToggle();
                            getSingleEmployeeDataAndSave(val.id);
                        }}
                    >
                        {' '}
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='16'
                            height='16'
                            fill='currentColor'
                            className='bi bi-pencil-square'
                            viewBox='0 0 16 16'
                        >
                            <path d='M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z' />
                            <path
                                fillRule='evenodd'
                                d='M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z'
                            />
                        </svg>{' '}
                        Edit
                    </Button>

                    <Modal isOpen={editModal} toggle={editToggle}>
                        <ModalHeader>Editing Employee Details</ModalHeader>
                        <ModalBody>
                            <Form
                                className='FormAuthentication'
                                onSubmit={saveEdittedData}
                            >
                                <h4>Editing user details form</h4>
                                <FormGroup>
                                    <Label>Name : </Label>
                                    <Input
                                        type='text'
                                        name='userEditName '
                                        value={editedName}
                                        onInput={(e) =>
                                            setEditedName(e.target.value)
                                        }
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Email :</Label>
                                    <Input
                                        type='email'
                                        name='userEditEmail'
                                        value={editedMail}
                                        onInput={(e) =>
                                            setEditedMail(e.target.value)
                                        }
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Choose Department</Label>
                                    <select
                                        defaultValue='1'
                                        className='m-3'
                                        onChange={(e) =>
                                            setEditedDepartment(e.target.value)
                                        }
                                    >
                                        {departmentsData.map((val) => {
                                            return (
                                                <option value={val.id}>
                                                    {val.dept_name}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Status</Label>
                                    <select
                                        className='m-3'
                                        onChange={(e) => {
                                            setEditedStatus(e.target.value);
                                        }}
                                    >
                                        <option value='' selected>
                                            select status
                                        </option>
                                        <option value='true'>Active</option>
                                        <option value='false'>Inactive</option>
                                    </select>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Role</Label>
                                    <Input
                                        value={editedRole}
                                        type='text'
                                        onInput={(e) => {
                                            setEditedRole(e.target.value);
                                        }}
                                    />
                                </FormGroup>
                                <div className='text-center'>
                                    <Button
                                        color='success'
                                        onClick={saveEdittedData}
                                    >
                                        Save Details
                                    </Button>
                                </div>
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button color='danger' onClick={editToggle}>
                                Go Back
                            </Button>
                        </ModalFooter>
                    </Modal>

                    <Button
                        onClick={() => {
                            setIdToDelete(val.id);
                            deleteToggle();
                        }}
                        color='danger'
                    >
                        {' '}
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='16'
                            height='16'
                            fill='currentColor'
                            className='bi bi-trash-fill'
                            viewBox='0 0 16 16'
                        >
                            <path d='M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z' />
                        </svg>
                        Delete
                    </Button>
                    <Modal isOpen={deleteModal} toggle={deleteToggle}>
                        <ModalHeader>Deleting user</ModalHeader>
                        <ModalBody>
                            <p>
                                Deleting an employee will remove his/her data
                                from the database. Are you sure you want to
                                delete ?
                            </p>
                            <Button
                                color='danger'
                                onClick={() => {
                                    deleteEmployee(idToDelete);
                                    deleteToggle();
                                }}
                            >
                                Yes, Delete
                            </Button>
                        </ModalBody>
                        <ModalFooter>
                            <Button color='primary' onClick={deleteToggle}>
                                Go Back
                            </Button>
                        </ModalFooter>
                    </Modal>
                </Card>
            );
        });

    //function to get all employees data and set to the usestate variable
    const getEmployeeDataAndSet = () => {
        axios
            .get('/employees', {
                headers: {
                    token,
                },
            })
            .then((res) => {
                setEmployeesData(res.data.data);
            })
            .catch((error) => {
                alert('Token expired. Please login/register again');
                navigate('/login');
            });
        axios
            .get('/departments', { headers: { token } })
            .then((res) => {
                setDepartmentsData(res.data);
            })
            .catch((error) => {
                return false;
            });
    };

    useEffect(() => {
        getEmployeeDataAndSet();
    }, []);
    //modal for adding employes

    return (
        <div>
            <h3 className='displayHomeAppName mt-2'>
                Displaying All Employees
            </h3>

            <div className='divHeaderEmployeeApp'>
                <button className='btn btn-primary col-5  m-2' onClick={toggle}>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='16'
                        height='16'
                        fill='currentColor'
                        className='bi bi-person-plus-fill m-1'
                        viewBox='0 0 16 16'
                    >
                        <path d='M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' />
                        <path
                            fillRule='evenodd'
                            d='M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z'
                        />
                    </svg>
                    Add Employee
                </button>
                <button
                    className='btn btn-primary col-4'
                    onClick={() => navigate('/departments')}
                >
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='16'
                        height='16'
                        fill='currentColor'
                        className='bi bi-people-fill m-1'
                        viewBox='0 0 16 16'
                    >
                        <path d='M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' />
                        <path
                            fillRule='evenodd'
                            d='M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z'
                        />
                        <path d='M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z' />
                    </svg>
                    departments
                </button>
                <button
                    className='btn btn-danger col-2 m-2'
                    onClick={() => {
                        navigate('/login');
                        localStorage.removeItem('token');
                        localStorage.removeItem('isLoggedIn');
                        setTimeout(() => {
                            alert('Logged out successfully');
                        }, 500);
                    }}
                >
                    Logout
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='16'
                        height='16'
                        fill='currentColor'
                        className='bi bi-box-arrow-right m-1'
                        viewBox='0 0 16 16'
                    >
                        <path
                            fillRule='evenodd'
                            d='M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z'
                        />
                        <path
                            fillRule='evenodd'
                            d='M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z'
                        />
                    </svg>
                </button>
            </div>

            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader>Adding Employee </ModalHeader>
                <ModalBody>
                    <Form onSubmit={formSubmit} className='FormAuthentication'>
                        <FormGroup>
                            <Label>Employee Name *</Label>
                            <Input
                                type='text'
                                placeholder='name'
                                name='employeeName'
                                required
                                onChange={(e) => setInputName(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Employee Mail *</Label>
                            <Input
                                type='email'
                                placeholder='email..'
                                name='employeeEmail'
                                required
                                onChange={(e) => setInputEmail(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Employee Image</Label>
                            <Input
                                type='file'
                                accept='image/*'
                                required
                                name='employeeImage'
                                onChange={saveFile}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Choose Department * </Label>
                            <select
                                className='m-3'
                                onChange={(e) =>
                                    setInputDepartment(e.target.value)
                                }
                            >
                                <option>Select Department</option>
                                {departmentsData.map((val) => {
                                    return (
                                        <option value={val.id}>
                                            {val.dept_name}
                                        </option>
                                    );
                                })}
                            </select>
                        </FormGroup>
                        <FormGroup>
                            <Label>Status *</Label>
                            <select
                                className='m-3'
                                onChange={(e) => setInputStatus(e.target.value)}
                                defaultValue='true'
                            >
                                <option value='true'>Select Status</option>
                                <option value='true'>Active</option>
                                <option value='false'>Inactive</option>
                            </select>
                        </FormGroup>
                        <FormGroup>
                            <Label>Role *</Label>
                            <Input
                                type='text'
                                placeholder='role'
                                name='employeeRole'
                                required
                                onChange={(e) => setInputRole(e.target.value)}
                            />
                        </FormGroup>

                        <Button color='success' onClick={formSubmit}>
                            Submit
                        </Button>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color='danger' onClick={toggle}>
                        Go Back
                    </Button>
                </ModalFooter>
            </Modal>
            <div>
                {displayEmployees}
                <ReactPaginate
                    previoudLabel={'Previous'}
                    nextLabel={'Next'}
                    pageCount={Math.ceil(
                        employeesData.length / employeesPerPage
                    )}
                    onPageChange={({ selected }) => {
                        setPageNumber(selected);
                    }}
                    containerClassName={'paginationButtons'}
                    previousLinkClassName={'previousButton'}
                    nextLinkClassName={'nextButton'}
                    disabledClassName={'paginationDisabled'}
                    activeClassName={'paginationActive'}
                />
            </div>
        </div>
    );
};
export default Employees;
