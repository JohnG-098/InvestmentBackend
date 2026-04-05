const nodemailer = require("nodemailer");

const sendOTPEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "murimivincent26@gmail.com",
      pass: process.env.EMAIL_PASS || "fndz rxgc vhqc vdmj",
    },
  });

  await transporter.sendMail({
    from: `"COINBIT-OTP" <${process.env.EMAIL_USER || "murimivincent26@gmail.com"}>`,
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

        <!-- Card -->
        <div style="
          max-width: 420px;
          margin: auto;
          background-color: #111111;
          border: 1px solid #d4af37;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.15);
        ">

          <!-- Title -->
          <h2 style="
            color: #d4af37;
            margin-bottom: 10px;
            font-size: 22px;
          ">
            Verify Your Email
          </h2>

          <p style="
            color: #cccccc;
            font-size: 14px;
            margin-bottom: 25px;
          ">
            Use the OTP code below to complete your verification
          </p>

          <!-- OTP Box -->
          <div style="
            border: 2px dashed #d4af37;
            padding: 20px;
            margin: 20px 0;
            border-radius: 10px;
            background-color: #0b0b0b;
          ">
            <h1 style="
              letter-spacing: 8px;
              color: #d4af37;
              font-size: 34px;
              margin: 0;
            ">
              ${otp}
            </h1>
          </div>

          <!-- Warning -->
          <p style="
            color: #aaaaaa;
            font-size: 13px;
            margin-top: 15px;
          ">
            This code expires in <b style="color:#d4af37;">5 minutes</b>.
          </p>

          <!-- Footer -->
          <hr style="
            border: none;
            border-top: 1px solid #222;
            margin: 25px 0;
          " />

          <p style="
            font-size: 11px;
            color: #666;
          ">
            © COINBIT Security Team • Never share your OTP
          </p>

        </div>
      </div>
    `,
  });

  console.log("OTP email sent to:", to);
};

module.exports = sendOTPEmail;