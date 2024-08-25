import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProblemDetails from './ProblemDetails';
import SolutionTemplate from './SolutionTemplate';
import TestCases from './TestCases';
import ResultsModal from './ResultsModal';
import '../styles/Problem.css';
import { Client } from '@stomp/stompjs';

const Problem = () => {
    const { course, order } = useParams();
    const [problem, setProblem] = useState(null);
    const [error, setError] = useState('');
    const [code, setCode] = useState('');
    const [testCases, setTestCases] = useState([]);
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const clientRef = useRef(null); // WebSocket client reference

    useEffect(() => {
        // Initialize WebSocket client
        clientRef.current = new Client({
            brokerURL: 'ws://localhost:8080/websocket-endpoint/websocket',
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('Connected to WebSocket');

                // Subscribe to run and submit result topics
                clientRef.current.subscribe('/topic/runResult', (message) => {
                    const runResults = JSON.parse(message.body);
                    setResults(runResults);
                    setShowResults(true);
                });

                clientRef.current.subscribe('/topic/submitResult', (message) => {
                    const submitResults = JSON.parse(message.body);
                    setResults(submitResults);
                    setShowResults(true);
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        // Activate WebSocket client
        clientRef.current.activate();

        // Cleanup function to disconnect WebSocket when the component is unmounted
        return () => {
            clientRef.current.deactivate();
        };
    }, []); // Run only once on mount

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/problems/${course}/${order}`);
                setProblem(response.data);
                setCode(response.data.solutionFileTemplate);
                setTestCases(response.data.publicTestCases || []);
            } catch (error) {
                console.error('Error fetching problem', error);
                setError('Error fetching problem details. Please try again later.');
            }
        };

        fetchProblem();
    }, [course, order]);

    const handleCodeChange = (newCode) => {
        setCode(newCode);
    };

    const handleSubmit = () => {
        if (!problem) return;

        // Send a submit solution request via WebSocket
        clientRef.current.publish({
            destination: '/app/submitSolution',
            body: JSON.stringify({
                problemId: problem.id,
                solution: code,
            }),
        });
        setHasSubmitted(true); // Set to true after submission
    };

    const handleRun = () => {
        if (!problem) return;

        // Send a run solution request via WebSocket
        clientRef.current.publish({
            destination: '/app/runSolution',
            body: JSON.stringify({
                problemId: problem.id,
                solution: code,
            }),
        });
        setHasSubmitted(true); // Set to true after running
    };

    const handleCloseResults = () => {
        setShowResults(false);
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!problem) {
        return <div>Loading...</div>;
    }

    return (
        <div className="problem-container">
            <div className="problem-left">
                <ProblemDetails problem={problem} />
            </div>
            <div className="problem-right">
                <div className="problem-right-upper">
                    <SolutionTemplate
                        solutionFileTemplate={code}
                        onChange={handleCodeChange}
                    />
                </div>
                <div className="problem-right-lower">
                    <TestCases testCases={testCases} />
                    <div className="button-container">
                        <button className="run-button" onClick={handleRun}>
                            Run
                        </button>
                        <button className="submit-button" onClick={handleSubmit}>
                            Submit
                        </button>
                        <button
                            className={`view-results-button ${hasSubmitted ? 'visible' : ''}`}
                            onClick={() => setShowResults(true)}
                        >
                            View Results
                        </button>
                    </div>
                </div>
            </div>
            <ResultsModal
                show={showResults}
                results={results}
                onClose={handleCloseResults}
            />
        </div>
    );
};

export default Problem;
