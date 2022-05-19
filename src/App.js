import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Authentication from './Authentication';
import Login from './Login';
import Register from './Register';
import Homepage from './Homepage';
import Departments from './Departments';

function App() {
    return (
        <div className='App'>
            <BrowserRouter>
                <Routes>
                    <Route exact path='/' element={<Authentication />} />
                    <Route exact path='/login' element={<Login />} />
                    <Route exact path='/register' element={<Register />} />
                    <Route exact path='/home' element={<Homepage />} />
                    <Route
                        exact
                        path='/departments'
                        element={<Departments />}
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
