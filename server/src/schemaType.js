// Define GraphQL schema
const typeDefs = `#graphql
  type Query {
    users: [User]
    user(_id: ID!): User
    quotes: [Quote]
  }

  type User {
   _id: ID!
   firstName: String!
   lastName: String!
   email: String!
   password: String!
   quotes: [Quote]
  }

  type TokenType {
   token: String!
  }

  type Quote {
   _id: ID!
   comment: String!
  }

  type Mutation {
    createUser(userNew: UserInputType!): User
    signinUser(payload: SignInInput!): TokenType
  }

  input UserInputType {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  input SignInInput {
    email: String!
    password: String!
  }
`;

export default typeDefs;