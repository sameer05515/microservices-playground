import React, { useState, useEffect } from 'react';
import { fetchJsonData } from './api';
import './VocabularyPage.css';


const VocabularyPage = () => {
    const [wordList, setWordList] = useState([]);

    useEffect(() => {
        fetchJsonData('/data/vocab.json')
            .then(data => {
                setWordList(data);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const handleExerciseHeaderClick = (index) => {
        console.log(`Clicked word header at index ${index}`);
    };

    
    return (
        <div>

            {wordList.length} <br/>
            {/* <span className="albumHeader">jQuery html() example: This HTML page is designed to help in memorizing words</span> */}
            {/* <table>
                <tbody>
                    <tr>
                        <td>
                            <span id="nextExcerciseMover" className="commandHeader">Next Word move</span>
                        </td>
                        <td>
                            <span id="previousExcerciseMover" className="commandHeader">Previous Word move</span>
                        </td>
                        <td>
                            <span id="next50ExcerciseMover" className="commandHeader">Jump to next 50 Word move</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span>Offset <input id="txtOffset" type="text" width="20" height="10" /></span>
                        </td>
                        <td>
                            <span>Count<input id="txtCount" type="text" width="20" height="10" /></span>
                        </td>
                        <td>
                            <span id="btnChangeSettings" className="commandHeader">Change settings</span>
                        </td>
                    </tr>
                </tbody>
            </table> */}

            {/* <div id="currentStatusdisplayer" className="commandHeader">Current Status</div> */}

            {wordList.map((word, index) => (
                <div key={index} className="wordContainer">
                    <div className="wordHeader" onClick={() => handleExerciseHeaderClick(index)}>
                        {word.word}
                    </div>
                    <div className="allowedTimeToDisplay">
                        {word.allowedTime}
                    </div>
                    {/* <div className="wordContent">
                        Render meanings and examples here
                    </div> */}

                    <div className="wordContent">
                        <h3>Meanings:</h3>
                        <ul>
                            {word.meanings.map((meaning, index) => (
                                <li key={index}>{meaning}</li>
                            ))}
                        </ul>
                        <h3>Examples:</h3>
                        <ul>
                            {word.examples.map((example, index) => (
                                <li key={index}>{example}</li>
                            ))}
                        </ul>
                    </div>

                </div>
            ))}
        </div>
    );
};

export default VocabularyPage;
