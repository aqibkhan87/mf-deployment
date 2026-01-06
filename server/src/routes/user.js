// routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";
import CartModel from "../models/ecommerce/e-cart.js";

const apiRouter = express.Router();

/* ======================
   SIGNUP
====================== */
apiRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const exists = await UserModel.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashed,
    });

    res.json({ status: 200 });
  } catch (err) {
    console.error("signup error", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================
   LOGIN
====================== */
apiRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const cart = await CartModel.findOne({
      userId: user?._id,
      cartStatus: { $ne: "COMPLETED" },
    });

    const payload = {
      success: true,
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        _id: user._id,
      },
    };
    if (cart?._id) payload.cartId = cart?._id;
    res.json(payload);
  } catch (err) {
    console.error("login error", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default apiRouter;
