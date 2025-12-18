const userTypes = `#graphql
  type Query {
    users: [User]
  }

  type Mutation {
    createUser(userNew: UserInputType!): User
    signinUser(payload: SignInInput!): TokenType
  }

  type User {
   _id: ID!
   firstName: String!
   lastName: String!
   email: String!
   password: String!
  }

  type TokenType {
   token: String!
  }

  type ProductCategoryInsertion {
   message: String!
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

export default userTypes;
