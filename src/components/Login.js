import { useRef, useState, useEffect} from "react"
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import { useNavigate, useLocation } from 'react-router-dom'

const LOGIN_URL = '/admin/auth/login'

const Login = () => {
  const {setAuth} = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  const userRef = useRef();
  const errRef = useRef();
  
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    userRef.current.focus();
  }, [])

  useEffect(() => {
    setErrMsg('');
  }, [username, password])

  function getTimeExpiresToken() {
    const currentTime = Date.now();
    const threeHoursInMs = 3*60*60*1000;
    const expireTime = currentTime + threeHoursInMs;

    return (
        expireTime.toString()
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try{
        const response = await axios.post(LOGIN_URL, 
            JSON.stringify({username, password}),
            {
                headers: {"Content-Type": "application/json"}
            }
        );
        console.log(JSON.stringify(response?.data));
        const access_token = response?.data?.access_token;
        localStorage.setItem('access_token', `${access_token}`);
        localStorage.setItem('expireTime', getTimeExpiresToken());
        setAuth({username, password, access_token})
        setUserName('');
        setPassword('');
        navigate(from, {replace: true});
    } catch(err) {
        if (!err?.response){
            setErrMsg('No Server Response');
        } else {
            setErrMsg(err.response.data.message)
        }
        errRef.current.focus();
    }

    
  }

  return (
    
    <section>
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
            {errMsg}
        </p>
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input 
                type="text" 
                id="username"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUserName(e.target.value)}
                value={username}
                required
            />

            <label htmlFor="password">Password:</label>
            <input 
                type="password" 
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
            />
            <button className="regButton">Sign In</button>
        </form>
        
    </section>
  )
}


export default Login