import { formatDate, formatDuration, formatTime, subtractMinutesFromUTC } from "./helper.js";

export const flightConfirmationTemplate = (booking, PNR) => {
  const passengers = booking?.passengers;
  const priceBreakdown = booking?.priceBreakdown;
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
                          `<li>${p?.firstName} ${p?.lastName} (${p?.gender})</li>`
                      )
                      .join("")}
                </ul>

                <!-- BAGGAGE -->
                <h3 style="font-size: 16px; margin-top: 24px;">Baggage Allowance</h3>
                <div style="font-size: 14px; margin: 6px 0;">

                    ${
                      travelerPricing?.includedCabinBags?.quantity
                        ? `<span>
                            Hand: Up to ${travelerPricing?.includedCabinBags?.quantity}PC
                       </span>`
                        : ``
                    }
                    
                      ${
                        travelerPricing?.includedCabinBags?.weight
                          ? `<span>
                              Hand: Up to ${travelerPricing?.includedCabinBags?.weight}
                              ${travelerPricing?.includedCabinBags?.weightUnit}
                          </span>`
                          : ``
                      }
                      ${
                        travelerPricing?.includedCheckedBags?.weight
                          ? `<span>
                                | Check-in: ${travelerPricing?.includedCheckedBags?.weight}
                                  ${travelerPricing?.includedCheckedBags?.weightUnit}
                          </span>`
                          : ``
                      }
                      ${
                        travelerPricing?.includedCheckedBags?.quantity
                          ? `<span>
                                | Check-in: ${travelerPricing?.includedCheckedBags?.quantity}PC
                            </span>`
                          : ``
                      }
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
                        <td>Seats Price</td>
                        <td align="right">
                            ₹ ${priceBreakdown?.seatsPrice}
                        </td>
                    </tr>
                    <tr>
                        <td>Taxes</td>
                        <td align="right">
                            ₹ ${priceBreakdown?.taxes}
                        </td>
                    </tr>
                    <tr>
                        <td><b>Total Paid</b></td>
                        <td align="right">
                            ₹ ${priceBreakdown?.totalPrice}</b>
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
  return templateGenerated;
};

