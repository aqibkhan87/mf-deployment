import dayjs from "dayjs";
import SeatMapModel from "../../models/flights/seatMap.js";

// Helper to remove .000Z from ISO date strings
function removeMillisecondsFromDateString(dateStr) {
  return dayjs(dateStr).format("YYYY-MM-DDTHH:mm:ss");
}

// Generic function to replace all dates in a string
function replaceDatesInString(str) {
  return str.replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.000Z/g, (match) =>
    removeMillisecondsFromDateString(match)
  );
}

export const updateFlightKeys = async () => {
  try {
    const flights = await SeatMapModel.find({});

    // for (const flight of flights) {

    //   if (flight.flightInstanceKey) {
    //     flight.flightInstanceKey = replaceDatesInString(flight.flightInstanceKey);
    //   }

    //   if (flight.itineraryKey) {
    //     flight.itineraryKey = replaceDatesInString(flight.itineraryKey);
    //   }

    //   await flight.save();
    // }

    // console.log("Flight keys updated successfully!");

    // For Delete
    const result = await SeatMapModel.deleteMany({
      $or: [
        { flightInstanceKey: { $exists: false } },
        { itineraryKey: { $exists: false } },
      ],
    });

    console.log(`${result.deletedCount} flights deleted.`);
  } catch (err) {
    console.error("Error updating flight keys:", err);
  }
};

export const updateSeatMapData = async () => {
  try {
    console.log("called Reached");
    await SeatMapModel.updateMany(
      {
        seatStatus: { $exists: true },
      },
      [
        {
          $set: {
            seatStatus: {
              $arrayToObject: {
                $map: {
                  input: { $objectToArray: "$seatStatus" },
                  as: "cabin",
                  in: {
                    k: "$$cabin.k",
                    v: {
                      $arrayToObject: {
                        $map: {
                          input: { $objectToArray: "$$cabin.v" },
                          as: "seat",
                          in: {
                            k: "$$seat.k",
                            v: {
                              status: {
                                $cond: [
                                  {
                                    $eq: [
                                      { $type: "$$seat.v.status" },
                                      "object",
                                    ],
                                  },
                                  "$$seat.v.status.status",
                                  "$$seat.v.status",
                                ],
                              },
                              passengerId: {
                                $ifNull: ["$$seat.v.passengerId", null],
                              },
                              reservedAt: {
                                $ifNull: ["$$seat.v.reservedAt", null],
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ]
    );

    console.log(`SeatMap updated.`);
  } catch (err) {
    console.error("Error updating seatMap keys:", err);
  }
};
