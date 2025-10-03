// Define GraphQL schema
const typeDefs = `#graphql
  type Query {
    users: [User]
    getAllProductCategories: [ProductsCategories]!
  }

  type User {
   _id: ID!
   firstName: String!
   lastName: String!
   email: String!
   password: String!
  }

  type ProductsCategories {
   categoryid: String!
   title: String!
   products: [Product]!
  }

  type Product {
   _id: ID!
   categoryid: String!
   name: String!
   rating: String!
   reviews: String!
   productImage: String!
   images: [String]!
   seller: String!
   price: String!
   discountedPrice: String!
   actualPrice: String!
  }

  type TokenType {
   token: String!
  }

  type ProductCategoryInsertion {
   message: String!
  }

  type Mutation {
    createUser(userNew: UserInputType!): User
    signinUser(payload: SignInInput!): TokenType
    addProducts(payload: [ProductsCategoryInput!]!): ProductCategoryInsertion
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

  input ProductsCategoryInput {
    title: String!
    categoryid: String!
    products: [ProductInput]!
  }

  input ProductInput {
    categoryid: String!
    name: String!
    rating: String!
    reviews: String!
    productImage: String!
    images: [String]!
    seller: String!
    price: String!
    discountedPrice: String!
    actualPrice: String!
  }
`;

export default typeDefs;
