import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';
import homeIcon from '../icons/logo192.png';

const Profile = () => {
    const { auth } = useContext(AuthContext);
    const [userDetails, setUserDetails] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [selectedCode, setSelectedCode] = useState(null);
    const [showCode, setShowCode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const decodedToken = jwtDecode(auth);
                const username = decodedToken.sub;

                const userResponse = await axios.get(`http://localhost:8081/auth/users/${username}`, {
                    headers: {
                        Authorization: `Bearer ${auth}`
                    }
                });
                setUserDetails(userResponse.data);

                const submissionsResponse = await axios.get(`http://localhost:8080/submissions/users/${username}/last`, {
                    headers: {
                        Authorization: `Bearer ${auth}`
                    }
                });
                setSubmissions(submissionsResponse.data);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        if (auth) {
            fetchUserDetails();
        }
    }, [auth]);

    const handleCodeClick = async (solutionFileContent) => {
        try {
            setSelectedCode(solutionFileContent);
            setShowCode(true);
        } catch (error) {
            console.error('Error fetching code', error);
        }
    };

    const countAcceptedCodes = (type) => {
        const uniqueProblemIds = new Set();

        submissions.forEach(submission => {
            if (submission.result === 'ACCEPTED' && submission.problem.problemId.course === type) {
                uniqueProblemIds.add(submission.problem.id);
            }
        });

        return uniqueProblemIds.size;
    };

    if (!userDetails) {
        return <div>Loading...</div>;
    }

    const methodologyCount = countAcceptedCodes('MET');
    const abstractionsCount = countAcceptedCodes('ABS');

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-info-container">
                    <div className="profile-header">
                        <h2>{userDetails.username}</h2>
                        <p>Name: {userDetails.name}</p>
                        <p>Email: {userDetails.email}</p>
                    </div>
                    <div className="statistics-container">
                        <h3>Statistics</h3>
                        {methodologyCount > 0 && (
                            <p className="statistics-text">
                                <span className="methodology-label">Methodology:</span> <span className="count">{methodologyCount}</span> {methodologyCount === 1 ? 'Problem Solved' : 'Problems Solved'}
                            </p>
                        )}
                        {abstractionsCount > 0 && (
                            <p className="statistics-text">
                                <span className="abstractions-label">Abstractions:</span> <span className="count">{abstractionsCount}</span> {abstractionsCount === 1 ? 'Problem Solved' : 'Problems Solved'}
                            </p>
                        )}
                    </div>
                </div>
                <div className="submissions-container">
                    <h3>Recent Submissions</h3>
                    <div className="submissions-list">
                        {submissions.slice(0, 10).map(submission => (
                            <div
                                className="submission-item"
                                key={submission.id.toString()}
                            >
                                <div className="problem-name">{submission.problem.name}</div>
                                <div className={`result ${submission.result === 'ACCEPTED' ? 'accepted' : 'rejected'}`}>
                                    {submission.result}
                                </div>
                                <div className="date">
                                    {new Date(submission.submissionDate).toLocaleString('en-US', {
                                        dateStyle: 'short',
                                        timeStyle: 'short'
                                    })}
                                </div>
                                <button
                                    className="view-code-button"
                                    onClick={() => handleCodeClick(submission.solutionFileContent)}
                                >
                                    View Code
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <img
                src={homeIcon}
                alt="Home"
                className="home-button"
                onClick={() => navigate('/')}
            />
            {showCode && (
                <div className="code-popup">
                    <div className="code-popup-content">
                        <button className="close-popup" onClick={() => setShowCode(false)}>X</button>
                        <pre>{selectedCode}</pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;