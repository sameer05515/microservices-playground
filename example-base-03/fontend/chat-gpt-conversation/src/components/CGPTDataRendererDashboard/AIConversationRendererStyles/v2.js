export const rootStyles = {
    fontFamily: 'sans-serif',
    margin: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
};

export const conversationStyles = {
    border: '1px solid black',
    padding: '20px',
    //backgroundColor: '#f3f3f3',
    marginBottom: '20px',
};

export const messageStyles = {
    margin: '20px 0',
    whiteSpace: 'pre-wrap',
};

export const userMessageContentStyles = {
    margin: '20px 0',
    whiteSpace: 'pre-wrap',
    border: "1px solid #ccc",
    padding: "5px",
    borderRadius: "10px", // Adding round borders
    //backgroundColor: "PaleGreen", // Set the background color dynamically
    backgroundColor:"cornsilk",
    marginBottom: "5px", // Adding vertical spacing of 5px
};

export const otherMessageContentStyles = {
    margin: '20px 0',
    whiteSpace: 'pre-wrap',
    border: "1px solid #ccc",
    padding: "5px",
    borderRadius: "2px", // Adding round borders
    //backgroundColor: "AntiqueWhite", // Set the background color dynamically
    backgroundColor: "lavenderblush",
    marginBottom: "5px", // Adding vertical spacing of 5px
};

export const authorStyles = {
    fontWeight: 'bold',
    marginBottom: '4px',
};