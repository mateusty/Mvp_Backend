import "dotenv/config";

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export async function sendEmail(name, email, subject, message) {
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: `${name} <${email}>`,
        replyTo: process.env.REPLY_TO,
        subject: subject,
        text: message
    }

    const info = await transporter.sendMail(mailOptions);
    console.log("Email enviado: ", info.response);
}