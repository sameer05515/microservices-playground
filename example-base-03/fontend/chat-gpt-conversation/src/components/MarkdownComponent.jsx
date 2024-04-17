import React from 'react';
import ReactMarkdown from 'react-markdown';
// import gfm from 'remark-gfm';
// import rehypeHighlight from 'rehype-highlight';
// import hljs from 'highlight.js';

// Define a custom component to render code blocks
// const CodeBlock = ({ language, value }) => {
//     const highlightedCode = hljs.highlight(value, { language }).value;

//     return (
//         <pre>
//             <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
//         </pre>
//     );
// };

// Function to apply basic syntax highlighting to code blocks
// const highlightCode = (code, language) => {
//     switch (language) {
//       case 'javascript':
//         return <code style={{ color: 'green' }}>{code}</code>;
//       case 'html':
//         return <code style={{ color: 'blue' }}>{code}</code>;
//       // Add more cases for other languages as needed
//       default:
//         return <code>{code}</code>;
//     }
//   };

//   // Custom renderers for code blocks
//   const renderers = {
//     code: ({ language, value }) => (
//       <pre>
//         {highlightCode(value, language)}
//       </pre>
//     )
//   };

const MarkdownComponent = ({ markdownText = '' }) => {
    return (
        <div>
            <ReactMarkdown >{markdownText}</ReactMarkdown>
            {/* <ReactMarkdown
                children={markdownText}
                components={{
                    code: CodeBlock,
                }}
            /> */}
            {/* <ReactMarkdown children={markdownText} components={{
                    code: renderers,
                }}
                 renderers={highlightCode} /> */}
        </div>
    );
};

export default MarkdownComponent;
