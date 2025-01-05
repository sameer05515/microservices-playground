// src/graphql/resolvers.ts

import { GraphQLResolveInfo } from "graphql";
import { books } from "../data/books.js";
import continents from "../data/continents.js";
import { users } from "../data/users.js";

// Resolver functions
const getBooks = () => books;

const getNumberSix = () => 6;

const getNumberSeven = () => 7;

const getUser = (
  parent: unknown,
  args: { id: string },
  contextValue: unknown,
  info: GraphQLResolveInfo
) => {
  return users.find((user) => user.id === args.id);
};

const getCities = (
  parent: unknown,
  args: { continentId: string; countryID: string },
  contextValue: unknown,
  info: GraphQLResolveInfo
) => {
  // console.log(
  //   `continentId: ${typeof args.continentId}, countryID: ${typeof args.countryID}`
  // );

  const continent = continents.find(
    (continent) => continent.id === +args.continentId
  );
  const country = continent?.countries.find(
    (country) => country.id === +args.countryID
  );
  // console.log("continent", continent, "country", country);
  return country?.cities || [];
};


// Main resolvers object
export const resolvers = {
  Query: {
    books: getBooks,
    numberSix: getNumberSix,
    numberSeven: getNumberSeven,
    user: getUser,
    cities: getCities,
  },
};
