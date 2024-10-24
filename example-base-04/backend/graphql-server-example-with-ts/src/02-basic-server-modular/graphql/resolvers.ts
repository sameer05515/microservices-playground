// src/graphql/resolvers.ts
import { books } from "../data/books.js";

export const resolvers = {
  Query: {
    books: () => books,
  },
};
