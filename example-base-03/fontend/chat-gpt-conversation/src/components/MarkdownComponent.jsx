import React from 'react';
import ReactMarkdown from 'react-markdown';

const MarkdownComponent = ({ markdownText = '', additionalStyle={} }) => {
    return (
        <div className='markdown-body' style={{padding:'5px', ...additionalStyle}}>
            <ReactMarkdown >{markdownText}</ReactMarkdown>
        </div>
    );
};

export default MarkdownComponent;
