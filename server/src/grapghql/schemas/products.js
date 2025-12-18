const productTypes = `#graphql
  type Query {
    getAllProductCategories: [ProductsCategories]!
  }

  type Mutation {
    addProducts(payload: [ProductsCategoryInput!]!): ProductCategoryInsertion
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

  type ProductCategoryInsertion {
   message: String!
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

export default productTypes;
