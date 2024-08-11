const express = require("express");
const mongoose = require("mongoose");

const userModel = require("./userSchema");

const app = express();
const MONGO_URI =
  "mongodb+srv://karan:12345@cluster0.22wn2.mongodb.net/augTestDb";

app.use(express.urlencoded({ extended: true })); //global middleware
app.use(express.json()); //JSON body parser

//db connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("mongodb connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  return res.send("Server is up and running....");
});

app.get("/get-form", (req, res) => {
  return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>User Form</h1>
    <form action='/create-user' method='POST'>
        <label for="name">Name:</label>
        <input type="text" id="name" name="name"><br>
        <label for="email">Email:</label>
        <input type="text" id="email" name="email"><br>
        <label for="password">Password:</label>
        <input type="text" id="password" name="password"><br>
        <button type='submit'>Submit</button>
    </form>
</body>
</html>`);
});

app.post("/create-user", async (req, res) => {
  console.log(req.body);

  const { name, email, password } = req.body;

  try {
    const userDb = await userModel.create({
      //schema : client
      name: name,
      email: email,
      password: password,
    });

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

app.listen(8000, () => {
  console.log("server is running on PORT:8000");
});
