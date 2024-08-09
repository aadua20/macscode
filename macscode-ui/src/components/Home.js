import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import '../styles/Home.css';
import {IoCheckmarkCircleOutline, IoCloseCircleOutline} from "react-icons/io5";

const Home = () => {
    const { auth } = useContext(AuthContext);
    const [problems, setProblems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await fetch('http://localhost:8080/problems/all');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProblems(data);
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchProblems();
    }, []);

    return (
        <div className="container">
            {isLoading ? (
                <p>Loading problems...</p>
            ) : error ? (
                <p>Error loading problems: {error}</p>
            ) : (
                <div>
                    <div className="table-header">
                        <span className="header-item">Title</span>
                        <span className="header-item">Type</span>
                        <span className="header-item">Difficulty</span>
                        <span className="header-item">Topics</span>
                    </div>
                    <ul className="problem-list">
                        {problems.map((problem) => (
                            <li key={problem.id} className="problem-item">
                                <span className="column title"><span></span>{problem.problemId.order}. {problem.name}</span>
                                <span className="column type">{problem.type}</span>
                                <span className="column difficulty">{problem.difficulty}</span>
                                <span className="column topics">{problem.topics.join(', ')}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Home;
