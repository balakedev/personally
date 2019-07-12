const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const cors = require("cors");
const fs = require("fs");
const port = 8080;

//load env
const dotenv = require("dotenv");
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true
  })
  .then(() => console.log("db connected"));

mongoose.connection.on("error", err => {
  console.log(" CONNECTION ERROR MESSAGE " + err.message);
});

// mongoose.connect("mongodb://localhost:27017/Personally", function(err) {
//   if (err) {
//     return console.log("Mongoose - connection error:", err);
//   }
//   console.log("Connected to DB Successfully");
// });

//getting routes
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

//documentation route
// app.get("/", (req, res) => {
//   fs.readFile("docs/apiDocs.json", () => {

//     const docs = JSON.parse(data);

//     res.json(docs);
//   });
// });

//middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(expressValidator());

//routes
app.use("/", postRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);

//error

app.use(function(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).send("invalid token...");
  }
});

app.listen(8080);
console.log("listening to port: " + port);
