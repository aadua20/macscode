import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import '../styles/Home.css';

const Home = () => {
    const { auth } = useContext(AuthContext);
    const [problems, setProblems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('none'); // 'asc', 'desc', 'none'

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await fetch('http://localhost:8080/problems/all');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                let data = await response.json();
                if (sortOrder !== 'none') {
                    data = sortProblems(data, sortOrder);
                }
                setProblems(data);
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchProblems();
    }, [sortOrder]);

    const sortProblems = (problems, order) => {
        const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
        return problems.sort((a, b) => {
            if (order === 'asc') {
                return difficultyOrder[a.difficulty.toLowerCase()] - difficultyOrder[b.difficulty.toLowerCase()];
            } else if (order === 'desc') {
                return difficultyOrder[b.difficulty.toLowerCase()] - difficultyOrder[a.difficulty.toLowerCase()];
            }
        });
    };

    const handleSort = (order) => {
        setSortOrder(order);
    };

    const getDifficultyClass = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return 'easy';
            case 'medium':
                return 'medium';
            case 'hard':
                return 'hard';
            default:
                return '';
        }
    };

    return (
        <div className="container">
            {isLoading ? (
                <p>Loading problems...</p>
            ) : error ? (
                <p>Error loading problems: {error}</p>
            ) : (
                <div>
                    <h2>Problems</h2>
                    <button onClick={() => handleSort('asc')}>Sort Asc</button>
                    <button onClick={() => handleSort('desc')}>Sort Desc</button>
                    <div className="table-header">
                        <span className="header-item">Title</span>
                        <span className="header-item">Type</span>
                        <span className="header-item">Difficulty</span>
                        <span className="header-item">Topics</span>
                    </div>
                    <ul className="problem-list">
                        {problems.map((problem) => (
                            <li key={problem.id} className="problem-item">
                                <span className="column title">{problem.problemId.order}. {problem.name}</span>
                                <span className="column type">{problem.type}</span>
                                <span className={`column difficulty ${getDifficultyClass(problem.difficulty)}`}>{problem.difficulty}</span>
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
