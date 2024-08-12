const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoDbSession = require("connect-mongodb-session")(session);

//file-imports
const userModel = require("./userSchema");
const isAuth = require("./isAuthMiddleware");

//contants
const app = express();
const MONGO_URI =
  "mongodb+srv://karan:12345@cluster0.22wn2.mongodb.net/augTestDb";

const store = new mongoDbSession({
  uri: MONGO_URI,
  collection: "sessions",
});

//middlewares
app.use(express.urlencoded({ extended: true })); //global middleware
app.use(express.json()); //JSON body parser

app.use(
  session({
    secret: "This is aug backend module",
    store: store,
    resave: false,
    saveUninitialized: false,
  })
);

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

//register
app.get("/register-form", (req, res) => {
  return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Register Form</h1>
    <form action='/register-user' method='POST'>
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

app.post("/register-user", async (req, res) => {
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

//login
app.get("/login-form", (req, res) => {
  return res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <h1>Login Form</h1>
        <form action='/login-form' method='POST'>
            <label for="email">Email:</label>
            <input type="text" id="email" name="email"><br>
            <label for="password">Password:</label>
            <input type="text" id="password" name="password"><br>
            <button type='submit'>Submit</button>
        </form>
    </body>
    </html>`);
});

app.post("/login-form", async (req, res) => {
  console.log(req.body);

  try {
    const userDb = await userModel.findOne({ email: req.body.email });

    //if user not found
    if (!userDb) {
      return res.status(400).json("User not found, please register first.");
    }
    //compare the password
    if (userDb.password !== req.body.password) {
      return res.status(400).json("Incorrect password");
    }

    //session
    console.log(req.session);
    req.session.isAuth = true;

    return res.status(200).json("Login successfull");
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
});

app.get("/dashboard", isAuth, (req, res) => {
  return res.send("Dasboard Page!!!!!!");
});

app.listen(8000, () => {
  console.log("server is running on PORT:8000");
});
