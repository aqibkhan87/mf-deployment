const CartTypes = `#graphql
  type CartItem {
    _id: String!
    quantity: Int!
  }

  type Cart {
    cartId: String!
    products: [CartItem!]!
  }

  type Query {
    getCart(cartId: String!): Cart
  }

  type Mutation {
    addToCart(cartId: String, productId: String!, quantity: Int!): Cart
    removeFromCart(cartId: String!, productId: String!): Cart
  }
`;

export default CartTypes;
