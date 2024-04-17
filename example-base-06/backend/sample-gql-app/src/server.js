const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const fs = require("fs");

const app = express();

// Read resume data from JSON file
const resumesData = JSON.parse(fs.readFileSync("./public/resumes.json"));


// Define GraphQL schema
const schema = buildSchema(`
  type Resume {
    id: Int
    name: String
    title: String
    experience: String
    skills: [String]
  }

  type Query {
    getResume(id: Int!): Resume
  }
`);

// Define resolver functions
const root = {
  getResume: ({ id }) => {
    const res = resumesData[id];
    console.log(JSON.stringify(res));
    return res;
  },
};

// Set up GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // Enable GraphiQL for testing
  })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
