import express from "express";
import AddressModel from "../models/address.js";

const apiRouter = express.Router();

// Get all addresses
apiRouter.get("/", async (req, res) => {
  const addresses = await AddressModel.find({ userId: req.query.userId }).sort({
    isDefault: -1,
    createdAt: -1,
  });
  res.json({ success: true, addresses });
});

// Mark Default addresses
apiRouter.get("/make-default", async (req, res) => {
  const { userId, addressId } = req.query;

  if (!userId || !addressId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing parameters" });
  }

  try {
    // Step 1: Set all user addresses to false
    await AddressModel.updateMany({ userId }, { $set: { isDefault: false } });

    // Step 2: Set selected address to true
    await AddressModel.findByIdAndUpdate(
      addressId,
      { $set: { isDefault: true } },
      { new: true }
    );

    // Step 3: Return updated list sorted
    const addresses = await AddressModel.find({ userId }).sort({
      isDefault: -1,
    });

    return res.json({
      success: true,
      message: "Default address updated successfully",
      addresses,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Add address
apiRouter.post("/add", async (req, res) => {
  const address = new AddressModel({
    ...req.body,
    userId: req.query.userId,
  });
  await address.save();
  res.json({ success: true });
});

// Update address
apiRouter.put("/edit", async (req, res) => {
  await AddressModel.findByIdAndUpdate(req.body._id, req.body, {
    new: true,
  });
  res.json({ success: true });
});

// Update address
apiRouter.delete("/", async (req, res) => {
  await AddressModel.findByIdAndDelete({
    _id: req.query.addressId,
    userId: req.query.userId,
  });
  res.json({ success: true });
});

export default apiRouter;
