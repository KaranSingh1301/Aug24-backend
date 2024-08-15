const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const userDataValidator = require("./utils/authUtils");
const userModel = require("./model/userModel");

//constants
const app = express();
const PORT = process.env.PORT;

//db connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("mongodb connected successfully"))
  .catch((err) => console.log(err));

//middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  return res.send("Server is running...");
});

app.get("/register", (req, res) => {
  return res.render("registerPage");
});

app.post("/register", async (req, res) => {
  const { name, email, username, password } = req.body;

  //data validation
  try {
    await userDataValidator({ name, email, username, password });
  } catch (error) {
    return res.status(400).json(error);
  }

  //creating an obj of userSchema
  const userObj = new userModel({
    name: name,
    username: username,
    email: email,
    password: password,
  });

  try {
    const userDb = await userObj.save(); //store the data in DB

    return res.status(201).json({
      message: "User created successfully",
      data: userDb,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
});

app.get("/login", (req, res) => {
  return res.render("loginPage");
});

app.post("/login", (req, res) => {
  return res.send("login api is working");
});

app.listen(PORT, () => {
  console.log("Server is running at:");
  console.log(`http://localhost:${PORT}/`);
});
