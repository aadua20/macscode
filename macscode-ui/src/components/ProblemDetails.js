import React from 'react';
import '../styles/Problem.css';

const ProblemDetails = ({ problem }) => {
    return (
        <div className="problem-details">
            <h1 className="problem-title">{problem.name}</h1>
            <p><strong>Type:</strong> {problem.type}</p>
            <p><strong>Difficulty:</strong> {problem.difficulty}</p>
            <p><strong>Course:</strong> {problem.problemId.course}</p>
            <p><strong>Order:</strong> {problem.problemId.order}</p>
            <div className="problem-description">
                <h3>Description</h3>
                <p>{problem.description}</p>
            </div>
            <div className="problem-topics">
                <h3>Topics</h3>
                <ul>
                    {problem.topics.map((topic, index) => (
                        <li key={index}>{topic}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProblemDetails;
