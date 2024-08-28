const registerController = (req, res) => {
  console.log("resgiter is working in controller");
  return res.send("resgiter from controller");
};

const loginController = (req, res) => {
  console.log("login is working in controller");
  return res.send("login working in controller");
};

module.exports = { registerController, loginController };
