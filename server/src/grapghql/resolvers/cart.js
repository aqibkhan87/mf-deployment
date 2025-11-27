import redis from 'redis';
import { v4 as uuidv4 } from 'uuid';

// Set up Redis client
const redisClient = redis.createClient();

// Helper: get cart from Redis
const getCart = async (cartId) => {
  const cartData = await redisClient.getAsync(cartId);
  return cartData ? JSON.parse(cartData) : { cartId, items: [] };
};

// Helper: set cart to Redis
const setCart = async (cartId, cart) => {
  await redisClient.setAsync(cartId, JSON.stringify(cart));
};


// Define resolvers
const CartResolver = {
  Query: {
    getCart: async (_, { cartId }) => await getCart(cartId),
  },
  Mutation: {
    addToCart: async (_, { cartId, productId, quantity }) => {
      const id = cartId || uuidv4();
      let cart = await getCart(id);

      const itemIndex = cart.items.findIndex(i => i.productId === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      await setCart(id, cart);
      return cart;
    },
    removeFromCart: async (_, { cartId, productId }) => {
      const cart = await getCart(cartId);
      cart.items = cart.items.filter(i => i.productId !== productId);
      await setCart(cartId, cart);
      return cart;
    },
  },
};

export default CartResolver;