export const boardingPassGenerateTemplate = (
  boardingPasses,
  PNR,
) => {
  const templateGenerated = `<!DOCTYPE html>
    <html>
        <head>
        <meta charset="UTF-8" />
        <style>
            body {
                font-family: "Inter", Arial, sans-serif;
                background: #eef1f5;
                padding: 30px;
            }

            .ticket {
                width: 860px;
                margin: auto;
                background: white;
                border-radius: 18px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.12);
                overflow: hidden;
                position: relative;
                margin-bottom: 50px;
            }

            /* Header */
            .ticket-header {
            background: linear-gradient(135deg, #0d47a1, #1976d2);
            color: #fff;
            padding: 20px 28px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            }

            .ticket-header h1 {
            font-size: 22px;
            margin: 0;
            letter-spacing: 0.5px;
            }

            .pnr {
            font-size: 14px;
            font-weight: 600;
            opacity: 0.95;
            }

            /* Route */
            .route {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 24px;
            border-bottom: 1px dashed #dcdcdc;
            }

            .city {
            text-align: center;
            width: 120px;
            }

            .city h2 {
            margin: 0;
            font-size: 26px;
            letter-spacing: 1px;
            }

            .city span {
            font-size: 12px;
            color: #666;
            }

            .plane {
            margin: 0 40px;
            font-size: 26px;
            color: #1976d2;
            }

            /* Main content */
            .content {
            display: flex;
            padding: 24px 28px;
            }

            .info {
            flex: 2;
            }

            .row {
            display: flex;
            margin-bottom: 14px;
            }

            .block {
            width: 50%;
            }

            .label {
            font-size: 11px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            }

            .value {
            font-size: 15px;
            font-weight: 600;
            color: #222;
            }

            /* Seat highlight */
            .seat-box {
                background: #f1f7ff;
                border: 1px solid #cfe1ff;
                padding: 12px;
                border-radius: 10px;
                margin-top: 10px;
                display: flex;
                justify-content: space-between;
                font-size: 14px;
                font-weight: 600;
                color: #0d47a1;
            }

            /* QR Section */
            .qr-section {
                flex: 1;
                text-align: center;
                border-left: 1px dashed #dcdcdc;
                padding-left: 24px;
            }

            .qr-section img {
                width: 180px;
                height: 180px;
            }

            .qr-section p {
                margin-top: 10px;
                font-size: 12px;
                color: #555;
            }

            /* Footer */
            .footer {
                background: #f7f9fc;
                padding: 14px 28px;
                font-size: 12px;
                color: #555;
                display: flex;
                justify-content: space-between;
            }
        </style>
        </head>

        <body>
        <div>
            ${boardingPasses
              .map(
                (boardingPass) => `
                    <div class="ticket">

                    <div class="ticket-header">
                        <h1>Boarding Pass</h1>
                        <div class="pnr">PNR: ${PNR}</div>
                    </div>

                    <div class="route">
                        <div class="city">
                        <h2>${boardingPass?.departureAirport}</h2>
                        <span>${boardingPass?.departureCity}</span>
                        </div>

                        <div class="plane">${boardingPass?.airlineName}${" "}✈️</div>

                        <div class="city">
                        <h2>${boardingPass?.arrivalAirport}</h2>
                        <span>${boardingPass?.arrivalCity}</span>
                        </div>
                    </div>

                    <div class="content">
                        <div class="info">

                        <div class="row">
                            <div class="block">
                            <div class="label">Passenger</div>
                            <div class="value">
                                ${boardingPass?.passengerName}
                            </div>
                            </div>
                            <div class="block">
                            <div class="label">Flight</div>
                            <div class="value">
                                ${boardingPass?.flightNumber}
                            </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="block">
                                <div class="label">Date</div>
                                <div class="value">
                                    ${boardingPass?.departureTime ? 
                                        formatDate(boardingPass?.departureTime) : ""}
                                </div>
                            </div>
                            <div class="block">
                                <div class="label">Boarding Time</div>
                                <div class="value">
                                    ${boardingPass?.departureTime ? 
                                        subtractMinutesFromUTC(boardingPass?.departureTime) : ""}
                                </div>
                            </div>
                            
                        </div>
                        <div class="row">
                            <div class="block">
                                <div class="label">Deperature Time</div>
                                <div class="value">
                                    ${boardingPass?.departureTime ? 
                                        formatTime(boardingPass?.departureTime) : ""}
                                </div>
                            </div>
                            <div class="block">
                                <div class="label">Arrival Time</div>
                                <div class="value">
                                    ${boardingPass?.arrivalTime ? 
                                        formatTime(boardingPass?.arrivalTime) : ""}
                                </div>
                            </div>
                            
                        </div>
                        <div class="row">
                            <div class="block">
                                <div class="label">Duration</div>
                                <div class="value">
                                    ${boardingPass?.duration ? 
                                        formatDuration(boardingPass?.duration) : ""}
                                </div>
                            </div>
                            <div class="block">
                                <div class="label">Duration</div>
                                <div class="value">
                                    ${boardingPass?.duration ? 
                                        formatDuration(boardingPass?.duration) : ""}
                                </div>
                            </div>
                            
                        </div>

                        <div class="seat-box">
                            <div>Seat: ${boardingPass?.seatNumber}</div>
                            <div>${boardingPass?.cabin}</div>
                            <div>${boardingPass?.departureTerminal ? `T${boardingPass?.departureTerminal}` : ""}</div>
                        </div>
                        </div>

                        <div class="qr-section">
                        <img src="${boardingPass?.barcodeData}" />
                        <p>Scan at boarding gate</p>
                        </div>
                    </div>

                    <div class="footer">
                        <span>Please reach the gate 30 minutes before departure</span>
                        <span>Have a pleasant flight ✈️</span>
                    </div>

                    </div>
                `
                ).join("")}
              </div>
          </body>
        </html>
      `;
  return templateGenerated;
};

