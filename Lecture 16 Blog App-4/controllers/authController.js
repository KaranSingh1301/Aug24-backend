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

const loginController = async (req, res) => {
  //loginId, password
  console.log(req.body);

  const { loginId, password } = req.body;

  if (!loginId || !password)
    return res.send({
      status: 400,
      message: "Missing user credentials",
    });

  try {
    const userDb = await User.findUserWithKey({ key: loginId });

    //compare the password
    const isMatched = await bcrypt.compare(password, userDb.password);

    if (!isMatched) {
      return res.send({
        status: 400,
        message: "Bad Request",
        error: "Incorrect password",
      });
    }

    //session

    req.session.isAuth = true;
    req.session.user = {
      userId: userDb._id,
      username: userDb.username,
      email: userDb.email,
    };

    return res.send({
      status: 200,
      message: "Login successfull",
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

const logoutController = (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res.send({
        status: 400,
        message: "Logout unnsuccessfull",
        error: err,
      });

    return res.send({
      status: 200,
      message: "Logout successfull",
    });
  });
};

module.exports = { registerController, loginController, logoutController };
