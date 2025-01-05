const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const typeDefs = require('../schemas/resumeSchema');
const resolvers = require('../resolvers/resumeResolvers');

const config = require('../../common/config/globalConfig');

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  const app = express();
  server.applyMiddleware({
    app,
    bodyParserConfig: {
      limit: config.bodyParserLimit
    }
  });

  await mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const PORT = config.port;
  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startApolloServer().catch(error => console.error(error));
