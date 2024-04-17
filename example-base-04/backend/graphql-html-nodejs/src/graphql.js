const axios = require('axios');

async function getAllResumes() {
    const response = await axios.post('http://localhost:4000/graphql', {
        query: `
            query {
                getAllResumes {
                    uniqueId
                    introduction
                    summary
                    companies {
                        uniqueId
                        name
                        details
                        projects {
                            uniqueId
                            name
                            details
                        }
                    }
                    educations {
                        uniqueId
                        name
                        details
                    }
                }
            }
        `
    });
    return response.data.data.getAllResumes;
}

module.exports = { getAllResumes };
