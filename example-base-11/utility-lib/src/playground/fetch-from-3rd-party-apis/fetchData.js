/**
 * Fetches data from a given URL and returns it as an array.
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<Array>} - A promise that resolves to an array of data.
 */
async function fetchData(url) {
    try {
        const response = await fetch(url);
        
        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Assuming the API returns an array
        if (Array.isArray(data)) {
            return data;
        } else {
            throw new Error('Data is not an array');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

// Example usage:
fetchData('http://localhost:3003/topics')
    .then(dataArray => {
        console.log('Fetched data:', dataArray);
    })
    .catch(error => {
        console.error('Failed to fetch data:', error);
    });
