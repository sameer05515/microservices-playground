import React, { useEffect, useState } from 'react'
import { coversationNames } from '../utils/constants';

const ConversationFileSelector = ({initialSelectedFile='',onChange=()=>{}}) => {
    

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

    const [selectedValue, setSelectedValue] = useState('');

    useEffect(()=>{
        if(initialSelectedFile){
            const option=mappedArray.find(ma=>ma.value===initialSelectedFile);
            if(option){
                setSelectedValue(()=>option.value);
            }            
        }
        
    },[])

    const styles = {
        container: {
            fontFamily: 'Arial, sans-serif',
            padding: '5px',
            maxWidth: '400px',
            margin: '0 auto',
            border: '1px solid #ccc',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
        },
        label: {
            display: 'block',
            marginBottom: '10px',
            fontWeight: 'bold'
        },
        select: {
            width: '100%',
            padding: '5px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '12px'
        },
        selectedValue: {
            marginTop: '20px',
            padding: '5px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#e9e9e9',
            fontSize: '12px'
        }
    };

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
        <div style={styles.container}>
            <label htmlFor="conversationSelect" style={styles.label}>Select a Conversation:</label>
            <select id="conversationSelect" style={styles.select} onChange={handleChange} value={selectedValue}>
                <option value="" disabled>Select a conversation</option>
                {mappedArray.map((item, index) => (
                    <option key={index} value={item.value}>
                        {item.label}
                    </option>
                ))}
            </select>
            {selectedValue && (
                <div style={styles.selectedValue}>
                    Selected Conversation: {selectedValue}
                </div>
            )}
        </div>
    );
}

export default ConversationFileSelector