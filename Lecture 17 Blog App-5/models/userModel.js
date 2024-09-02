const userSchema = require("../schemas/userSchema");
const { ObjectId } = require("mongodb");

const User = class {
  constructor({ email, username, password, name }) {
    this.email = email;
    this.username = username;
    this.name = name;
    this.password = password;
  }

  registerUser() {
    return new Promise(async (resolve, reject) => {
      try {
        //find the user with email or username
        const userExist = await userSchema.findOne({
          $or: [{ email: this.email }, { username: this.username }],
        });

        if (
          userExist &&
          userExist.email === this.email &&
          userExist.username === this.username
        )
          return reject("Email and Username already exist");

        if (userExist && userExist.email === this.email)
          return reject("Email already exist");
        if (userExist && userExist.username === this.username)
          return reject("Username already exist");

        //make unique entry in db
        const user = new userSchema({
          name: this.name,
          email: this.email,
          username: this.username,
          password: this.password,
        });

        const userDb = await user.save();
        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  static findUserWithKey({ key }) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!key) reject("Key is empty");

        const userDb = await userSchema
          .findOne({
            $or: [
              ObjectId.isValid(key) ? { _id: key } : { email: key },
              { username: key },
            ],
          })
          .select("+password");

        if (!userDb) reject("User not found, please register first");

        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }
};

module.exports = User;
