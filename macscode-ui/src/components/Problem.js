import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProblemDetails from './ProblemDetails';
import SolutionTemplate from './SolutionTemplate';
import TestCases from './TestCases';
import ResultsModal from './ResultsModal';
import '../styles/Problem.css';

const Problem = () => {
    const { course, order } = useParams();
    const [problem, setProblem] = useState(null);
    const [error, setError] = useState('');
    const [code, setCode] = useState('');
    const [testCases, setTestCases] = useState([]);
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false); // Track if either button has been clicked

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

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:8080/problems/submit', {
                problemId: problem.id,
                solution: code
            });
            setResults(response.data);
            setShowResults(true);
            setHasSubmitted(true); // Set to true after submission
        } catch (error) {
            console.error('Error submitting solution', error);
            setError('Error submitting solution. Please try again later.');
        }
    };

    const handleRun = async () => {
        try {
            const response = await axios.post('http://localhost:8080/problems/run', {
                problemId: problem.id,
                solution: code
            });
            setResults(response.data);
            setShowResults(true);
            setHasSubmitted(true); // Set to true after running
        } catch (error) {
            console.error('Error running solution', error);
            setError('Error running solution. Please try again later.');
        }
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
