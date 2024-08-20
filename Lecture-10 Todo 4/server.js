const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const mongodbSession = require("connect-mongodb-session")(session);

//file-imports
const userModel = require("./model/userModel");
const { userDataValidator, isEmailValidate } = require("./utils/authUtils");
const isAuth = require("./middleware/isAuth");
const todoDataValidation = require("./utils/todoUtils");
const todoModel = require("./model/todoModel");

//constants
const app = express();
const PORT = process.env.PORT;
const store = new mongodbSession({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

//db connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("mongodb connected successfully"))
  .catch((err) => console.log(err));

//middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    store: store,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.static("public"));

app.get("/", (req, res) => {
  return res.send("Server is running...");
});

app.get("/register", (req, res) => {
  return res.render("registerPage");
});

app.post("/register", async (req, res) => {
  console.log(req.body);
  const { name, email, username, password } = req.body;

  //data validation
  try {
    await userDataValidator({ name, email, username, password });
  } catch (error) {
    return res.status(400).json(error);
  }

  try {
    //check if email and username exist
    const userEmailEixst = await userModel.findOne({ email: email });
    if (userEmailEixst) {
      return res.status(400).json(`Email already exist : ${email}`);
    }

    const userUsernameEixst = await userModel.findOne({ username });
    if (userUsernameEixst) {
      return res.status(400).json(`Username already exist : ${username}`);
    }

    //hashed password
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT)
    );

    //creating an obj of userSchema
    const userObj = new userModel({
      name: name,
      username: username,
      email: email,
      password: hashedPassword,
    });

    const userDb = await userObj.save(); //store the data in DB

    // return res.status(201).json({
    //   message: "User created successfully",
    //   data: userDb,
    // });
    return res.redirect("/login");
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
});

app.get("/login", (req, res) => {
  return res.render("loginPage");
});

app.post("/login", async (req, res) => {
  console.log(req.body);

  const { loginId, password } = req.body;

  if (!loginId || !password)
    return res.status(400).json("Missing user credentials.");

  try {
    //find the user wth loginId
    let userDb = {};
    if (isEmailValidate({ key: loginId })) {
      userDb = await userModel.findOne({ email: loginId });
    } else {
      userDb = await userModel.findOne({ username: loginId });
    }

    //check is user exist
    if (!userDb)
      return res.status(400).json("User not found, please register first.");

    //comapre password
    const isMatched = await bcrypt.compare(password, userDb.password);

    console.log(isMatched);

    if (!isMatched) return res.status(400).json("Incorrect password");

    console.log(req.session);

    req.session.isAuth = true;
    req.session.user = {
      userId: userDb._id,
      username: userDb.username,
      email: userDb.email,
    };

    // return res.status(200).json("login successfull");
    return res.redirect("/dashboard");
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
});

app.get("/dashboard", isAuth, (req, res) => {
  console.log("hii");
  return res.render("dashboardPage");
});

app.post("/logout", isAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    // return res.status(200).json("logout successfull");
    return res.redirect("/login");
  });
});

app.post("/logout-out-from-all", isAuth, async (req, res) => {
  //user
  console.log(req.session);
  const username = req.session.user.username;

  //create session schema
  const sessionSchema = new mongoose.Schema({ _id: String }, { strict: false });

  //convert schema into model
  const sessionModel = mongoose.model("session", sessionSchema);

  //perform model.query

  try {
    const deleteDb = await sessionModel.deleteMany({
      "session.user.username": username,
    });

    console.log(deleteDb);

    return res.status(200).json({
      message: "Logout from all devices successfull",
      data: deleteDb,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
});

//Todo's API
app.post("/create-item", isAuth, async (req, res) => {
  console.log(req.body);
  const todo = req.body.todo;
  const username = req.session.user.username;

  //data validation
  try {
    await todoDataValidation({ todo });
  } catch (error) {
    return res.status(400).json(error);
  }
  //create an entry in DB

  const todoObj = new todoModel({ todo, username });

  try {
    const todoDb = await todoObj.save();

    return res.send({
      status: 201,
      message: "Todo created successfully",
      data: todoDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
});

app.get("/read-item", isAuth, async (req, res) => {
  const username = req.session.user.username;

  try {
    const todoDbList = await todoModel.find({ username });

    if (todoDbList.length === 0) {
      return res.send({
        status: 204,
        message: "No Todo found!!!",
      });
    }

    return res.send({
      status: 200,
      message: "Read success",
      data: todoDbList,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
});

app.post("/edit-item", isAuth, async (req, res) => {
  console.log(req.body);
  const { newData, todoId } = req.body;
  const username = req.session.user.username;

  if (!todoId)
    return res.send({
      status: 400,
      message: "Missing todoId",
    });

  //data validation
  try {
    await todoDataValidation({ todo: newData });
  } catch (error) {
    return res.send({
      status: 400,
      message: error,
    });
  }
  //find the todo from db with todoId

  try {
    const todoDb = await todoModel.findOne({ _id: todoId });
    if (!todoDb)
      return res.send({
        status: 400,
        message: `No todo present with this todoId : ${todoId}`,
      });

    //ownership check
    if (username !== todoDb.username) {
      return res.send({
        status: 403,
        message: "Not allow to edit the todo",
      });
    }

    //update the todo

    const todoUpdatedDb = await todoModel.findOneAndUpdate(
      { _id: todoId },
      { todo: newData },
      { new: true }
    );

    return res.send({
      status: 200,
      message: "Todo updated successfully",
      data: todoUpdatedDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
});

app.post("/delete-item", isAuth, async (req, res) => {
  const todoId = req.body.todoId;
  const username = req.session.user.username;

  if (!todoId)
    return res.send({
      status: 400,
      message: "Missing todoId",
    });

  try {
    const todoDb = await todoModel.findOne({ _id: todoId });

    if (!todoDb)
      return res.send({
        staatus: 400,
        message: `No todo found with todoId : ${todoId}`,
      });

    if (todoDb.username !== username) {
      return res.send({
        status: 403,
        message: "Not allow to delete the todo.",
      });
    }

    const todoDeletedDb = await todoModel.findOneAndDelete({ _id: todoId });

    return res.send({
      status: 200,
      message: "Todo deleted successfully",
      data: todoDeletedDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
});

app.listen(PORT, () => {
  console.log("Server is running at:");
  console.log(`http://localhost:${PORT}/`);
});
