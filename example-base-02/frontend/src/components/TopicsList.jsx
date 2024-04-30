import React, { useState, useEffect } from 'react';

const TopicsList = () => {
    const [topics, setTopics] = useState([]);

    useEffect(() => {
        // Fetch data from the topics endpoint
        fetch('http://localhost/topics')
            .then(response => {
                // Check if response is OK
                if (!response.ok) {
                    throw new Error('Failed to fetch topics');
                }
                // Parse response as JSON
                return response.json();
            })
            .then(data => {
                // Access the topics array from the response data
                setTopics(data.topics);
            })
            .catch(error => {
                console.error('Error fetching topics:', error.message);
            });
    }, []); // Empty dependency array ensures the effect runs only once on component mount

    return (
        <div>
            <h1>Topics List</h1>
            <ul>
                {topics.map((topic, index) => (
                    <li key={index}>{topic}</li>
                ))}
            </ul>
        </div>
    );
};

export default TopicsList;
