// import transporter from '../config/email/index.js';
// // import redisClient from '../config/redis/index.js';
// // import {Worker} from 'bull';

// // const connection = new redisClient();

//   const sendMail =(async (email, subject, Content) => {
//   const emailInfo = {
//     from: {
//         name:'Grunge Studio',
//         email:process.env.NODEMAILER_USER
//     },
//     to: email.trim().toLowerCase(),
//     subject: subject,
//     text: Content,
   
//   };
// try{
//     await transporter.sendMail(emailInfo)
//     console.log(`Email successfully sent to ${email}`)
// }catch(error){
//     console.error('Detailed SMTP Error:', error);
// };

// });

// export default sendMail;

import transporter from '../config/email/index.js';

const sendMail = async (email, subject, Content) => {
  const emailInfo = {
    // Standard RFC-compliant string format for sender
    from: `"Grunge Studio" ${process.env.NODEMAILER_USER}`,
    to: email.trim().toLowerCase(),
    subject: subject,
    text: Content,
  };

  try {
    const info = await transporter.sendMail(emailInfo);
    console.log(`Email successfully sent to ${email}. Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    // Log the EXACT error so you can debug Brevo responses
    console.error('Error occurred while sending email:', error);
    throw error;
  }
};

export default sendMail;