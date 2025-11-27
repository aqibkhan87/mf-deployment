// import csv from "csvtojson";
import Airport from "../models/flights/airports.js"; // Import your airport Mongoose model
import path from "path";

const csvFilePath = path.resolve("./src/cron/airports.csv");
console.log("Loading CSV from:", csvFilePath);

import fs from "fs";
import csv from "csv-parser";

const importAirports = () => {
  const filePath = path.resolve("./src/cron/airport-codes.csv");
  const airportData = [];

  // Read CSV
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => airportData.push(row))
    .on("end", async () => {
      console.log(`✅ Loaded ${airportData.length} airports from CSV`);

      for (const row of airportData) {
        try {
          // Skip if IATA code is missing
          if (!row.iata_code) continue;

          // Try to find existing airport by name OR city OR iata
          let airport = await Airport.findOne({
            $or: [
              { name: row.name },
              { city: row.municipality },
              { iata: row.iata_code },
            ],
          });

          // Prepare data to insert/update
          const updateData = {
            name: row.name,
            city: row.municipality,
            country: row.iso_country,
            iata: row.iata_code,
            icao: row.ident,
            location: row.coordinates
              ? {
                  type: "Point",
                  coordinates: row.coordinates.split(",").map(Number),
                }
              : undefined,
          };

          if (airport) {
            // Update existing airport
            await Airport.updateOne({ _id: airport._id }, { $set: updateData });
            console.log(`🔄 Updated ${row.name} → ${row.iata_code}`);
          } else {
            // Add new airport
            airport = new Airport(updateData);
            await airport.save();
            console.log(`➕ Added ${row.name} → ${row.iata_code}`);
          }
        } catch (err) {
          console.error(`❌ Error processing ${row.name}:`, err.message);
        }
      }

      console.log("✅ All airports processed");
      process.exit(0);
    });
};
export default importAirports;
