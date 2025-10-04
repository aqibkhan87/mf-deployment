import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import redis from 'redis';
import { v4 as uuidv4 } from 'uuid';

// Set up Redis client
const redisClient = redis.createClient();

import UserModel from "../models/user.js";
import ProductCategoryModel from "../models/e-product-category.js";
import ProductModel from "../models/e-product.js";

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
const resolvers = {
  Query: {
    users: async () => await UserModel.find(),
    getAllProductCategories: async () => {
      return await ProductCategoryModel.find().populate("products");
    },
    getCart: async (_, { cartId }) => await getCart(cartId),
  },
  Mutation: {
    createUser: async (_, { userNew: payload }) => {
      const isUserExist = await UserModel.findOne({
        email: payload.email,
      });
      if (isUserExist) {
        throw new Error("User Already Exist");
      }

      if (!isUserExist) {
        const hashedPassword = await bcrypt.hash(payload.password, 12);
        const newUser = new UserModel({ ...payload, password: hashedPassword });
        return await newUser.save();
      }
    },
    signinUser: async (_, { payload }) => {
      const isUserExist = await UserModel.findOne({
        email: payload.email,
      });
      if (!isUserExist) {
        throw new Error("User Doesn't Exist");
      }

      if (isUserExist) {
        const isSame = await bcrypt.compare(
          payload.password,
          isUserExist.password
        );
        let token = "";
        if (!isSame) {
          throw new Error("Incorrect Credientials");
        } else {
          token = jwt.sign({ userId: isUserExist._id }, "SECRET");
          return {
            token,
          };
        }
      }
    },
    addProducts: async (_, { payload }) => {
      let categoriesProcessed = 0;
      let productsProcessed = 0;
      try {
        for (const category of payload) {
          const productIds = [];
  
          // Upsert each product with assigned categoryid = category.categoryid
          for (const product of category.products) {
            const updatedProduct = new ProductModel(product);
            await updatedProduct.save();
            productsProcessed++;
            // Only add product _id to this category if its categoryid matches
            if (updatedProduct.categoryid === category.categoryid) {
              productIds.push(updatedProduct._id);
            }
          }
  
          // Find if the category exists
          const existingCategory = await ProductCategoryModel.findOne({
            categoryid: category.categoryid,
          });

          if (existingCategory) {
            // Update category with filtered product IDs only
            await ProductCategoryModel.findOneAndUpdate(
              { categoryid: category.categoryid },
              {
                title: category.title,
                products: productIds, // products exclusively for this category
              },
              { new: true }
            );
            categoriesProcessed++;
          } else {
            // Create new category with only related product IDs
            const newCategory = new ProductCategoryModel({
              categoryid: category.categoryid,
              title: category.title,
              products: productIds,
            });
            await newCategory.save();
            categoriesProcessed++;
          }
        }

        return { message: "Added new Product Categories" };
      } catch(error) {
        console.log("errorr.   32323", error)
      }
    },
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

export default resolvers;
