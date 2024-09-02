const express = require("express");
const {
  followUserController,
  unfollowUserController,
  getFollowingListController,
  getFollowerListController,
} = require("../controllers/followController");
const followRouter = express.Router();

followRouter
  .post("/follow-user", followUserController)
  .post("/unfollow-user", unfollowUserController)
  .get("/get-followingList", getFollowingListController)
  .get("/get-followerList", getFollowerListController);

module.exports = followRouter;
