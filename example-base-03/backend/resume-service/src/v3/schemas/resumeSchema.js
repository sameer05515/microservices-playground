const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar JSON

  type ProcessedDetails {
    rawText: String
    textType: String
    metadata: JSON
  }

  type Company {
    uniqueId: String!
    name: String!
    details: String!
    processedDetails: ProcessedDetails
    projects: [Project]
  }

  type Project {
    uniqueId: String!
    name: String!
    details: String!
    processedDetails: ProcessedDetails
  }

  type Education {
    uniqueId: String!
    name: String!
    details: String!
    processedDetails: ProcessedDetails
  }

  type Resume {
    uniqueId: String!
    introduction: String!
    summary: String!
    companies: [Company]
    educations: [Education]
    processedDetails: ProcessedDetails
  }

  input ProcessedDetailsInput {
    rawText: String!
    textType: String!
    metadata: JSON
  }

  input CompanyInput {
    uniqueId: String
    name: String!
    details: String!
    processedDetails: ProcessedDetailsInput
    projects: [ProjectInput]
  }

  input ProjectInput {
    uniqueId: String
    name: String!
    details: String!
    processedDetails: ProcessedDetailsInput
  }

  input EducationInput {
    uniqueId: String
    name: String!
    details: String!
    processedDetails: ProcessedDetailsInput
  }

  input ResumeInput {
    uniqueId: String
    introduction: String!
    summary: String!
    companies: [CompanyInput]
    educations: [EducationInput]
    processedDetails: ProcessedDetailsInput
  }

  type Query {
    getResume(uniqueId: String!): Resume
    getAllResumes: [Resume]
  }

  type Mutation {
    upsertResume(resume: ResumeInput!): Resume
  }
`;

module.exports = typeDefs;
