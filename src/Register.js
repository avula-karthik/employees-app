import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Register = () => {
    const navigate = useNavigate();
    const registerUser = (e) => {
        e.preventDefault();
        let email = e.target.email.value;
        let password = e.target.password.value;
        axios
            .post('/users/register', { email, password })
            .then((res) => {
                if (res.status === 200) {
                    alert('Registered successfully');
                }
            })
            .catch((error) => {
                if (error.response.status === 409) {
                    alert(
                        'User already registered. Please create an account with another email'
                    );
                } else {
                    alert('Something failed. Please try after sometime');
                }
            });
    };
    return (
        <div className='App displayHome'>
            <h4 className='mt-4 displayHomeAppName'>
                Welcome to Registration page
            </h4>
            <hr />
            <Form className='FormAuthentication' onSubmit={registerUser}>
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
                    <Button color='success'>Register</Button>
                    <Button
                        color='danger'
                        className='m-3 btn-md'
                        onClick={() => navigate('/')}
                    >
                        Go Back
                    </Button>
                    <Button color='danger' onClick={() => navigate('/login')}>
                        Login
                    </Button>
                </div>
            </Form>
        </div>
    );
};
export default Register;
