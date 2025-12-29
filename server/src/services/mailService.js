import nodemailer from "nodemailer";

export const sendMail = async ({ to, subject, html, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // TLS
      auth: {
        user: process.env.MAIL_USER, // your email
        pass: process.env.MAIL_PASS, // app password
      },
    });

    const info = await transporter.sendMail({
      from: `Flight Confirmation ${process.env.MAIL_USER}`,
      to,
      subject,
      html,
      text
    });

    console.log("Mail sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Mail error:", error);
    return false;
  }
};
