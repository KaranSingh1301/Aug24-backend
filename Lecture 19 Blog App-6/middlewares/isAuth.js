const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    return res.send({
      status: 401,
      message: "Bad request",
      error: "Session expired, please login again",
    });
  }
};

module.exports = isAuth;
