const capitalizedText = (inputText)=>{
    if (!inputText) {
        console.error('empty string provided.');
        return "";
    }
    return inputText.toUpperCase();
}

module.exports = {
    capitalizedText
};