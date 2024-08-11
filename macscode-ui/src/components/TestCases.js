import React, { useState } from 'react';
import '../styles/TestCases.css'; // Optional: Add custom styles

const TestCases = ({ testCases }) => {
    const [activeTab, setActiveTab] = useState(testCases.length > 0 ? testCases[0].testNum : null);

    const handleTabChange = (testNum) => {
        setActiveTab(testNum);
    };

    const activeTestCase = testCases.find(testCase => testCase.testNum === activeTab);

    return (
        <div className="test-cases">
            <h4>Test Cases</h4>
            <div className="test-cases-tabs">
                {testCases.map(testCase => (
                    <button
                        key={testCase.testNum}
                        className={`tab-button ${activeTab === testCase.testNum ? 'active' : ''}`}
                        onClick={() => handleTabChange(testCase.testNum)}
                    >
                        Test Case {testCase.testNum}
                    </button>
                ))}
            </div>
            {activeTestCase && (
                <div className="test-case-content">
                    <pre>{activeTestCase.input}</pre>
                </div>
            )}
        </div>
    );
};

export default TestCases;
