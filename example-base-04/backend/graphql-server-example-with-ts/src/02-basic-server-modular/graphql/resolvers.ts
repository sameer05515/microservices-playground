import { books } from "../data/books.js";
import continents from "../data/continents.js";
import { users } from "../data/users.js";

import { GraphQLResolveInfo } from "graphql";

export const resolvers = {
  Query: {
    books: () => books,
    numberSix: () => {
      return 6;
    },
    numberSeven: () => {
      return 7;
    },
    user(
      parent: unknown,
      args: { id: string },
      contextValue: unknown,
      info: GraphQLResolveInfo
    ) {
      return users.find((user) => user.id === args.id);
    },
    cities(
      parent: unknown,
      args: { continentId: number; countryID: number },
      contextValue: unknown,
      info: GraphQLResolveInfo
    ) {
      let cities: { id: number; name: string }[] = [];
      console.log(`continentId: ${typeof args.continentId}, countryID: ${typeof args.countryID} `)
      cities =
        continents
          .find((c) => c.id === +args.continentId)
          ?.countries.find((c) => c.id === +args.countryID)?.cities || [];
      return cities;
    },
  },
};
