const {
  createBlog,
  getBlogs,
  getMyBlogs,
  getBlogWithId,
  editBlogWithId,
  deleteBlogWithId,
} = require("../models/blogModel");
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

// /blogs/get-blogs?skip=10
const getBlogsController = async (req, res) => {
  const SKIP = Number(req.query.skip) || 0;

  try {
    const blogsDb = await getBlogs({ SKIP });

    if (blogsDb.length === 0) {
      return res.send({
        status: 204,
        message: SKIP === 0 ? "No Blogs found" : "No more blogs found",
      });
    }

    return res.send({
      status: 200,
      message: "Read success",
      data: blogsDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

const getMyBlogsController = async (req, res) => {
  const SKIP = Number(req.query.skip) || 0;
  const userId = req.session.user.userId;

  try {
    const myBlogsDb = await getMyBlogs({ SKIP, userId });

    if (myBlogsDb.length === 0) {
      return res.send({
        status: 204,
        message: SKIP === 0 ? "No Blogs found" : "No more blogs found",
      });
    }

    return res.send({
      status: 200,
      message: "Read success",
      data: myBlogsDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

const editBlogController = async (req, res) => {
  const { title, textBody, blogId } = req.body;
  const userId = req.session.user.userId;

  //data validation
  try {
    await blogDataValidation({ title, textBody });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Invalid Data",
      error: error,
    });
  }

  try {
    //find the blog
    const blogDb = await getBlogWithId({ blogId });

    //ownership check

    // console.log(userId.toString() === blogDb.userId.toString());
    if (!userId.equals(blogDb.userId)) {
      return res.send({
        status: 403,
        message: "Not allow to edit the blog",
      });
    }

    const diff = (Date.now() - blogDb.creationDateTime) / (1000 * 60);

    if (diff > 30) {
      return res.send({
        status: 400,
        message: "Not allow to edit the blog after 30 mins of creation.",
      });
    }

    const blogDbUpdated = await editBlogWithId({ title, textBody, blogId });

    return res.send({
      status: 200,
      message: "Blog Updated successfully",
      data: blogDbUpdated,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal Server error",
      error: error,
    });
  }
};

const deleteBlogController = async (req, res) => {
  const { blogId } = req.body;
  const userId = req.session.user.userId;

  try {
    const blogDb = await getBlogWithId({ blogId });

    if (!blogDb.userId.equals(userId)) {
      return res.send({
        status: 403,
        message: "not allow to delete the blog",
      });
    }

    const blogDeletedDb = await deleteBlogWithId({ blogId });

    return res.send({
      status: 200,
      message: "Blog deleted successfully",
      data: blogDeletedDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

module.exports = {
  createBlogController,
  getBlogsController,
  getMyBlogsController,
  editBlogController,
  deleteBlogController,
};
