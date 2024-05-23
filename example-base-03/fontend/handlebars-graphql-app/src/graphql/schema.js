const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Resume {
    uniqueId: ID!
    introduction: String
    # Define other fields as needed
  }

  type Query {
    getAllResumes: [Resume]
  }
`);

module.exports = schema;
