import React from 'react'

const DynamicComponentRenderer = ({ content }) => {
    // Check if the content is a string (JSX markup)
    if (typeof content === 'string') {
      // Render JSX markup using dangerouslySetInnerHTML
      const html = { __html: content };
      return <div dangerouslySetInnerHTML={html}></div>;
    }
  
    // Check if the content is a valid React component
    if (typeof content === 'object' && typeof content.type === 'function') {
      // Render the JSX component
      return React.createElement(content.type, { ...content.props });
    }
  
    // If the content is neither a string nor a React component, return null
    return null;
  };

export default DynamicComponentRenderer;