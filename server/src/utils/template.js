import { formatDate } from "./helper.js";

export const flightConfirmationTemplate = (booking, PNR) => {
  const passengers = booking?.passengers;
  const priceBreakdown = booking?.flightDetail?.priceBreakdown;
  const travelerPricing = booking?.flightDetail?.travelerPricing?.[0];
  const templateGenerated = `
        <div style="
            font-family: Arial, sans-serif;
            background-color: #f4f6f8;
            padding: 20px;
            ">
            <div style="
                max-width: 600px;
                margin: auto;
                background: #ffffff;
                border-radius: 8px;
                padding: 24px;
            ">
                <p style="font-size: 14px; color: #555;">
                    Your flight booking has been successfully confirmed.
                </p>

                <table
                    width="100%"
                    height="300"
                    cellpadding="0"
                    cellspacing="0"
                    style="
                        background-image: url(${
                          process.env.API_BASE_URL
                        }/images/${booking?.destinationAirport?.iata}.png);
                        background-size: cover;
                        background-position: center;
                        background-repeat: no-repeat;
                        text-align: center;
                    "
                    >
                    <tr>
                        <td
                        valign="middle"
                        style="
                            color: #fff;
                            padding: 20px;
                            font-size: 14px;
                        "
                        >
                        <p style="margin: 6px 0;">
                            Your PNR is <b style="background-color: black">${PNR}</b>
                        </p>
                        <p style="margin: 6px 0;">
                            ${booking?.sourceAirport?.city}, ${
    booking?.sourceAirport?.iata
  } → ${booking?.destinationAirport?.city}, ${booking?.destinationAirport?.iata}
                        </p>
                        <p style="margin: 6px 0;">
                            ${formatDate(
                              booking?.flightDetail?.segments?.[0]
                                ?.departureTime
                            )}
                        </p>
                        </td>
                    </tr>
                </table>
                <!-- PASSENGERS -->
                <h3 style="font-size: 16px; margin-top: 24px;">Passenger(s)</h3>
                <ul style="padding-left: 18px; font-size: 14px; margin: 8px 0;">
                    ${passengers
                      ?.map(
                        (p) =>
                          `<li>${p?.firstName} ${p?.lastName} (${p?.type})</li>`
                      )
                      .join("")}
                </ul>

                <!-- BAGGAGE -->
                <h3 style="font-size: 16px; margin-top: 24px;">Baggage Allowance</h3>
                <div style="font-size: 14px; margin: 6px 0;">

                    ${travelerPricing?.includedCabinBags?.quantity ?
                        `<span>
                            Hand: Up to ${
                              travelerPricing?.includedCabinBags?.quantity
                            }PC
                       </span>` : ``}
                    
                      ${travelerPricing?.includedCabinBags?.weight ?
                          `<span>
                              Hand: Up to ${
                                travelerPricing?.includedCabinBags?.weight
                              }
                              ${travelerPricing?.includedCabinBags?.weightUnit}
                          </span>` : ``}
                      ${travelerPricing?.includedCheckedBags?.weight ?
                          `<span>
                                | Check-in: ${travelerPricing?.includedCheckedBags?.weight}
                                  ${travelerPricing?.includedCheckedBags?.weightUnit}
                          </span>` : ``}
                      ${travelerPricing?.includedCheckedBags?.quantity ? 
                            `<span>
                                | Check-in: ${travelerPricing?.includedCheckedBags?.quantity}PC
                            </span>` : ``}
                </div>

                <!-- FARE -->
                <h3 style="font-size: 16px; margin-top: 24px;">Fare Summary</h3>
                <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 14px;">
                    <tr>
                        <td>Base Fare</td>
                        <td align="right">
                            ₹ ${priceBreakdown?.basePrice * passengers?.length}
                        </td>
                    </tr>
                    <tr>
                        <td>Addons</td>
                        <td align="right">
                            ₹ ${priceBreakdown?.addonsPrice}
                        </td>
                    </tr>
                    <tr>
                        <td>Taxes & Fees</td>
                        <td align="right">
                            ₹ ${priceBreakdown?.seatsPrice}
                        </td>
                    </tr>
                    <tr>
                        <td>Taxes & Fees</td>
                        <td align="right">
                            ₹ ${priceBreakdown?.taxes}
                        </td>
                    </tr>
                    <tr>
                        <td><b>Total Paid</b></td>
                        <td align="right">
                            ₹ ${priceBreakdown?.finalPrice}</b>
                        </td>
                    </tr>
                </table>

                <!-- IMPORTANT NOTES -->
                <p style="font-size: 12px; color: #777; margin-top: 24px;">
                    • Please carry a valid government-issued photo ID.<br/>
                    • Flight timings are subject to change.<br/>
                    • Infants must be accompanied by an adult and do not occupy a separate seat.
                </p>

                <!-- FOOTER -->
                <p style="font-size: 12px; color: #999; margin-top: 20px;">
                    This is an automated email. Please do not reply.
                </p>
            </div>
        </div>
      `;
      return templateGenerated
};
