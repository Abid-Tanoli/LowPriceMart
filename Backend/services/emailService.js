import { EMAIL_USER } from "../config/email.js";
import { createTransporter } from "../utils/transporter.js";
import logger from "../utils/logger.js";

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"LowPriceMart" <${EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info("Email sent");
    return info;
  } catch (error) {
    logger.error("Error sending email:", error);
    throw error;
  }
};
