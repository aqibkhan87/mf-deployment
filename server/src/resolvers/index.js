import { mergeResolvers } from '@graphql-tools/merge';
import userResolver from './user.js';
import productResolver from './products.js';
import cartResolver from './cart.js';

const resolvers = mergeResolvers([
  userResolver,
  productResolver,
  cartResolver
]);

export default resolvers;
