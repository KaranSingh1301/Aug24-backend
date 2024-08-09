const express = require("express");

const app = express();

//api

app.get("/home", (req, res) => {
  console.log("hi from api");
  return res.send("Server is up and running.....");
});

//query

// api?key=val
app.get("/api", (req, res) => {
  console.log(req.query);
  //   console.log(req.query.key.split(","));
  return res.send("Query is working");
});

//param

app.get("/profile/:name", (req, res) => {
  console.log(req.params);
  return res.send("Params is working");
});

app.get("/profile/:id1/:id2", (req, res) => {
  console.log(req.params);
  return res.send("Params for two api is working");
});

app.listen(8000, () => {
  console.log("Server is running on PORT:8000");
});
