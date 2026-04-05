const nodemailer = require("nodemailer");

// ⚠️ HARD-CODED FOR TESTING ONLY
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

const sendOTPEmail = async (to, otp) => {
  try {
    // ✅ SendGrid SMTP transport
    const transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 465, // ← change this
      secure: true, // ← change this to true
      auth: {
        user: "apikey",
        pass: SENDGRID_API_KEY,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    // ✅ Send email
    const info = await transporter.sendMail({
      from: `"COINBIT-OTP" <reesechris315@gmail.com>`, // must be verified in SendGrid
      to,
      subject: "Your OTP Code",
      html: `
        <div style="
          font-family: Arial, sans-serif;
          text-align: center;
          background-color: #0b0b0b;
          padding: 50px 20px;
          color: #ffffff;
        ">

          <div style="
            max-width: 420px;
            margin: auto;
            background-color: #111111;
            border: 1px solid #d4af37;
            border-radius: 12px;
            padding: 30px;
          ">

            <h2 style="color: #d4af37;">Verify Your Email</h2>

            <p style="color: #ccc;">
              Use the OTP code below to complete your verification
            </p>

            <div style="
              border: 2px dashed #d4af37;
              padding: 20px;
              margin: 20px 0;
              border-radius: 10px;
            ">
              <h1 style="
                letter-spacing: 8px;
                color: #d4af37;
                font-size: 34px;
              ">
                ${otp}
              </h1>
            </div>

            <p style="color: #aaa; font-size: 13px;">
              This code expires in <b style="color:#d4af37;">5 minutes</b>.
            </p>

            <hr style="border-top: 1px solid #222;" />

            <p style="font-size: 11px; color: #666;">
              © COINBIT • Never share your OTP
            </p>

          </div>
        </div>
      `,
    });

    console.log("✅ OTP email sent:", info.messageId);
    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("❌ SendGrid error:", error);
    return {
      success: false,
      message: "Error sending OTP",
      error: error.message,
    };
  }
};

module.exports = sendOTPEmail;
