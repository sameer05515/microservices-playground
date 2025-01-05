export const handleDownloadJSON = (
    jsonData,
    downloadFileName = "data.json"
) => {
    const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], {
        type: "application/json",
    });
    const url = URL.createObjectURL(jsonBlob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", downloadFileName);
    document.body.appendChild(link);
    link.click();
};

export const hasDuplicateKeys = (obj) => {
    const seenKeys = new Set();
    const conflictedFields = [];
    const messages = [];

    for (const key in obj) {
        if (seenKeys.has(key)) {
            conflictedFields.push(key);
            messages.push(`Duplicate key found: ${key}`);
        }
        seenKeys.add(key);
    }

    return {
        isError: conflictedFields.length > 0,
        conflictedFields,
        messages
    };
    // if(conflictedFields.length>0){
    //     throw new Error(messages);
    // }

    // return false;
}
