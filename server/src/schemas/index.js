import { mergeTypeDefs } from '@graphql-tools/merge';
import userTypes from './user.js';
import productTypes from './products.js';
import cartTypes from './cart.js';

const rootType = `#graphql
  type Query
  type Mutation
`;

const typeDefs = mergeTypeDefs([
  rootType,
  userTypes,
  productTypes,
  cartTypes
]);

export default typeDefs;
