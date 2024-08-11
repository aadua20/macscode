import React, { useState } from 'react';
import '../styles/TestCases.css';

const TestCases = ({ testCases }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="test-cases">
            <div className="tabs">
                {testCases.map((testCase, index) => (
                    <button
                        key={index}
                        className={`tab-button ${index === activeTab ? 'active' : ''}`}
                        onClick={() => setActiveTab(index)}
                    >
                        Test Case {index + 1}
                    </button>
                ))}
            </div>
            <div className="test-case-content">
                <h4>Test Case {activeTab + 1}</h4>
                <pre>{testCases[activeTab].input}</pre>
            </div>
        </div>
    );
};

export default TestCases;
