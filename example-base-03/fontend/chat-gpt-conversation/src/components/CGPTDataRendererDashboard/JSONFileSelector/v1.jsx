import React, { useEffect, useState, memo, useCallback } from 'react'
import { coversationNames } from '../../../common/utils/constants'; 

const ConversationFileSelector = memo(({initialSelectedFile='',onChange=()=>{}}) => {
    const [selectedValue, setSelectedValue] = useState('');

    const handleChange = useCallback((event) => {
        const newValue = event.target.value;
        setSelectedValue(newValue);
        console.log(`Selected value: ${newValue}`);
        onChange(newValue);
    }, [onChange]);

    const mappedArray = Object.entries(coversationNames).map(
        ([key, value]) => ({
            value: value,
            label: key,
        })
    );

    useEffect(() => {
        if(initialSelectedFile){
            const option = mappedArray.find(ma => ma.value === initialSelectedFile);
            if(option){
                setSelectedValue(option.value);
            }            
        }
    }, [initialSelectedFile, mappedArray]);


    // return (
    //     <div>
    //         <label htmlFor="conversationSelect">Select a Conversation:</label>
    //         <select id="conversationSelect" onChange={handleChange} value={selectedValue}>
    //         <option value="" disabled>Select a conversation</option>
    //             {mappedArray.map((item, index) => (
    //                 <option key={index} value={item.value}>
    //                     {item.label}
    //                 </option>
    //             ))}
    //         </select>
    //         {selectedValue && (
    //             <div>
    //                 <p>Selected Conversation: {selectedValue}</p>
    //             </div>
    //         )}
    //     </div>
    // );

    return (
        <div className="p-2 max-w-md mx-auto border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 font-sans">
            <label htmlFor="conversationSelect" className="block mb-3 font-bold text-gray-800 dark:text-gray-200">
                Select a Conversation:
            </label>
            <select 
                id="conversationSelect" 
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 text-xs bg-white dark:bg-gray-800 dark:text-gray-200"
                onChange={handleChange} 
                value={selectedValue}
            >
                <option value="" disabled>Select a conversation</option>
                {mappedArray.map((item, index) => (
                    <option key={index} value={item.value}>
                        {item.label}
                    </option>
                ))}
            </select>
            {selectedValue && (
                <div className="mt-5 p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-700 text-xs text-gray-800 dark:text-gray-200">
                    Selected Conversation: {selectedValue}
                </div>
            )}
        </div>
    );
});

ConversationFileSelector.displayName = "ConversationFileSelector";

export default ConversationFileSelector;