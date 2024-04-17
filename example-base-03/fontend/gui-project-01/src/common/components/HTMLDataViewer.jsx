import React from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

const HTMLDataViewer = ({ style, htmlText }) => {
    return (
        <div style={style}>{ReactHtmlParser(htmlText)}</div>
    );
};

HTMLDataViewer.propTypes = {
    style: PropTypes.object,
    htmlText: PropTypes.string.isRequired,
};

export default HTMLDataViewer;
