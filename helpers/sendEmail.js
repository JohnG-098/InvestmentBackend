const nodemailer = require("nodemailer");

const sendEmail = async (recipientEmail, message) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "murimivincent26@gmail.com", // your email
        pass: "fndz rxgc vhqc vdmj", // your email app password
      },
    });

    // Email options
    const mailOptions = {
      from: `"COIN-BIT" <murimivincent26@gmail.com>`,
      to: recipientEmail || "recipientemail@gmail.com",
      subject: "Notification",
      text: message || "This is a test email",
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.response);
    return {
      success: true,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      message: "Failed to send email",
      error: error.message,
    };
  }
};

module.exports = sendEmail;
