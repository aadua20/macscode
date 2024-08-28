import React, {useState, useEffect, useCallback, useContext} from 'react';
import axios from 'axios';
import '../../styles/ControlPanel.css';
import TopBar from '../TopBar';
import ProblemList from '../homepage/ProblemList';
import {AuthContext} from "../../AuthContext";

const ControlPanel = () => {
    const {auth} = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('manage-users');
    const [users, setUsers] = useState([]);
    const [problems, setProblems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredResults, setFilteredResults] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/problems-service/users/all');
            setUsers(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
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
    }, [sortConfig]);

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

    const renderContent = () => {
        if (isLoading) return <p>Loading...</p>;
        if (error) return <p>Error: {error}</p>;
        console.log(filteredResults);

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
                    <ProblemList problems={filteredResults} />
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
