import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import studentillustration from "../assets/student-illustration.png";
import '../styles/Landing.css';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="container">
            {/* Left Side */}
            <div className="left-login">
                <h1 style={{ fontSize: '70px', fontWeight: '900', lineHeight: '1.1' }}><i>Campus Connect : </i></h1>
                <h1 style={{ fontSize: '70px', fontWeight: '900' }}>College Portal</h1>
                <p style={{ fontSize: '19px', fontWeight: '400', maxWidth: '80%' }}>
                    Your <b>all-in-one platform</b> to access <span style={{ color: '#0057D9' }}><b><i>academic resources, monitor progress,</i></b></span> and <span style={{ color: '#0057D9' }}><b><i>stay updated with campus activities</i></b></span>. Join us in making your college life smarter and simpler.
                </p>
                <div className="button-container">
                    <div className="button-login" onClick={() => navigate('/login')}>
                        Login
                    </div>
                    <div className="button-signup" onClick={() => navigate('/sign-up')}>
                        Sign Up
                    </div>
                </div>
            </div>
            <div className="right">
                <div className="bubble top-bubble"></div>
                <div className="bubble middle-bubble"></div>
                <div className="bubble bottom-bubble"></div>
                <div className="text-overlay">
                    <h1 className="welcome-text">
                        <span className="bold-white">Welcome to</span>
                        <span className="white-subtext">College Portal</span>
                    </h1>
                </div>
                <img
                    src={studentillustration}
                    alt="Student Illustration"
                    className="center-image"
                />
            </div>

        </div >
    );
};

export default LandingPage;
