// server.js
require('dotenv').config();    // ← loads EMAIL_USER and EMAIL_PASS from .env

const express    = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));  // serves index.html, about.html, contact.html, etc.

// POST /submit-form
app.post('/submit-form', async (req, res) => {
  const { name, email, message } = req.body;

  // configure Gmail SMTP over SSL
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // email content
  let mailOptions = {
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to:   process.env.EMAIL_USER,
    subject: `New message from ${name}`,
    text:    `Name: ${name}\nEmail: ${email}\n\n${message}`,
    html:    `<p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p>${message}</p>`
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    res.status(200).send('Message sent successfully!');
  } catch (err) {
    console.error('SendMail Error:', err);
    res.status(500).send('Error occurred while sending email: ' + err.message);
  }
});

// start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
