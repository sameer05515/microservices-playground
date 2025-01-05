import React, { useState, useEffect } from 'react';
import env from "react-dotenv";

const TopicsList = () => {
    const [topics, setTopics] = useState([]);

    // Default to local URL if environment variable not set
    const TOPIC_BACKEND_BASE_URL= env.TOPIC_BACKEND_BASE_URL || 'http://localhost:3000'; 

    useEffect(() => {
        // Fetch data from the topics endpoint
        // alert(`TOPIC_BACKEND_BASE_URL : ${env.TOPIC_BACKEND_BASE_URL}`);
        fetch(`${TOPIC_BACKEND_BASE_URL}/topics`)
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