export const singleBoardingPassGenerateTemplate = (
  boardingPass,
  PNR,
) => {
    
  const templateGenerated = `<!DOCTYPE html>
    <html>
        <head>
        <meta charset="UTF-8" />
        <style>
            body {
                font-family: "Inter", Arial, sans-serif;
                background: #eef1f5;
                padding: 30px;
            }

            .ticket {
                width: 860px;
                margin: auto;
                background: white;
                border-radius: 18px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.12);
                overflow: hidden;
                position: relative;
                margin-bottom: 50px;
            }

            /* Header */
            .ticket-header {
            background: linear-gradient(135deg, #0d47a1, #1976d2);
            color: #fff;
            padding: 20px 28px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            }

            .ticket-header h1 {
            font-size: 22px;
            margin: 0;
            letter-spacing: 0.5px;
            }

            .pnr {
            font-size: 14px;
            font-weight: 600;
            opacity: 0.95;
            }

            /* Route */
            .route {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 24px;
            border-bottom: 1px dashed #dcdcdc;
            }

            .city {
            text-align: center;
            width: 120px;
            }

            .city h2 {
            margin: 0;
            font-size: 26px;
            letter-spacing: 1px;
            }

            .city span {
            font-size: 12px;
            color: #666;
            }

            .plane {
            margin: 0 40px;
            font-size: 26px;
            color: #1976d2;
            }

            /* Main content */
            .content {
            display: flex;
            padding: 24px 28px;
            }

            .info {
            flex: 2;
            }

            .row {
            display: flex;
            margin-bottom: 14px;
            }

            .block {
            width: 50%;
            }

            .label {
            font-size: 11px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            }

            .value {
            font-size: 15px;
            font-weight: 600;
            color: #222;
            }

            /* Seat highlight */
            .seat-box {
                background: #f1f7ff;
                border: 1px solid #cfe1ff;
                padding: 12px;
                border-radius: 10px;
                margin-top: 10px;
                display: flex;
                justify-content: space-between;
                font-size: 14px;
                font-weight: 600;
                color: #0d47a1;
            }

            /* QR Section */
            .qr-section {
                flex: 1;
                text-align: center;
                border-left: 1px dashed #dcdcdc;
                padding-left: 24px;
            }

            .qr-section img {
                width: 180px;
                height: 180px;
            }

            .qr-section p {
                margin-top: 10px;
                font-size: 12px;
                color: #555;
            }

            /* Footer */
            .footer {
                background: #f7f9fc;
                padding: 14px 28px;
                font-size: 12px;
                color: #555;
                display: flex;
                justify-content: space-between;
            }
        </style>
        </head>

        <body>
        <div>
            
                    <div class="ticket">

                    <div class="ticket-header">
                        <h1>Boarding Pass</h1>
                        <div class="pnr">PNR: ${PNR}</div>
                    </div>

                    <div class="route">
                        <div class="city">
                        <h2>${boardingPass?.departureAirport}</h2>
                        <span>${boardingPass?.departureCity}</span>
                        </div>

                        <div class="plane">${boardingPass?.airlineName}${" "}✈️</div>

                        <div class="city">
                        <h2>${boardingPass?.arrivalAirport}</h2>
                        <span>${boardingPass?.arrivalCity}</span>
                        </div>
                    </div>

                    <div class="content">
                        <div class="info">

                        <div class="row">
                            <div class="block">
                            <div class="label">Passenger</div>
                            <div class="value">
                                ${boardingPass?.passengerName}
                            </div>
                            </div>
                            <div class="block">
                            <div class="label">Flight</div>
                            <div class="value">
                                ${boardingPass?.flightNumber}
                            </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="block">
                                <div class="label">Date</div>
                                <div class="value">
                                    ${boardingPass?.departureTime ? 
                                        formatDate(boardingPass?.departureTime) : ""}
                                </div>
                            </div>
                            <div class="block">
                                <div class="label">Boarding Time</div>
                                <div class="value">
                                    ${boardingPass?.departureTime ? 
                                        subtractMinutesFromUTC(boardingPass?.departureTime) : ""}
                                </div>
                            </div>
                            
                        </div>
                        <div class="row">
                            <div class="block">
                                <div class="label">Deperature Time</div>
                                <div class="value">
                                    ${boardingPass?.departureTime ? 
                                        formatTime(boardingPass?.departureTime) : ""}
                                </div>
                            </div>
                            <div class="block">
                                <div class="label">Arrival Time</div>
                                <div class="value">
                                    ${boardingPass?.arrivalTime ? 
                                        formatTime(boardingPass?.arrivalTime) : ""}
                                </div>
                            </div>
                            
                        </div>
                        <div class="row">
                            <div class="block">
                                <div class="label">Duration</div>
                                <div class="value">
                                    ${boardingPass?.duration ? 
                                        formatDuration(boardingPass?.duration) : ""}
                                </div>
                            </div>
                            <div class="block">
                                <div class="label">Duration</div>
                                <div class="value">
                                    ${boardingPass?.duration ? 
                                        formatDuration(boardingPass?.duration) : ""}
                                </div>
                            </div>
                            
                        </div>

                        <div class="seat-box">
                            <div>Seat: ${boardingPass?.seatNumber}</div>
                            <div>${boardingPass?.cabin}</div>
                            <div>${boardingPass?.departureTerminal ? `T${boardingPass?.departureTerminal}` : ""}</div>
                        </div>
                        </div>

                        <div class="qr-section">
                        <img src="${boardingPass?.barcodeData}" />
                        <p>Scan at boarding gate</p>
                        </div>
                    </div>

                    <div class="footer">
                        <span>Please reach the gate 30 minutes before departure</span>
                        <span>Have a pleasant flight ✈️</span>
                    </div>

                    </div>
                
              </div>
          </body>
        </html>
      `;
  return templateGenerated;
};

