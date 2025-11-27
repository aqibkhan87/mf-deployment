import mongoose from "mongoose";
import Airport from "./src/models/flights/airports.js";

async function connectDB() {
  const mongoURI = process.env.MONGO_URL;
  try {
    await mongoose.connect(mongoURI);

    // // Find all airports with bad coordinate order
    // const badAirports = await Airport.find({
    //   "location.coordinates.0": { $gte: -90, $lte: 90 }, // latitude range in first position
    //   "location.coordinates.1": { $gte: -180, $lte: 180 }, // longitude range in second position
    // });

    // console.log(`⚙️ Found ${badAirports.length} airports to fix`);

    // for (const airport of badAirports) {
    //   const [lat, lng] = airport.location.coordinates;
    //   airport.location.coordinates = [lng, lat]; // swap
    //   await airport.save();
    // }

    // console.log("✅ All coordinates fixed");

    // // Try creating index now
    // await Airport.collection.createIndex({ location: "2dsphere" });
    // console.log("✅ 2dsphere index created successfully!");

    // await Airport.collection.createIndex({ location: "2dsphere" });
    // console.log("✅ 2dsphere index created on location");
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

export default connectDB;
