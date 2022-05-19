import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const loginUser = (e) => {
        e.preventDefault();
        let email = e.target.email.value;
        let password = e.target.password.value;
        axios
            .post('/users/login', { email, password })
            .then((res) => {
                try {
                    if (
                        res.status === 200 &&
                        res.statusText === 'OK' &&
                        res.data.token
                    ) {
                        alert('successfully logged in');
                        localStorage.setItem('token', res.data.token);
                        localStorage.setItem('isLoggedIn', 1);
                        navigate('/home');
                        setTimeout(() => {
                            window.location.reload();
                        }, 500);
                    } else {
                        alert('Didnt login');
                    }
                } catch (error) {
                    console.log(error);
                }
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    alert(
                        'Problem with server. Check whether server is running'
                    );
                } else {
                    alert('Invalid credentials');
                }
            });
    };
    return (
        <div className='App displayHome'>
            <h4 className='mt-4 displayHomeAppName'>Welcome to Login page </h4>
            <hr />
            <Form className='FormAuthentication' onSubmit={loginUser}>
                <FormGroup>
                    <Label for='userEmail'>Email</Label>
                    <Input
                        id='userEmail'
                        name='email'
                        placeholder='Enter email..'
                        type='email'
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label for='userPassword'>Password</Label>
                    <Input
                        id='userPassword'
                        name='password'
                        placeholder='Enter password..'
                        type='password'
                        required
                    />
                </FormGroup>
                <div className='text-center'>
                    <Button color='success'>Login</Button>
                    <Button
                        color='danger'
                        className='m-3 btn-md'
                        onClick={() => navigate('/')}
                    >
                        Go Back
                    </Button>
                    <Button
                        color='danger'
                        onClick={() => navigate('/register')}
                    >
                        Register
                    </Button>
                </div>
            </Form>
        </div>
    );
};
export default Login;
