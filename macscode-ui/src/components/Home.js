import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import Select from 'react-select'; // If using react-select
import '../styles/Home.css';

const Home = () => {
    const { auth } = useContext(AuthContext);
    const [problems, setProblems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'none' });
    const [selectedType, setSelectedType] = useState('all');  // 'java', 'cpp', 'karel', or 'all'
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');  // New state for difficulty
    const [searchTerm, setSearchTerm] = useState('');  // New state for search term
    const [topics, setTopics] = useState([]); // Array to store topics from the database
    const [selectedTopics, setSelectedTopics] = useState(new Set()); // Set to store selected topics for filtering


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
                const allTopics = new Set();

                data.forEach(problem => {
                    problem.topics.forEach(topic => allTopics.add(topic));
                });
                setTopics(Array.from(allTopics));
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
                const rankA = difficultyOrder[a.difficulty.toLowerCase()];
                const rankB = difficultyOrder[b.difficulty.toLowerCase()];
                return direction === 'asc' ? rankA - rankB : rankB - rankA;
            } else {
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

    const difficultyOptions = [
        { value: 'all', label: 'All Difficulties' },
        { value: 'easy', label: 'Easy' },
        { value: 'medium', label: 'Medium' },
        { value: 'hard', label: 'Hard' }
    ];

    const handleDifficultyChange = selectedOption => {
        setSelectedDifficulty(selectedOption.value);
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

    const topicOptions = topics.map(topic => ({ value: topic, label: topic }));

    const handleTopicChange = (selectedOptions) => {
        setSelectedTopics(selectedOptions ? selectedOptions.map(option => option.value) : []);
    };


    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const filteredProblems = problems
        .filter(problem => selectedType === 'all' || problem.type.toLowerCase() === selectedType)
        .filter(problem => selectedDifficulty === 'all' || problem.difficulty.toLowerCase() === selectedDifficulty)
        .filter(problem => selectedTopics.size === 0 || problem.topics.some(topic => selectedTopics.includes(topic)))
        .filter(problem => problem.name.toLowerCase().includes(searchTerm));

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
                    <div className="filters">
                        <Select
                            isMulti
                            name="topics"
                            options={topicOptions}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={handleTopicChange}
                            placeholder="Filter by topics..."
                        />
                        <Select
                            value={difficultyOptions.find(option => option.value === selectedDifficulty)}
                            onChange={handleDifficultyChange}
                            options={difficultyOptions}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            isSearchable={true}
                        />
                        <input type="text" placeholder="Search by title..." value={searchTerm} onChange={handleSearchChange} />
                    </div>
                    <div className="table-header">
                        <span className="header-item" onClick={() => requestSort('title')}>Title {sortConfig.key === 'title' && sortConfig.direction !== 'none' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</span>
                        <span className="header-item" onClick={() => requestSort('type')}>Type {sortConfig.key === 'type' && sortConfig.direction !== 'none' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</span>
                        <span className="header-item" onClick={() => requestSort('difficulty')}>Difficulty {sortConfig.key === 'difficulty' && sortConfig.direction !== 'none' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</span>
                        <span className="header-item">Topics</span>
                    </div>
                    <ul className="problem-list">
                        {filteredProblems.map((problem) => (
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
