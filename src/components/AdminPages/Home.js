import { useNavigate, Link, Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthProvider";
import axios from "../../api/axios";



const PROFILE_URL = '/admin/auth/profile';
const UPLOAD_PHOTO_URL = '/admin/photo'

const Home = () => {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const access_token = localStorage.getItem('access_token');
    const [username, setUsername] = useState('');
    const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${access_token}`
    }

    const getUsername = async () => {
        const { data } = await axios.get(PROFILE_URL, {
            headers: {...headers}
        });
        setUsername(data.username);
      };

    useEffect(() => {
        getUsername();
    }, []);
    
    const logout = async () => {
        
        setAuth({});
        localStorage.removeItem('access_token');
        navigate('/');
    }


    return (
        <div className="wrapper">
            <section className="sideBar">
                <h3>Hello {username}!</h3>
                <p>You are logged in!</p>
                <br />
                <Link to="register">Register new account</Link>
                <Link to="media_manager">Media Manager</Link>
                <Link to="create_new_post">Create new post</Link>
                <div className="flexGrow">
                    <button onClick={logout} className="regButton">Sign Out</button>
                </div>
            </section>
            <Outlet/>
        </div>
    )
}

export default Home