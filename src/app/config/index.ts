import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL,
  ip: process.env.IP || "localhost",

  jwt_secret: process.env.JWT_SECRET || "secret",
  salt_rounds: process.env.SALT_ROUNDS || 10,


  smtp_host:process.env.SMTP_HOST ,
  nodemailer_host_email: process.env.NODEMAILER_HOST_EMAIL,
  nodemailer_host_pass: process.env.NODEMAILER_HOST_PASS,
  nodemailer_port: process.env.NODEMAILER_PORT || 587,
};