const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const typeDefs = require('../schemas/resumeSchema');
const resolvers = require('../resolvers/resumeResolvers');

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  const app = express();
  server.applyMiddleware({ app ,
    bodyParserConfig: {
      limit:"60mb"
    }});

  await mongoose.connect('mongodb://127.0.0.1:27017/ms_playground_ex03_resume_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startApolloServer().catch(error => console.error(error));
