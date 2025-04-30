import React, { useState } from 'react';
import '../styles/Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import loginImage from "../assets/login.png";

const LoginPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className='body'>
            <div className='login-container'>
                <div className="left-side">
                    <img src={loginImage} alt="login-image" />
                </div>
                <div className='divider'></div>
                <div className="right-side">
                    <h1 style={{ fontSize: '70px', fontWeight: '700' }}>Login</h1>
                    <p style={{ fontSize: '20px', fontWeight: '400', padding: '8% 0%' }}>Enter your credentials</p>
                    <div className="login-form">
                        <input
                            type="text"
                            placeholder="Enrolment Number/ Email ID"
                            className="input-field"
                        />
                        <div className='password-wrapper'>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="input-field"
                            />
                            <button
                                type="button"
                                className="eye-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        <div className="forgot-password">
                            Forgot password?
                        </div>
                        <div className="button-container">
                            <div className="login">
                                Login
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
