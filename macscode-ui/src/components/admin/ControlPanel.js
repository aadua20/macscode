import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import '../../styles/ControlPanel.css';
import TopBar from '../TopBar';
import { AuthContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom";

const ControlPanel = () => {
    const { auth } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('manage-users');
    const [users, setUsers] = useState([]);
    const [problems, setProblems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredResults, setFilteredResults] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const problemsPerPage = 10;
    const navigate = useNavigate();

    const fetchUsers = async () => {
        // Logic to fetch users
    };

    const fetchProblems = useCallback(async () => {
        try {
            const response = await axios.get('/problems-service/problems/all', {
                headers: {
                    Authorization: `Bearer ${auth}`
                }
            });
            let data = response.data;
            if (sortConfig.key) {
                data = sortProblems(data, sortConfig);
            }
            setProblems(data);
            setFilteredResults(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [sortConfig, auth]);

    const sortProblems = useCallback((problems, { key, direction }) => {
        const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
        if (!key || direction === 'none') return problems;

        return [...problems].sort((a, b) => {
            if (key === 'title') {
                const orderA = a.problemId.order;
                const orderB = b.problemId.order;
                return direction === 'asc' ? orderA - orderB : orderB - orderA;
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
    }, []);

    useEffect(() => {
        if (activeTab === 'manage-problems') {
            fetchProblems();
        } else if (activeTab === 'manage-users') {
            fetchUsers();
        }
    }, [activeTab, fetchProblems]);

    const handleProblemClick = (problem) => {
        navigate(`/problem/${problem.problemId.course}/${problem.problemId.order}`);
    };

    const indexOfLastProblem = currentPage * problemsPerPage;
    const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
    const currentProblems = filteredResults.slice(indexOfFirstProblem, indexOfLastProblem);
    const totalPages = Math.ceil(filteredResults.length / problemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDelete = async (problemId) => {
        try {
            await axios.delete(`/problems-service/problems/${problemId}`, {
                headers: {
                    Authorization: `Bearer ${auth}`
                }
            });
            setProblems(problems.filter(problem => problem.id !== problemId));
            setFilteredResults(filteredResults.filter(problem => problem.id !== problemId));
        } catch (err) {
            setError(err.message);
        }
    };

    const confirmDelete = (problemId) => {
        if (window.confirm("Are you sure you want to delete this problem?")) {
            handleDelete(problemId);
        }
    };

    const renderContent = () => {
        if (isLoading) return <p>Loading...</p>;
        if (error) return <p>Error: {error}</p>;

        if (activeTab === 'manage-users') {
            return (
                <div>
                    <h3>User List</h3>
                    <ul className="control-panel-user-list">
                        {users.map(user => (
                            <li key={user.id} className="control-panel-user-item">
                                {user.username}
                            </li>
                        ))}
                    </ul>
                </div>
            );
        } else if (activeTab === 'manage-problems') {
            return (
                <div>
                    <h3>Problem List</h3>
                    <ul className="problem-list">
                        {currentProblems.map((problem) => (
                            <li key={problem.id} className="problem-item" onClick={() => handleProblemClick(problem)}>
                                <span className="column title">{problem.problemId.order}. {problem.name}</span>
                                <span className="column type">{problem.type}</span>
                                <span className={`column difficulty ${problem.difficulty.toLowerCase()}`}>
                                    {problem.difficulty}
                                </span>
                                <span className="column topics">{problem.topics.join(', ')}</span>
                                <button
                                    className="delete-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        confirmDelete(problem.id);
                                    }}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                    {totalPages > 1 && (
                        <div className="pagination">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index + 1}
                                    className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            );
        }
    };

    return (
        <div className="control-panel-container">
            <TopBar />
            <div className="control-panel-tabs-container">
                <div
                    className={`control-panel-tab ${activeTab === 'manage-users' ? 'control-panel-active' : ''}`}
                    onClick={() => setActiveTab('manage-users')}
                >
                    <h2>Manage Users</h2>
                </div>
                <div
                    className={`control-panel-tab ${activeTab === 'manage-problems' ? 'control-panel-active' : ''}`}
                    onClick={() => setActiveTab('manage-problems')}
                >
                    <h2>Manage Problems</h2>
                </div>
            </div>
            <div className="control-panel-content-container">
                {renderContent()}
            </div>
        </div>
    );
};

export default ControlPanel;
