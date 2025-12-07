import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModel from "../../models/user.js";

// Define resolvers
const UserResolver = {
  Query: {
    users: async () => await UserModel.find(),
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
          token = jwt.sign({ userId: isUserExist._id }, process.env.JWT_SECRET);
          return {
            token,
          };
        }
      }
    },
  },
};

export default UserResolver;
