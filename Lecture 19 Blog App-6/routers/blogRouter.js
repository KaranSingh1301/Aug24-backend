const express = require("express");
const {
  createBlogController,
  getBlogsController,
  getMyBlogsController,
  editBlogController,
  deleteBlogController,
} = require("../controllers/blogController");
const rateLimiting = require("../middlewares/rateLimiting");

const blogRouter = express.Router();

blogRouter
  .post("/create-blog", rateLimiting, createBlogController)
  .get("/get-blogs", getBlogsController)
  .get("/get-myblogs", getMyBlogsController)
  .post("/edit-blog", editBlogController)
  .post("/delete-blog", deleteBlogController);

module.exports = blogRouter;
