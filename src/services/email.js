import transporter from '../config/email/index.js';
// import redisClient from '../config/redis/index.js';
// import {Worker} from 'bull';

// const connection = new redisClient();

  const sendMail =(async (email, subject, Content) => {
  const emailInfo = {
    from: {
        name:'Grunge Studio',
        email:process.env.NODEMAILER_USER
    },
    to: email.trim().toLowerCase(),
    subject: subject,
    text: Content,
   
  };
try{
    await transporter.sendMail(emailInfo)
    console.log(`Email successfully sent to ${email}`)
}catch(error){
    console.log('Error occured while sending email');
};

});
export default sendMail;