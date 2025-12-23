import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS } from "../config/email.js";

export const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
};
