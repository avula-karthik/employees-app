import Employees from './Employees';
import Login from './Login';

const Homepage = () => {
    if (
        localStorage.getItem('isLoggedIn') === '1' &&
        localStorage.getItem('token')
    ) {
        return <Employees />;
    } else {
        return (
            <>
                <p className='displayHomeAppName'>Please login first</p>
                <Login />
            </>
        );
    }
};

export default Homepage;
