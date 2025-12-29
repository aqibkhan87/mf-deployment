import { formatDate } from "./helper.js";

export const flightConfirmationTemplate = (booking, PNR) => {
  return `
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
                        background-image: url(${process.env.API_BASE_URL}/images/${booking?.destinationAirport?.iata}.png);
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
                            Your PNR is <b>${PNR}</b>
                        </p>
                        <p style="margin: 6px 0;">
                            ${booking?.sourceAirport?.city}, ${booking?.sourceAirport?.iata} → ${booking?.destinationAirport?.city}, ${booking?.destinationAirport?.iata}
                        </p>
                        <p style="margin: 6px 0;">
                            ${formatDate(booking?.flightDetail?.segments?.[0]?.departureTime)}
                        </p>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
      `;
};
