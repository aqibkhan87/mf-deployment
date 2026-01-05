import express from "express";
const router = express.Router();
import Airport from "../../models/flights/airports.js";

router.get("/", async (req, res) => {
  const defaultCities = [
    "Delhi",
    "Agra",
    "Mumbai",
    "Bengaluru",
    "Hyderabad",
    "Paris",
    "London",
    "Dubai",
    "Singapore",
    "Tokyo",
    "Berlin",
    "Dublin",
    "Beijing",
    "Jeddah",
    "Tel Aviv",
    "New York",
    "Moscow",
    "Los Angeles",
    "Doha",
    "Bangkok",
  ];
  const defaultAirports = {
    city: { $in: defaultCities },
  };
  const results = await Airport.find(defaultAirports).lean();
  return res.json(results);
});

/**
 * GET /api/airports?q=delhi
 * returns array of airports matching query
 */
router.get("/search", async (req, res) => {
  try {
    let q = (req.query.q || "").trim();
    if (!q) {
      q = "d";
      const regex = new RegExp(q, "i");
      const matchedAirports = await Airport.aggregate([
        {
          $match: {
            $or: [
              { iata: { $regex: regex } },
              { name: { $regex: regex } },
              { city: { $regex: regex } },
            ],
          },
        },
        {
          $addFields: {
            // Higher score = higher priority
            matchScore: {
              $switch: {
                branches: [
                  {
                    case: { $regexMatch: { input: "$iata", regex } },
                    then: 100,
                  },
                  {
                    case: { $regexMatch: { input: "$name", regex } },
                    then: 75,
                  },
                  {
                    case: { $regexMatch: { input: "$city", regex } },
                    then: 50,
                  },
                ],
                default: 0,
              },
            },
          },
        },
        { $sort: { matchScore: -1, name: 1, iata: 1 } },
        { $limit: 5 },
      ]);
      return res.json({ queryResults: matchedAirports });
    }

    const regex = new RegExp(q, "i");

    const matchedAirports = await Airport.aggregate([
      {
        $match: {
          $or: [
            { iata: { $regex: regex } },
            { name: { $regex: regex } },
            { city: { $regex: regex } },
          ],
        },
      },
      {
        $addFields: {
          // Higher score = higher priority
          matchScore: {
            $switch: {
              branches: [
                { case: { $regexMatch: { input: "$iata", regex } }, then: 100 },
                { case: { $regexMatch: { input: "$name", regex } }, then: 75 },
                { case: { $regexMatch: { input: "$city", regex } }, then: 50 },
              ],
              default: 0,
            },
          },
        },
      },
      { $sort: { matchScore: -1, name: 1, iata: 1 } },
      { $limit: 5 },
    ]);

    // console.log("matchedAirports", matchedAirports);

    if (!matchedAirports.length) {
      return res.status(200).json({ queryResults: [] });
    }

    // Step 2️⃣ Take the first/best matched airport as reference
    const baseAirport = matchedAirports[0];
    const [lng, lat] = baseAirport.location.coordinates;

    // Step 3️⃣ Find 3 nearest airports around the base airport
    const nearestAirports = await Airport.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          distanceField: "distanceInMeters",
          spherical: true,
          query: { _id: { $ne: baseAirport._id } }, // exclude itself
        },
      },
      {
        $addFields: {
          distanceInKm: { $divide: ["$distanceInMeters", 1000] },
        },
      },
      { $limit: 6 }, // ✅ add $limit here instead
      {
        $project: {
          name: 1,
          city: 1,
          country: 1,
          iata: 1,
          icao: 1,
          "location.coordinates": 1,
          distanceInKm: 1,
        },
      },
    ]);

    const combined = [
      ...matchedAirports.slice(0, 1),
      ...nearestAirports,
      ...matchedAirports,
    ].map((a) => ({
      name: a.name,
      city: a.city,
      country: a.country,
      iata: a.iata,
      icao: a.icao,
      coords: a.location?.coordinates,
      distanceInKm: a?.distanceInKm,
    }));

    // ✅ Remove duplicates by IATA/ICAO
    const queryResults = combined.filter(
      (a, i, self) =>
        i === self.findIndex((b) => b.iata === a.iata || b.icao === a.icao)
    );

    // Step 4️⃣ Return combined response
    return res.status(200).json({
      queryResults: queryResults,
    });
  } catch (error) {
    console.error("❌ Airport search error:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
