// src/graphql/typeDefs.ts
export const typeDefs = `#graphql
  type Book {
    title: String
    author: String
  }

  type User {
    id: ID!
    name: String
  }
  
  type City {
    id: ID!
    name: String
  }

  type Query {
    books: [Book]
    numberSix: Int! # Should always return the number 6 when queried
    numberSeven: Int! # Should always return 7
    user(id: ID!): User
    cities(continentId: ID!, countryID:ID!): [City]
  }
`;
