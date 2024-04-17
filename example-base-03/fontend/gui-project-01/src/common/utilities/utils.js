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
