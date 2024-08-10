const express = require("express");

//custom middleware
const fun = (req, res, next) => {
  console.log("hii 1");
  next();
};

const fun1 = (req, res, next) => {
  console.log("hii 2");
  next();
};

const app = express();

app.use(express.urlencoded({ extended: true })); //global middleware

// app.use(express.json());

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

app.post("/create-user", (req, res) => {
  console.log(req.body);
  return res.send("form submitted successfully");
});

app.get("/dashboard", fun, fun1, (req, res) => {
  console.log("hii 3");
  return res.send("Dasboard API is working");
});

app.listen(8000, () => {
  console.log("server is running on PORT:8000");
});
