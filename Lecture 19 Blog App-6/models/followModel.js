const followSchema = require("../schemas/followSchema");
const { LIMIT } = require("../privateConstants");
const userSchema = require("../schemas/userSchema");

const followUser = ({ followerUserId, followingUserId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      //check if already following
      const followExist = await followSchema.findOne({
        followerUserId,
        followingUserId,
      });
      if (followExist) {
        return reject("Already following the user");
      }

      const followObj = new followSchema({
        followerUserId,
        followingUserId,
        creationDateTime: Date.now(),
      });
      const followDb = await followObj.save();
      resolve(followDb);
    } catch (error) {
      reject(error);
    }
  });
};

const unfollowUser = ({ followerUserId, followingUserId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const followDb = await followSchema.findOneAndDelete({
        followingUserId,
        followerUserId,
      });
      resolve(followDb);
    } catch (error) {
      reject(error);
    }
  });
};

const getFollowingUserList = ({ SKIP, followerUserId }) => {
  return new Promise(async (resolve, reject) => {
    //match, sort, skip, limit

    try {
      //   const followingListDb = await followSchema
      //     .find({ followerUserId: followerUserId })
      //     .populate("followingUserId")

      const followingListDb = await followSchema.aggregate([
        { $match: { followerUserId: followerUserId } },
        { $sort: { creationDateTime: -1 } },
        { $skip: SKIP },
        { $limit: LIMIT },
      ]);

      const followingUserIdsList = followingListDb.map(
        (follow) => follow.followingUserId
      );

      const userDetailsDb = await userSchema.find({
        _id: { $in: followingUserIdsList },
      });

      //   console.log(followingListDb);
      //   console.log(followingUserIdsList);
      //   console.log(userDetailsDb);

      resolve(userDetailsDb.reverse());
    } catch (error) {
      reject(error);
    }
  });
};

const getFollowerUserList = ({ SKIP, followingUserId }) => {
  return new Promise(async (resolve, reject) => {
    //match, sort, skip, limit

    try {
      const followerListDb = await followSchema.aggregate([
        { $match: { followingUserId: followingUserId } },
        { $sort: { creationDateTime: -1 } },
        { $skip: SKIP },
        { $limit: LIMIT },
      ]);

      const followerUserIdsList = followerListDb.map(
        (follow) => follow.followerUserId
      );

      const userDetailsDb = await userSchema.find({
        _id: { $in: followerUserIdsList },
      });

      resolve(userDetailsDb.reverse());
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowingUserList,
  getFollowerUserList,
};
