import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: String,
  city: String,
  country: String,
  iata: String,
  icao: String,
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: [Number], // [lon, lat]
  }
},
{
  collection: "airport"
});
schema.index({ location: "2dsphere" });
schema.index({ name: "text", city: "text", country: "text", iata: "text" });

export default mongoose.model("airport", schema);
