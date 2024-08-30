import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

import ENV from '../config.js';

// https://ethereal.email/create

let nodeConfig = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: ENV.EMAIL,
    pass: ENV.PASSWORD,
  },
};

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Deftsoft",
        link: "https://deftsoft.com/"
    }
});


// POST: http://localhost:8080/api/registerMail

// @param: {
//     "username" : "example123",
//     "userEmail" : "shubhamdhatwalia3@gmail.com",
//     "text" : "",.
//     "subject" : "",
// }


export const registerMail = async (req, res) => {
    const { username, userEmail, text, subject, password } = req.body;

    // body of email---------------

    var email = {
        body: {
            name: username,
            intro: text || 'Welcome to my Zone',
            outro: 'Need help, or have questions? Just reply this email.'
        }
    }

    var emailBody = MailGenerator.generate(email);

    let message = {
        from: ENV.EMAIL,
        to: userEmail,
        subject: subject || "Signup Successfully!",
        html: emailBody,
    }

    // send Mail --------------

    transporter.sendMail(message)
        .then(() => {
            return res.status(201).send({ msg: "You should receive email from us." });
        }).catch(error => res.status(500).send({ error }));
};