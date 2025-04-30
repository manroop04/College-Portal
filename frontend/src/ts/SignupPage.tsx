import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import signup from "../assets/signup.png";
import RegisterStudent from './RegisterStudent'; // Adjust path as needed

const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [enrollment, setEnrollment] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
   

    
    const handleRegistrationComplete = (name: string, imageCount: number) => {
        setShowRegistrationModal(false);
        // You can store the registration data if needed
        console.log(`Registered ${name} with ${imageCount} images`);
    };

    const handleUploadClick = () => {
        if (!enrollment) {
            alert("Please enter your enrollment number first");
            return;
        }
        navigate('/register-face', {
            state: { 
              enrollment: enrollment.trim() 
            }
          });
        setShowRegistrationModal(true);
    };

    return (
        <div className='body'>
            <div className='signup-container'>
                <div className="left-panel">
                    <img src={signup} alt="Signup Visual" className="signup-image" />
                </div>
                <div className='divider'></div>
                <div className="right-panel">
                    <h1 style={{ fontSize: '70px', fontWeight: '700', color: 'white', margin: '-2%' }}>Signup</h1>
                    <p style={{ fontSize: '20px', fontWeight: '400', padding: '8% 0%', color: 'white' }}>Create your account here </p>
                    <div className="signup-form">
                        <input
                            type="text"
                            placeholder="Enrolment Number/ Email ID"
                            className="input-signup"
                            value={enrollment}
                            onChange={(e) => setEnrollment(e.target.value)}
                        />
                        <div className='password-wrapper'>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create Password"
                                className="input-signup"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        <div className='password-wrapper'>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                className="input-signup"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        <div className="upload-student">
                            <p> Upload video/images </p>
                            <button
                                type="button"
                                className="upload-user"
                                onClick={handleUploadClick}
                            >
                                upload
                            </button>
                        </div>
                        <div className="button-container">
                            <button className="signup">
                                Signup
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Registration Modal */}
            {showRegistrationModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <RegisterStudent 
                            initialName={enrollment}
                            onComplete={handleRegistrationComplete}
                        />
                        <button 
                            className="close-modal"
                            onClick={() => setShowRegistrationModal(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignupPage;