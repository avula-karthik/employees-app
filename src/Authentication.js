import { Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

//initial screen with authentication and app details with navigations to login and registration
const Authentication = () => {
    const navigate = useNavigate();
    return (
        <div className='displayHome mt-4'>
            <h2>Welcome to </h2>
            <h1 className='displayHomeAppName'>EMPLOYEE APP</h1>
            <p>An Application to maintain all your employee details</p>
            <hr />
            <Button
                color='primary'
                className='m-3 btn-md'
                onClick={() => navigate('/login')}
            >
                Login
            </Button>
            <Button
                color='primary'
                className='m-3 btn-md'
                onClick={() => navigate('/register')}
            >
                Register
            </Button>
        </div>
    );
};
export default Authentication;
