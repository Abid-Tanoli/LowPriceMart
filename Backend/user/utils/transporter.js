import nodemailer from "nodemailer";
import { EMAIL_PASS, EMAIL_USER } from "../config/email.js";

export const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
};
