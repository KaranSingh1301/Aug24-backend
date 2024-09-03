const {
  followUser,
  unfollowUser,
  getFollowingUserList,
  getFollowerUserList,
} = require("../models/followModel");
const User = require("../models/userModel");

const followUserController = async (req, res) => {
  const followerUserId = req.session.user.userId;
  const followingUserId = req.body.followingUserId;

  try {
    await User.findUserWithKey({ key: followerUserId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Bad request for follower user id",
      error: error,
    });
  }

  try {
    await User.findUserWithKey({ key: followingUserId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Bad request for following user Id",
      error: error,
    });
  }

  try {
    const followDb = await followUser({ followerUserId, followingUserId });
    return res.send({
      status: 200,
      message: "Follow successfull",
      data: followDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

const unfollowUserController = async (req, res) => {
  const followerUserId = req.session.user.userId;
  const followingUserId = req.body.followingUserId;

  try {
    const unfollowDb = await unfollowUser({ followerUserId, followingUserId });

    return res.send({
      status: 200,
      message: "Unfollow successfull",
      data: unfollowDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

const getFollowingListController = async (req, res) => {
  const SKIP = Number(req.query.skip) || 0;
  const followerUserId = req.session.user.userId;

  try {
    const followingListDb = await getFollowingUserList({
      SKIP,
      followerUserId,
    });

    if (followingListDb.length === 0) {
      return res.send({
        status: 204,
        message: "No following users found",
      });
    }

    return res.send({
      status: 200,
      message: "read success",
      data: followingListDb,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

const getFollowerListController = async (req, res) => {
  const SKIP = Number(req.query.skip) || 0;
  const followingUserId = req.session.user.userId;

  try {
    const followerListDb = await getFollowerUserList({
      SKIP,
      followingUserId,
    });

    if (followerListDb.length === 0) {
      return res.send({
        status: 204,
        message: "No following users found",
      });
    }

    return res.send({
      status: 200,
      message: "read success",
      data: followerListDb,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

module.exports = {
  followUserController,
  unfollowUserController,
  getFollowingListController,
  getFollowerListController,
};

//test ---> test1
//test ---> test2
//test ---> test3
//test ---> test4
//test ---> test5

//test1-->test
//test2-->test
