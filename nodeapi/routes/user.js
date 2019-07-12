const express = require("express");

const {
  userById,
  allUsers,
  getUser,
  updateUser,
  deleteUser,
  addFollowing,
  addFollower,
  removeFollower,
  removeFollowing
} = require("../controllers/user");

const { requireSignin } = require("../controllers/auth");

const router = express.Router();

router.get("/users", allUsers);
router.get("/user/:userId", getUser);
router.put("/user/:userId", requireSignin, updateUser);
router.delete("/user/:userId", requireSignin, deleteUser);

// any routes containing :userID, our app will first execute userById()
router.param("userId", userById);

//following
router.put("/user/follow", requireSignin, addFollowing, addFollower);

router.put("/user/unfollow", requireSignin, removeFollowing, removeFollower);

module.exports = router;
