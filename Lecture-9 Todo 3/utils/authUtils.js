const isEmailValidate = ({ key }) => {
  const isEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
      key
    );
  return isEmail;
};

const userDataValidator = ({ name, email, username, password }) => {
  return new Promise((resolve, reject) => {
    if (!name || !email || !username || !password) reject("Missing user data");

    if (typeof email !== "string") reject("Email is not a text");
    if (typeof username !== "string") reject("username is not a text");
    if (typeof password !== "string") reject("password is not a text");

    if (!isEmailValidate({ key: email })) reject("Email format is incorrect");

    resolve();
  });
};

module.exports = { userDataValidator, isEmailValidate };
