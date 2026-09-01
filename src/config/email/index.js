// import nodemailer from 'nodemailer';
// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: true,
//   auth: {
//     user: process.env.NODEMAILER_USER,
//     pass: process.env.NODEMAILER_APP_PASSWORD,
//   },
// });
// export default transporter;

import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
  port: Number(process.env.SMTP_PORT) || 2525,
  secure: false, // Must be false for port 2525
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Prevents the request from hanging forever if port 2525 drops connection
  connectionTimeout: 10000, 
  greetingTimeout: 5000,
  socketTimeout: 10000,
});

export default transporter;