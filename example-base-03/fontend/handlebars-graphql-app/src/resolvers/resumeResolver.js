const axios = require('axios');

const root = {
  getAllResumes: async () => {
    try {
      // Fetch data from the GraphQL endpoint using Axios
      const response = await axios.post('http://localhost:4000/graphql', {
        query: `
        query GetResume {
          getAllResumes {
            uniqueId
            
            introduction
            processedDetails {
              metadata
            }
            companies {
              uniqueId
              name
              processedDetails {
                metadata
              }
              projects {
                name
                processedDetails {
                  metadata
                }
                uniqueId
              }
            }
            educations {
              name
              uniqueId
              processedDetails {
                metadata
              }
            }
          }
        }
        
        `
      });

      // Extract the resumes data from the response
      const resumes = response.data.data.getAllResumes;
      return resumes;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  },
  getResume: async (uniqueId) => {
    try {
      // Fetch data from the GraphQL endpoint using Axios
      const response = await axios.post('http://localhost:4000/graphql', {
        query: `
        query GetResume($uniqueId: String!) {
          getResume(uniqueId: $uniqueId) {
            uniqueId
            summary
            introduction
            processedDetails {
              rawText
              metadata
              textType
            }
          }
        }
        `,
        variables: { uniqueId }
      });

      // Extract the resume data from the response
      const resume = response.data.data.getResume;
      return resume;
    } catch (error) {
      console.error('Error fetching resume data:', error);
      return null;
    }
  }
};

module.exports = root;
