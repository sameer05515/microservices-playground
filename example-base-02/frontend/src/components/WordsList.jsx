import React, { useState, useEffect } from 'react';

const WordsList = () => {
    const [words, setWords] = useState([]);

    useEffect(() => {
        // Fetch data from the words endpoint
        fetch('http://localhost/words')
            .then(response => {
                // Check if response is OK
                if (!response.ok) {
                    throw new Error('Failed to fetch words');
                }
                // Parse response as JSON
                return response.json();
            })
            .then(data => {
                // Access the words array from the response data
                setWords(data.words);
            })
            .catch(error => {
                console.error('Error fetching words:', error.message);
            });
    }, []); // Empty dependency array ensures the effect runs only once on component mount

    return (
        <div>
            <h1>Words List</h1>
            <ul>
                {words.map((word, index) => (
                    <li key={index}>{word}</li>
                ))}
            </ul>
        </div>
    );
};

export default WordsList;
