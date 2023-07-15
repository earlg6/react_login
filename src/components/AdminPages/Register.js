import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../api/axios'
import { Link } from 'react-router-dom'


const USER_REGEX = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/admin/auth/register'

export default function Register() {
    const userRef = useRef();
    const errRef = useRef();

    const [username, setUserName] = useState('');
    const [validUserName, setValidUserName] = useState(false);
    const [usernameFocus, setUsernameFocus] = useState(false);

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [matchPassword, setMatchPassword] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        const result = USER_REGEX.test(username);
        console.log(result);
        console.log(username);
        setValidUserName(result);
    }, [username])

    useEffect(() => {
        const result = PWD_REGEX.test(password);
        console.log(result);
        console.log(password);
        setValidPassword(result);
        const match = password === matchPassword;
        setValidMatch(match);
    }, [password, matchPassword])

    useEffect(() => {
        setErrMsg('');
    }, [username, password, matchPassword])

    const handleSubmit = async (e) => {
        e.preventDefault();
        //if button enabled with JS hack
        const v1 = USER_REGEX.test(username);
        const v2 = PWD_REGEX.test(password);
        if (!v1 || !v2) {
            setErrMsg('Invalid entry');
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ username, password}),
                {
                    headers: { 'Content-Type': 'application/json'},
                }
            );
            console.log(response.data);
            console.log(response.accessToken);
            console.log(JSON.stringify(response));
            setSuccess(true);
        } catch (err){
            if (!err?.response){
                setErrMsg('No Server Response');
            } else {
                setErrMsg(err.response.data.message)
            }
            errRef.current.focus();
        }
    }


  return (

    <>
    {success ? (
        <section>
            <h1>Success!</h1>
            <Link to="/login">Login</Link>
        </section>
    ) : (
    <section>
        <p ref={errRef} className={errMsg ? 'errmsg' : "offscreen"} aria-live='assetrive'>{errMsg}</p>
        <div className='admin-header'>
        <h1>Register</h1>
        <Link to="/admin" className='link-button'>Cancel</Link>
        </div>
        <form onSubmit={handleSubmit}>
            <label htmlFor='username'>
                Email:
                <span className={validUserName ? 'valid' : 'hide'}>
                    <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className={validUserName || !username ? 'hide' : 'invalid'}>
                    <FontAwesomeIcon icon={faTimes}/>
                </span>
            </label>
            <input
                type="text"
                id="username"
                ref={userRef}
                autoComplete='off'
                onChange={(e) => setUserName(e.target.value)}
                required
                aria-invalid={validUserName ? 'false' : 'true'}
                aria-describedby='uidnote'
                onFocus={() => setUsernameFocus(true)}
                onBlur={() => setUsernameFocus(false)}
            />
            <p id="uidnote" className={usernameFocus && username && !validUserName ? 'instructions' : 'offscreen'}>
                <FontAwesomeIcon icon={faInfoCircle}/>
                Must be an email.<br/>
            </p>


            <label htmlFor="password">
                Password
                <span className={validPassword ? 'valid' : 'hide'}>
                    <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className={validPassword || !password ? 'hide' : 'invalid'}>
                    <FontAwesomeIcon icon={faTimes}/>
                </span>
            </label>
            <input
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-invalid={validPassword ? 'false' : 'true'}
                aria-describedby='pwdnote'
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
            />
            <p id="pwdnote" className={passwordFocus && !validPassword ? 'instructions' : 'offscreen'}>
                <FontAwesomeIcon icon={faInfoCircle}/>
                8 to 24 characters.<br/>
                Must include uppercase and lowercase letters, a number and a special character.<br/>
                Allowed special characters: <span aria-label="exclamation mark">!</span><span aria-label="at symbol">@</span><span aria-label="hashtag">#</span><span aria-label="dollar-sign">$</span><span aria-label="percent">%</span>
            </p>


            <label htmlFor="confirm_pwd">
                Confirm Password:
                <span className={validMatch && matchPassword ? 'valid' : 'hide'}>
                    <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className={validMatch || !matchPassword ? 'hide' : 'invalid'}>
                    <FontAwesomeIcon icon={faTimes}/>
                </span>
            </label>
            <input
                type="password"
                id="confirm_pwd"
                onChange={(e) => setMatchPassword(e.target.value)}
                required
                aria-invalid={validMatch ? 'false' : 'true'}
                aria-describedby='confirmnote'
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
            />
            <p id="confirmnote" className={matchFocus && !validMatch ? 'instructions' : 'offscreen'}>
                <FontAwesomeIcon icon={faInfoCircle}/>
                Must match the first password input field.
            </p>


            <button disabled={!validUserName || !validPassword || !validMatch ? true : false} className='regButton'>
                Sign Up
            </button>
        </form>
    </section>
    
    ) }
    </>
    
  )
}
