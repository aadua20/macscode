import React, { useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import '../styles/SolutionTemplate.css';

const SolutionTemplate = ({ solutionFileTemplate, onChange, problemType }) => {
    const [code, setCode] = useState(solutionFileTemplate);

    const handleChange = (newCode) => {
        setCode(newCode);
        if (onChange) {
            onChange(newCode);
        }
    };

    const language = problemType === 'CPP' ? 'c_cpp' : 'java';
    return (
        <div className="solution-template">
            <AceEditor
                mode={language}
                theme="monokai"
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
