const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const fs = require('fs');
const handlebars = require('./helpers/handlebarsHelpers');
const schema = require('./graphql/schema');
const root = require('./resolvers/resumeResolver');

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

app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// Serve static files
app.use('/assets', express.static(__dirname + '/assets'));

// Register partials
handlebars.registerPartial('resumeItem', fs.readFileSync(__dirname + '/views/partials/resumeItem.handlebars', 'utf8'));
handlebars.registerPartial('resumeAboutSection', fs.readFileSync(__dirname + '/views/partials/resumeAboutSection.handlebars', 'utf8'));


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

// Route to render the resume detail template
app.get('/resume/:uniqueId', async (req, res) => {
    try {
      const uniqueId = req.params.uniqueId;
      // Fetch data from the GraphQL endpoint for the specific resume
      // This requires modifications in the resolver function to handle the new query
      const resume = await root.getResume(uniqueId);
      res.render('resumeDetail', resume);
    } catch (error) {
      console.error('Error rendering resume detail template:', error);
      res.render('resumeDetail', { error: 'Resume not found' });
    }
  });

// Start the server
const port = 4001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
