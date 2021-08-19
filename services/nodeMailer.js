const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config();

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendRegisterConfirmationEmail = async (name, email, confirmationCode) => {
    try {
      const mailSend= await transport.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Please confirm your account",
        html: `
            <h1>TechBlog</h1>
            <h3>Email Confirmation</h>
            <h2>Hello ${name}</h2>
            <p>Thank you for signUp. Please confirm your email by clicking on the following link</p>
            <a href=http://localhost:3000/register/confirm/${confirmationCode}> Click here</a>
            </div>`,
      });
      console.log("mail",mailSend)
      
    } catch (error) {
      console.log("mailErr",error)
    }
  };


  const sendPasswordResetConfirmationEmail = async (name, email, confirmationCode) => {
    try {
      const mailSend= await transport.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset",
        html: `
            <h1>TechBlog</h1>
            <h3>Password Reset</h>
            <h2>Hello ${name}</h2>
            <p>Set new password by clicking on the following link</p>
            <a href=http://localhost:3000/password-reset/${confirmationCode}> Click here</a>
            </div>`,
      });
      console.log("mail",mailSend)
      
    } catch (error) {
      console.log("mailErr",error)
    }
  };

  module.exports= {
    sendRegisterConfirmationEmail,
    sendPasswordResetConfirmationEmail
  }
  