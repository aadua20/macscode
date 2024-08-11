import React, { useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript'; // Importing JavaScript mode
import 'ace-builds/src-noconflict/theme-github'; // Importing GitHub theme
import '../styles/SolutionTemplate.css';

const SolutionTemplate = ({ solutionFileTemplate, onChange }) => {
    const [code, setCode] = useState(solutionFileTemplate);

    const handleChange = (newCode) => {
        setCode(newCode);
        if (onChange) {
            onChange(newCode);
        }
    };

    return (
        <div className="solution-template">
            <AceEditor
                mode="java" // Change to the appropriate language mode if needed
                theme="github" // Change to the preferred theme
                name="editor"
                value={code}
                onChange={handleChange}
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showGutter: true,
                    showPrintMargin: false,
                    tabSize: 4
                }}
                width="100%"
                height="400px" // Adjust the height as needed
            />
        </div>
    );
};

export default SolutionTemplate;
