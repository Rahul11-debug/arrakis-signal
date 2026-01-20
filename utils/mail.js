import nodemailer from 'nodemailer';

export const sendMail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, 
      auth: {
        user: process.env.MAIL_USER.trim(),
        pass: process.env.MAIL_PASS.trim()
      }
    });

    await transporter.verify(); 

    await transporter.sendMail({
      from: `"Arrakis Signal" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text
    });

    console.log('✅ Mail sent successfully');
  } catch (error) {
    console.error('❌ Mail error:', error.message);
  }
};
