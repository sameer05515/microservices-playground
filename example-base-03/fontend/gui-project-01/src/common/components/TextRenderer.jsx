import React, { useState } from 'react';
import { COLORS } from '../utilities/constants';
import { generateStyle } from '../styles/ResumeComponentsStyle';
import HTMLDataViewer from './HTMLDataViewer';

const TextRenderer = ({ rawText, initialRenderType = 'plain-text', showRadioButtons = true }) => {
    const [renderType, setRenderType] = useState(initialRenderType);

    const handleRadioChange = (event) => {
        setRenderType(event.target.value);
    };

    return (
        <div>
            {
                showRadioButtons && <div>
                    <input
                        type="radio"
                        id="plainText"
                        name="renderType"
                        value="plain-text"
                        checked={renderType === 'plain-text'}
                        onChange={handleRadioChange}
                    />
                    <label htmlFor="plainText">Plain Text</label>
                    <input
                        type="radio"
                        id="htmlText"
                        name="renderType"
                        value="html"
                        checked={renderType === 'html'}
                        onChange={handleRadioChange}
                    />
                    <label htmlFor="htmlText">HTML Text</label>
                </div>
            }


            {renderType === 'plain-text' ? (
                <pre style={{ ...generateStyle(COLORS.ANTIQUE_WHITE), whiteSpace: 'pre-wrap' }}>{rawText}</pre>
            ) : (
                <HTMLDataViewer style={generateStyle(COLORS.ANTIQUE_WHITE)} htmlText={rawText} />
            )}
        </div>
    );
};

export default TextRenderer;
