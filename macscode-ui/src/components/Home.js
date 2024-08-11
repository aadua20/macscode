import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import '../styles/Home.css';

const Home = () => {
    const { auth } = useContext(AuthContext);
    const [problems, setProblems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'none' });
    const [selectedType, setSelectedType] = useState('all');  // 'java', 'cpp', 'karel', or 'all'

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await fetch('http://localhost:8080/problems/all');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                let data = await response.json();
                if (sortConfig.key) {
                    data = sortProblems(data, sortConfig);
                }
                setProblems(data);
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchProblems();
    }, [sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'none';  // Optional: Add a 'none' state to reset the sort order
        }
        setSortConfig({ key, direction });
    };

    const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };

    const sortProblems = (problems, { key, direction }) => {
        if (!key || direction === 'none') return problems;

        const sortedProblems = [...problems].sort((a, b) => {
            if (key === 'title') {
                const orderA = a.problemId.order;
                const orderB = b.problemId.order;
                if (direction === 'asc') {
                    return orderA - orderB;
                } else {
                    return orderB - orderA;
                }
            } else if (key === 'difficulty') {
                // Custom sorting for difficulty based on predefined order
                const rankA = difficultyOrder[a.difficulty.toLowerCase()];
                const rankB = difficultyOrder[b.difficulty.toLowerCase()];
                return direction === 'asc' ? rankA - rankB : rankB - rankA;
            } else {
                // Default alphabetical sorting for other keys
                const itemA = a[key].toLowerCase();
                const itemB = b[key].toLowerCase();
                if (itemA < itemB) return direction === 'asc' ? -1 : 1;
                if (itemA > itemB) return direction === 'asc' ? 1 : -1;
                return 0;
            }
        });

        return sortedProblems;
    };

    const handleBannerClick = (type) => {
        setSelectedType(prevType => prevType === type ? 'all' : type);
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
                    <div className="type-banners">
                        <button className={`banner java ${selectedType === 'java' ? 'active' : ''}`} onClick={() => handleBannerClick('java')}>
                            JAVA
                        </button>
                        <button className={`banner cpp ${selectedType === 'cpp' ? 'active' : ''}`} onClick={() => handleBannerClick('cpp')}>
                            C++
                        </button>
                        <button className={`banner karel ${selectedType === 'karel' ? 'active' : ''}`} onClick={() => handleBannerClick('karel')}>
                            KAREL
                        </button>
                    </div>


                    <div className="table-header">
                        <span className="header-item" onClick={() => requestSort('title')}>Title {sortConfig.key === 'title' && sortConfig.direction !== 'none' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</span>
                        <span className="header-item" onClick={() => requestSort('type')}>Type {sortConfig.key === 'type' && sortConfig.direction !== 'none' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</span>
                        <span className="header-item" onClick={() => requestSort('difficulty')}>Difficulty {sortConfig.key === 'difficulty' && sortConfig.direction !== 'none' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</span>
                        <span className="header-item">Topics</span>
                    </div>
                    <ul className="problem-list">
                        {problems.filter(problem => selectedType === 'all' || problem.type.toLowerCase() === selectedType).map((problem) => (
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