export const boardingPassMailTemplate = (
  pdfPath
) => {
  const templateGenerated = `<!DOCTYPE html>
    <html>
        <head>
        <meta charset="UTF-8" />
        <style>
            body {
            font-family: "Inter", Arial, sans-serif;
            background: #eef1f5;
            padding: 30px;
            }

            .ticket {
            width: 860px;
            margin: auto;
            background: white;
            border-radius: 18px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.12);
            overflow: hidden;
            position: relative;
            }

            /* Header */
            .ticket-header {
            background: linear-gradient(135deg, #0d47a1, #1976d2);
            color: #fff;
            padding: 20px 28px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            }

            .ticket-header h1 {
            font-size: 22px;
            margin: 0;
            letter-spacing: 0.5px;
            }

            .pnr {
            font-size: 14px;
            font-weight: 600;
            opacity: 0.95;
            }

            /* Route */
            .route {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 24px;
            border-bottom: 1px dashed #dcdcdc;
            }

            .city {
            text-align: center;
            width: 120px;
            }

            .city h2 {
            margin: 0;
            font-size: 26px;
            letter-spacing: 1px;
            }

            .city span {
            font-size: 12px;
            color: #666;
            }

            .plane {
            margin: 0 40px;
            font-size: 26px;
            color: #1976d2;
            }

            /* Main content */
            .content {
            display: flex;
            padding: 24px 28px;
            }

            .info {
            flex: 2;
            }

            .row {
            display: flex;
            margin-bottom: 14px;
            }

            .block {
            width: 50%;
            }

            .label {
            font-size: 11px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            }

            .value {
            font-size: 15px;
            font-weight: 600;
            color: #222;
            }

            /* Seat highlight */
            .seat-box {
                background: #f1f7ff;
                border: 1px solid #cfe1ff;
                padding: 12px;
                border-radius: 10px;
                margin-top: 10px;
                display: flex;
                justify-content: space-between;
                font-size: 14px;
                font-weight: 600;
                color: #0d47a1;
            }

            /* QR Section */
            .qr-section {
                flex: 1;
                text-align: center;
                border-left: 1px dashed #dcdcdc;
                padding-left: 24px;
            }

            .qr-section img {
                width: 180px;
                height: 180px;
            }

            .qr-section p {
                margin-top: 10px;
                font-size: 12px;
                color: #555;
            }

            /* Footer */
            .footer {
                background: #f7f9fc;
                padding: 14px 28px;
                font-size: 12px;
                color: #555;
                display: flex;
                justify-content: space-between;
            }
        </style>
        </head>

        <body>
        <div>
            <h1>Your Boarding Pass can be accessible through below url.</h1>

            <p>${pdfPath}</p>
              </div>
          </body>
        </html>
      `;
  return templateGenerated;
};
