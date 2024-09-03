const cron = require("node-cron");
const blogSchema = require("./schemas/blogSchema");

const cleanUpBin = () => {
  cron.schedule("* * 0 * * *", async () => {
    console.log("cron is working");

    try {
      const blogsDb = await blogSchema.find({ isDeleted: true });

      if (blogsDb.length > 0) {
        let deletedBlogsId = [];
        //compute the deleted blogs > 30days
        blogsDb.map((blog) => {
          const diff =
            (Date.now() - blog.deletionDateTime) / (1000 * 60 * 60 * 24);
          if (diff > 30) {
            deletedBlogsId.push(blog._id);
          }
        });

        //delete the blogs permentantly
        if (deletedBlogsId.length > 0) {
          const deletedDb = await blogSchema.findOneAndDelete({
            _id: { $in: deletedBlogsId },
          });
          console.log(`Blog has been deleted successfully: ${deletedDb._id}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = cleanUpBin;
