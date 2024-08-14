import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from '../AuthContext';
import Select from 'react-select';
import '../styles/Home.css';
import useFetchSubmissions from "./useFetchSubmissions";
import Logout from "./Logout";
import {FaCheckCircle, FaRegCircle, FaTimesCircle} from 'react-icons/fa';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCaretDown, faCaretUp, faSort} from '@fortawesome/free-solid-svg-icons';
import {IoMdClose} from "react-icons/io";
import {GoSearch} from "react-icons/go";


const Home = () => {
    const {auth} = useContext(AuthContext);
    const [problems, setProblems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({key: null, direction: 'none'});
    const [selectedType, setSelectedType] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [topics, setTopics] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [topicCounts, setTopicCounts] = useState('');
    const [isActive, setIsActive] = useState(false);

    const submissions = useFetchSubmissions();

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
                setTopicCounts(computeTopicCounts(data));
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchProblems();
    }, [sortConfig]);

    const handleIconClick = () => {
        setIsActive(!isActive);

    };

    const handleInputBlur = (e) => {
        if (searchTerm.trim() === '') {
            setIsActive(false);
        }
    };

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'none';
        }
        setSortConfig({key, direction});
    };

    const computeTopicCounts = (problems) => {
        const counts = {};
        problems.forEach(problem => {
            problem.topics.forEach(topic => {
                counts[topic] = (counts[topic] || 0) + 1;
            });
        });
        return counts;
    };

    const difficultyOrder = {'easy': 1, 'medium': 2, 'hard': 3};

    const sortProblems = (problems, {key, direction}) => {
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
        {value: 'all', label: 'Difficulty'},
        {value: 'easy', label: 'Easy'},
        {value: 'medium', label: 'Medium'},
        {value: 'hard', label: 'Hard'}
    ];

    const statusOptions = [
        {value: 'all', label: 'Status'},
        {value: 'done', label: 'Done'},
        {value: 'attempted', label: 'Attempted'},
        {value: 'todo', label: 'ToDo'}
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

    const topicOptions = topics.map(topic => ({value: topic, label: topic}));

    const handleTopicChange = (selectedOptions) => {
        setSelectedTopics(selectedOptions ? selectedOptions.map(option => option.value) : []);
    };

    const handleStatusChange = selectedOption => {
        setSelectedStatus(selectedOption.value);
    };

    const handleCategoriesClick = (topic) => {
        setSelectedCategories(prevTopics => {
            if (prevTopics.includes(topic)) {
                return prevTopics.filter(t => t !== topic);
            } else {
                return [...prevTopics, topic];
            }
        });
    };


    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const getStatus = (problem) => {
        const problemSubmissions = submissions.filter(submission => submission.problem.id === problem.id);
        if (problemSubmissions.some(submission => submission.result.toLowerCase() === 'accepted')) {
            return 'Done';
        } else if (problemSubmissions.length > 0) {
            return 'Attempted';
        } else {
            return 'ToDo';
        }
    };

    const statusIcons = {
        Done: <FaCheckCircle color="green"/>,
        Attempted: <FaTimesCircle color="orange"/>,
        ToDo: <FaRegCircle color="gray"/>
    };

    const filteredProblems = problems.filter(problem => {
        const status = getStatus(problem);
        return (
            (selectedType === 'all' || problem.type.toLowerCase() === selectedType) &&
            (selectedDifficulty === 'all' || problem.difficulty.toLowerCase() === selectedDifficulty) &&
            (selectedStatus === 'all' || status.toLowerCase() === selectedStatus) &&
            (selectedTopics.length === 0 || selectedTopics.every(topic => problem.topics.includes(topic))) &&
            (selectedCategories.length === 0 || selectedCategories.some(topic => problem.topics.includes(topic))) &&
            problem.name.toLowerCase().includes(searchTerm)
        );
    });


    return (
        <div className="container">
            {isLoading ? (
                <p>Loading problems...</p>
            ) : error ? (
                <p>Error loading problems: {error}</p>
            ) : (
                <div>
                    <div className="header">
                        <h1>Home</h1>
                        <Logout/> {}
                    </div>
                    <div className="type-banners">
                        <button className={`banner java ${selectedType === 'java' ? 'active' : ''}`}
                                onClick={() => handleBannerClick('java')}>
                            JAVA
                        </button>
                        <button className={`banner cpp ${selectedType === 'cpp' ? 'active' : ''}`}
                                onClick={() => handleBannerClick('cpp')}>
                            C++
                        </button>
                        <button className={`banner karel ${selectedType === 'karel' ? 'active' : ''}`}
                                onClick={() => handleBannerClick('karel')}>
                            KAREL
                        </button>
                    </div>
                    <div className="filters">
                        <div className="topics-grid">
                            {Object.entries(topicCounts).map(([topic, count]) => (
                                <div key={topic}
                                     className={`topic-item ${selectedCategories.includes(topic) ? 'selected' : ''}`}
                                     onClick={() => handleCategoriesClick(topic)}>
                                    <span className="topic-label">{topic}</span>
                                    <span className="topic-count">{count}</span>
                                </div>
                            ))}
                        </div>

                        <div className="multi-select">
                            <Select
                                isMulti
                                name="topics"
                                options={topicOptions}
                                className="select-control multi-select"
                                classNamePrefix="select"
                                onChange={handleTopicChange}
                                placeholder="Filter by topics..."
                                isSearchable={true}
                            />
                        </div>


                        <div className="controls-row">
                            <div className="control-item">
                                <Select
                                    value={statusOptions.find(option => option.value === selectedStatus)}
                                    onChange={handleStatusChange}
                                    options={statusOptions}
                                    className="select-control"
                                    classNamePrefix="select"
                                    isSearchable={true}
                                />
                            </div>
                            <div className="control-item">
                                <Select
                                    value={difficultyOptions.find(option => option.value === selectedDifficulty)}
                                    onChange={handleDifficultyChange}
                                    options={difficultyOptions}
                                    className="select-control"
                                    classNamePrefix="select"
                                    isSearchable={true}
                                />
                            </div>

                            <div className={`search-container ${isActive ? 'active' : ''}`}>
                                <button type="button" onClick={handleIconClick}>
                                    {isActive ? <IoMdClose/> : <GoSearch/>}
                                </button>
                                <input
                                    type="search"
                                    value={searchTerm}
                                    placeholder="Search by title..."
                                    onChange={handleSearchChange}
                                    onBlur={handleInputBlur}
                                />
                            </div>

                        </div>

                    </div>
                    <div className="table-header">
                        <span className="header-item">Status</span>
                        <span onClick={() => requestSort('title')}>
                        Title
                            {sortConfig.key === 'title' && sortConfig.direction !== 'none' ? (
                                sortConfig.direction === 'asc' ? (
                                    <FontAwesomeIcon icon={faCaretUp} className="sort-icon"/>
                                ) : (
                                    <FontAwesomeIcon icon={faCaretDown} className="sort-icon"/>
                                )
                            ) : <FontAwesomeIcon icon={faSort} className="sort-icon"/>}
                        </span>
                        <span
                            onClick={() => requestSort('type')}>
                            Type
                            {sortConfig.key === 'type' && sortConfig.direction !== 'none' ? (
                                sortConfig.direction === 'asc' ? (
                                    <FontAwesomeIcon icon={faCaretUp} className="sort-icon"/>
                                ) : (
                                    <FontAwesomeIcon icon={faCaretDown} className="sort-icon"/>
                                )
                            ) : <FontAwesomeIcon icon={faSort} className="sort-icon"/>}
                        </span>
                        <span
                            onClick={() => requestSort('difficulty')}>Difficulty {sortConfig.key === 'difficulty' && sortConfig.direction !== 'none' ? (
                            sortConfig.direction === 'asc' ? (
                                <FontAwesomeIcon icon={faCaretUp}/>
                            ) : (
                                <FontAwesomeIcon icon={faCaretDown}/>
                            )
                        ) : <FontAwesomeIcon icon={faSort}/>}</span>
                        <span className="header-item">Topics</span>
                    </div>
                    <ul className="problem-list">
                        {filteredProblems.map((problem) => (
                            <li key={problem.id} className="problem-item">
                                <span className="column status status-icon">

                                    {statusIcons[getStatus(problem)]}
                                </span>
                                <span className="column title">{problem.problemId.order}. {problem.name}</span>
                                <span className="column type">{problem.type}</span>
                                <span
                                    className={`column difficulty ${getDifficultyClass(problem.difficulty)}`}>{problem.difficulty}</span>
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
