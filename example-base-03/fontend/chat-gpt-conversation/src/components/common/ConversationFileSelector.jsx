import React, { useState } from 'react'
import { coversationNames } from '../../utils/constants';

const ConversationFileSelector = ({onChange=()=>{}}) => {
    const [selectedValue, setSelectedValue] = useState('');

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
        console.log(`Selected value: ${event.target.value}`);
        onChange(event.target.value)
    };

    const mappedArray = Object.entries(coversationNames).map(
        ([key, value]) => {
            return {
                value: value,
                label: key,
            };
        }
    );
    // return (
    //     <div>
    //         ConversationFileSelector
    //         <pre>{JSON.stringify(mappedArray,null,2)}</pre>
    //     </div>
    // )
    return (
        <div>
            <label htmlFor="conversationSelect">Select a Conversation:</label>
            <select id="conversationSelect" onChange={handleChange} value={selectedValue}>
            <option value="" disabled>Select a conversation</option>
                {mappedArray.map((item, index) => (
                    <option key={index} value={item.value}>
                        {item.label}
                    </option>
                ))}
            </select>
            {selectedValue && (
                <div>
                    <p>Selected Conversation: {selectedValue}</p>
                </div>
            )}
        </div>
    );
}

export default ConversationFileSelector