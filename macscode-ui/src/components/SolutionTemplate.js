import React, { useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
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
                mode="java"
                theme="github"
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
                height="400px"
            />
        </div>
    );
};

export default SolutionTemplate;
