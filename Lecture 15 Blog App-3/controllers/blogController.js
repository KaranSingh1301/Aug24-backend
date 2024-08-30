const { createBlog } = require("../models/blogModel");
const { blogDataValidation } = require("../utils/blogUtils");

const createBlogController = async (req, res) => {
  console.log(req.session.user);
  const { title, textBody } = req.body;
  const userId = req.session.user.userId;

  try {
    await blogDataValidation({ title, textBody });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Bad request",
      error: error,
    });
  }

  try {
    const blogDb = await createBlog({ title, textBody, userId });

    return res.send({
      status: 201,
      message: "Blog created successfully",
      data: blogDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

module.exports = createBlogController;
