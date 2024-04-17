import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import ResumeDashboard from './components/resume/ResumeDashboard';

// Create an ApolloClient instance
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // Replace with your GraphQL endpoint URI
  cache: new InMemoryCache()
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div>
        <h1>Resume Dashboard</h1>
        <ResumeDashboard />
      </div>
    </ApolloProvider>
  );
};

export default App;
