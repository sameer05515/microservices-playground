import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import { generateRoutes } from "./utils/router-constants";

// Create an ApolloClient instance
const client = new ApolloClient({
  uri: "http://localhost:4000/graphql", // Replace with your GraphQL endpoint URI
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          {/* <Route path="/" element={<Parent />} >
          <Route path="child1" element={<Child1 />} />
          <Route path="child2" element={<Child2 />} />
        </Route> */}
          {generateRoutes()}
        </Routes>
      </Router>
    </ApolloProvider>
  );
};

export default App;
