import React, { useState, useEffect, useRef } from 'react';
import TopBar from "./TopBar";
import '../styles/ProblemCreation.css';
import '../styles/Difficulty.css';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {dracula} from 'react-syntax-highlighter/dist/esm/styles/prism';

const ProblemCreation = () => {
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [newTopic, setNewTopic] = useState('');
    const [difficulty, setDifficulty] = useState("Easy");
    const [mainFile, setMainFile] = useState(null);
    const [solutionFile, setSolutionFile] = useState(null);
    const [viewFile, setViewFile] = useState(null);
    const [viewFileContent, setViewFileContent] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('javascript'); // Add language state
    const popupRef = useRef(null); // Ref for the popup content

    const handleTopicsChange = (event) => {
        setNewTopic(event.target.value);
    };

    const addTopic = () => {
        if (newTopic.trim() !== '' && !selectedTopics.includes(newTopic.trim())) {
            setSelectedTopics([...selectedTopics, newTopic.trim()]);
            setNewTopic('');
        }
    };

    const handleDifficultyChange = (event) => {
        setDifficulty(event.target.value);
    };

    const handleFileChange = (event, fileType) => {
        const file = event.target.files[0];
        if (file) {
            if (fileType === 'main') {
                setMainFile(file);
            } else if (fileType === 'solution') {
                setSolutionFile(file);
            }
        }
    };

    const handleViewFile = (file) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setViewFileContent(reader.result);
                setShowPopup(true);
            };
            reader.readAsText(file);
            // Optionally set language based on file type or extension
            setSelectedLanguage('javascript'); // Adjust language if needed
        }
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                closePopup();
            }
        };

        if (showPopup) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showPopup]);

    return (
        <div className="problem-creation-container">
            <TopBar />
            <h1 className="problem-creation-title">Problem Creation Page</h1>
            <form className="problem-creation-form">
                <div className="form-group">
                    <label className="form-label" htmlFor="problemName">Problem Name</label>
                    <input type="text" id="problemName" className="form-control" placeholder="Enter problem name" />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="problemDescription">Problem Description</label>
                    <textarea id="problemDescription" className="form-control" rows="4" placeholder="Enter problem description"></textarea>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="problemType">Type</label>
                    <select id="problemType" className="form-control">
                        <option value="JAVA">JAVA</option>
                        <option value="CPP">CPP</option>
                        <option value="KAREL">KAREL</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="difficulty">Difficulty</label>
                    <select
                        id="difficulty"
                        className={`form-control difficulty ${difficulty.toLowerCase()}`}  // Apply dynamic class based on difficulty
                        value={difficulty}
                        onChange={handleDifficultyChange}
                    >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="topics">Topics</label>
                    <div className="topic-input-container">
                        <input
                            type="text"
                            id="topics"
                            className="form-control topic-input"
                            placeholder="Add a topic"
                            value={newTopic}
                            onChange={handleTopicsChange}
                            onKeyDown={(e) => e.key === 'Enter' && addTopic()}
                        />
                        <button type="button" className="add-topic-button" onClick={addTopic}>Add Topic</button>
                    </div>
                    <ul className="topics-list">
                        {selectedTopics.map((topic, index) => (
                            <li key={index} className="topics-list-item">{topic}</li>
                        ))}
                    </ul>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="mainFile">Main File</label>
                    <div className="file-input-container">
                        <input
                            type="file"
                            id="mainFile"
                            className="form-control"
                            onChange={(e) => handleFileChange(e, 'main')}
                        />
                        {mainFile && (
                            <button type="button" className="view-file-button" onClick={() => handleViewFile(mainFile)}>
                                View
                            </button>
                        )}
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="solutionFile">Solution File</label>
                    <div className="file-input-container">
                        <input
                            type="file"
                            id="solutionFile"
                            className="form-control"
                            onChange={(e) => handleFileChange(e, 'solution')}
                        />
                        {solutionFile && (
                            <button type="button" className="view-file-button" onClick={() => handleViewFile(solutionFile)}>
                                View
                            </button>
                        )}
                    </div>
                </div>
                <button type="button" className="draft-button">Draft</button>
            </form>
            {showPopup && (
                <div className="code-popup">
                    <div className="code-popup-content" ref={popupRef}>
                        <SyntaxHighlighter language={selectedLanguage} style={dracula}>
                            {viewFileContent}
                        </SyntaxHighlighter>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProblemCreation;
