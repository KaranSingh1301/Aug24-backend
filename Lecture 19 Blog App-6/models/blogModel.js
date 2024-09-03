const { LIMIT } = require("../privateConstants");
const blogSchema = require("../schemas/blogSchema");
const ObjectId = require("mongodb").ObjectId;

const createBlog = ({ title, textBody, userId }) => {
  return new Promise(async (resolve, reject) => {
    const blogObj = new blogSchema({
      title,
      textBody,
      userId,
      creationDateTime: Date.now(),
    });

    try {
      const blogDb = await blogObj.save();
      resolve(blogDb);
    } catch (error) {
      reject(error);
    }
  });
};

const getBlogs = ({ SKIP, followingUserIds }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blogsDb = await blogSchema.aggregate([
        // skip, limit, sort
        {
          $match: {
            userId: { $in: followingUserIds },
            isDeleted: { $ne: true },
          },
        },
        { $sort: { creationDateTime: -1 } }, //-1 DESC
        { $skip: SKIP },
        { $limit: LIMIT },
      ]);
      resolve(blogsDb);
    } catch (error) {
      reject(error);
    }
  });
};

const getMyBlogs = ({ SKIP, userId }) => {
  return new Promise(async (resolve, reject) => {
    //skip, limit, match, sort
    try {
      const myBlogsDb = await blogSchema.aggregate([
        { $match: { userId: userId, isDeleted: { $ne: true } } },
        { $sort: { creationDateTime: -1 } },
        { $skip: SKIP },
        { $limit: LIMIT },
      ]);

      resolve(myBlogsDb);
    } catch (error) {
      reject(error);
    }
  });
};

const getBlogWithId = ({ blogId }) => {
  return new Promise(async (resolve, reject) => {
    if (!blogId) return reject("Missing BlogId");
    if (!ObjectId.isValid(blogId)) return reject("Incorrect ObjectId format");

    try {
      const blogDb = await blogSchema.findOne({ _id: blogId });

      if (!blogDb) reject(`blog not found with BlogId : ${blogId}`);

      resolve(blogDb);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const editBlogWithId = ({ blogId, title, textBody }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blogDb = await blogSchema.findOneAndUpdate(
        { _id: blogId },
        { title: title, textBody: textBody },
        { new: true }
      );
      resolve(blogDb);
    } catch (error) {
      reject(error);
    }
  });
};

const deleteBlogWithId = ({ blogId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const blogDb = await blogSchema.findOneAndDelete({ _id: blogId });
      const blogDb = await blogSchema.findOneAndUpdate(
        { _id: blogId },
        { isDeleted: true, deletionDateTime: Date.now() }
      );
      resolve(blogDb);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createBlog,
  getBlogs,
  getMyBlogs,
  getBlogWithId,
  editBlogWithId,
  deleteBlogWithId,
};
