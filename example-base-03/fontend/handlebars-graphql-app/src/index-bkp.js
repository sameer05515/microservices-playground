const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const handlebars = require('handlebars');
const fs = require('fs');
const axios = require('axios');

// GraphQL schema
const schema = buildSchema(`
  type Resume {
    uniqueId: ID!
    introduction: String
  }

  type Query {
    getAllResumes: [Resume]
  }
`);

// Resolver function
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
  }
};

const app = express();

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true // Enable GraphiQL for testing the GraphQL endpoint
}));

// Handlebars view engine setup
app.engine('handlebars', (filePath, options, callback) => {
  fs.readFile(filePath, (err, content) => {
    if (err) return callback(err);

    const template = handlebars.compile(content.toString());
    const result = template(options);
    return callback(null, result);
  });
});

// Registering a custom Handlebars helper to stringify objects
handlebars.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

// app.set('views', './views');
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// Route to render the resume template
app.get('/', async (req, res) => {
  try {
    // Fetch data from the GraphQL endpoint and pass it to the view
    const resumes = await root.getAllResumes();
    res.render('resume', { resumes });
  } catch (error) {
    console.error('Error rendering template:', error);
    res.render('resume', { resumes: [] });
  }
});

// Start the server
const port = 4001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
