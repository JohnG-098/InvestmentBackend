const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./helpers/db");
const cookieParser = require("cookie-parser");
dotenv.config();
const cors = require("cors");

const app = express();

connectDB();
app.use(express.json());

app.use(cors({
    origin: "https://investment-web-black.vercel.app", //https://investment-web-black.vercel.app/ //http://localhost:5173
    credentials: true
}));

app.use(cookieParser());


app.use("/api/user", require("./routes/userRoutes"));

app.get("/api", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

//app.get("/users", allUsers);


const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
