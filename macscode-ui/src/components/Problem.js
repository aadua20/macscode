import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProblemDetails from './ProblemDetails';
import SolutionTemplate from './SolutionTemplate';
import TestCases from './TestCases';
import '../styles/Problem.css';

const Problem = () => {
    const { course, order } = useParams();
    const [problem, setProblem] = useState(null);
    const [error, setError] = useState('');
    const [code, setCode] = useState('');
    const [testCases, setTestCases] = useState([]);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/problems/${course}/${order}`);
                setProblem(response.data);
                setCode(response.data.solutionFileTemplate); // Initialize the code state
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
        // Implement submission logic here
        console.log('Submitting code:', code);
        console.log('Test cases:', testCases);
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
                    <div className="submit-button-container">
                        <button className="submit-button" onClick={handleSubmit}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Problem;
