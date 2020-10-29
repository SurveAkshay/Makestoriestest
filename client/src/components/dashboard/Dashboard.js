import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import API from '../../axios'; 
import UserCard from '../userCard/UserCard';

import './dashboard.css';

const Dashboard = () => {
    const [user,setUser] = useState({});
    const[userToken,setToken] = useState('');
    let history = useHistory();
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if(!token) {
            swal("Please login ! Redirecting to login page", {
                buttons: false,
                timer: 3000,
            }).then(() => history.push('/login')); 
        } else {
            setToken(token);
            const user = JSON.parse(localStorage.getItem('user'));
            setUser(user);
        }
    },[]);

    const handleLogout = async ()=> {
        let config = {
            headers: {
                Authorization : `Bearer ${userToken}`
            }
        }
        try {
            const response = await API.post('user/logout',null, config)
            // console.log("response", response);
            if(response.status === 200) {
              localStorage.clear();
              history.push('/login');
              window.location.reload(false);
            }
        } catch(err) {
            console.log(`Axios request failed: ${err}`);
        }
        
    }

    const handleLogoutAll = async () => {
        let config = {
            headers: {
                Authorization : `Bearer ${userToken}`
            }
        }
        try {
            const response = await API.post('user/logoutAll',null, config)
            // console.log("response", response);
            if(response.status === 200) {
              localStorage.clear();
              history.push('/login');
              window.location.reload(false);
            }
        } catch(err) {
            console.log(`Axios request failed: ${err}`);
        }
    }

    return (
        <>
        <nav className="navbar navbar-dark bg-dark d-flex flex-row justify-content-between">
            <h1 className="navbar-brand" >Navbar</h1>
            <ul className="navbar-nav ml-auto">
                <li className="nav-item dropdown active">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Welcome {user.firstName}
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <Link className="dropdown-item" to='/edit'>Manage account</Link>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#" onClick={handleLogout}>Logout</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#" onClick={handleLogoutAll}>Logout from all devices</a>
                    </div>
                </li>
            </ul>
        </nav>
        <UserCard user={user} />
        </>
    )
}

export default Dashboard;
