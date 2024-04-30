// Import required packages
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Define MongoDB Schema using Mongoose
const { Schema } = mongoose;

const companySchema = new Schema({
  uniqueId: { type: String, unique: true, default: () => uuidv4() },
  name: String,
  details: String,
  projects: [{
    uniqueId: { type: String, unique: true, default: uuidv4 },
    name: String,
    details: String
  }]
});

const educationSchema = new Schema({
  uniqueId: { type: String, unique: true, default: () => uuidv4() },
  name: String,
  details: String
});

const resumeSchema = new Schema({
  uniqueId: { type: String, default: () => uuidv4() },
  introduction: String,
  summary: String,
  companies: [companySchema],
  educations: [educationSchema]
});

const ResumeModel = mongoose.model('Resume', resumeSchema);

// Define GraphQL type definitions
const typeDefs = gql`
  type Company {
    uniqueId: String!
    name: String!
    details: String!
    projects: [Project]
  }

  type Project {
    uniqueId: String!
    name: String!
    details: String!
  }

  type Education {
    uniqueId: String!
    name: String!
    details: String!
  }

  type Resume {
    uniqueId: String!
    introduction: String!
    summary: String!
    companies: [Company]
    educations: [Education]
  }

  input CompanyInput {
    name: String!
    details: String!
    projects: [ProjectInput]
  }

  input ProjectInput {
    name: String!
    details: String!
  }

  input EducationInput {
    name: String!
    details: String!
  }

  input ResumeInput {
    introduction: String!
    summary: String!
    companies: [CompanyInput]
    educations: [EducationInput]
  }

  type Query {
    getResume(uniqueId: String!): Resume
    getAllResumes: [Resume]   # New query to get all resumes
  }

  type Mutation {
    upsertResume(resume: ResumeInput!): Resume
  }
`;

// Define resolvers
const resolvers = {
  Query: {
    getResume: async (_, { uniqueId }) => {
      return await ResumeModel.findOne({ uniqueId });
    },
    getAllResumes: async () => {
      return await ResumeModel.find();
    }
  },
  Mutation: {
    upsertResume: async (_, { resume }) => {
      // Logic to upsert the resume document in MongoDB
      // You need to handle both create and update operations
      // Here is a simple example:
      return await ResumeModel.findOneAndUpdate(
        { uniqueId: resume.uniqueId },
        resume,
        { upsert: true, new: true }
      );
    },
  },
};

// Create ApolloServer and apply middleware
const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
// Start Apollo Server and apply middleware
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
}
startServer();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/ms_playground_ex03_resume_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB Connected');
    // Start the server
    app.listen({ port: 4000 }, () =>
      console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
    );
  })
  .catch(err => console.error(err));
