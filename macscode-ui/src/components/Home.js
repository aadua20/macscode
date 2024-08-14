import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from '../AuthContext';
import '../styles/Home.css';
import useFetchSubmissions from "./useFetchSubmissions";
import Logout from "./Logout";
import TypeBanners from "./homepage/TypeBanners";
import TopicsGrid from "./homepage/TopicsGrid";
import Filters from "./homepage/Filters";
import TableHeader from "./homepage/TableHeader";
import ProblemList from "./homepage/ProblemList";

const Home = () => {
    const {auth} = useContext(AuthContext);
    const [problems, setProblems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredResults, setFilteredResults] = useState([]);
    const [sortConfig, setSortConfig] = useState({key: null, direction: 'none'});
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedType, setSelectedType] = useState('all');
    const [topics, setTopics] = useState([]);
    const [topicCounts, setTopicCounts] = useState('');

    const difficultyOrder = {'easy': 1, 'medium': 2, 'hard': 3};

    const filteredProblems = filteredResults.filter(problem => {
        return (
            (selectedType === 'all' || problem.type.toLowerCase() === selectedType) &&
            (selectedCategories.length === 0 || selectedCategories.some(topic => problem.topics.includes(topic)))
        );
    });

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
                setFilteredResults(data);

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
            direction = 'none';
        }
        setSortConfig({key, direction});
    };

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

    const handleCategoriesClick = (topic) => {
        setSelectedCategories(prevTopics => {
            if (prevTopics.includes(topic)) {
                return prevTopics.filter(t => t !== topic);
            } else {
                return [...prevTopics, topic];
            }
        });
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

    const computeTopicCounts = (problems) => {
        const counts = {};
        problems.forEach(problem => {
            problem.topics.forEach(topic => {
                counts[topic] = (counts[topic] || 0) + 1;
            });
        });
        return counts;
    };

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
                    <div>
                        <TypeBanners
                            selectedType={selectedType}
                            handleBannerClick={handleBannerClick}/>
                    </div>

                    <div className="filters">
                        <TopicsGrid
                            topicCounts={topicCounts}
                            selectedCategories={selectedCategories}
                            handleCategoriesClick={handleCategoriesClick}
                        />

                        <Filters
                            topics={topics}
                            setFilteredResults={setFilteredResults}
                            problems={problems}
                            getStatus={getStatus}
                        />
                    </div>

                    <TableHeader
                        sortConfig={sortConfig}
                        requestSort={requestSort}
                    />

                    <ProblemList
                        problems={filteredProblems}
                        getStatus={getStatus}
                    />
                </div>
            )}
        </div>
    );
};

export default Home;
