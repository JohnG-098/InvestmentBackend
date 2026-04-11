const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./helpers/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("./scheduler/investmentScheduler");

dotenv.config();

const app = express();

connectDB();

// ✅ VERY IMPORTANT FOR VERCEL
app.set("trust proxy", 1);

app.use(express.json());

// ✅ CORS CONFIG (EXACT FRONTEND URL) // https://investment-web-black.vercel.app
app.use(
  cors({
    origin: "https://investment-web-black.vercel.app", // http://localhost:5173
    credentials: true,
  })
);

app.use(cookieParser());

// ROUTES
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.get("/api", (req, res) => {
  res.json({ message: "Hello from backend" });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});