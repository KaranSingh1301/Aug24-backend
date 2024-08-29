const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { userDataValidation } = require("../utils/authUtils");

const registerController = async (req, res) => {
  console.log(req.body);
  const { email, username, password, name } = req.body;

  try {
    await userDataValidation({ email, username, password, name });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Bad Request",
      error: error,
    });
  }

  //hashed password
  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.SALT)
  );

  const userObj = new User({ email, username, password: hashedPassword, name });

  try {
    const userDb = await userObj.registerUser();

    return res.send({
      status: 201,
      message: "Register successfull",
      data: userDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

const loginController = (req, res) => {
  console.log("login is working in controller");
  return res.send("login working in controller");
};

module.exports = { registerController, loginController };
