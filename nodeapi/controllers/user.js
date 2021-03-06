const _ = require("lodash");
const User = require("../models/user");
const formidable = require("formidable");

exports.userById = (req, res, next, id) => {
  User.findById(id)
    // populate followers and following users array
    .populate("following", "_id username")
    .populate("followers", "_id username")
    .exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User not found: ",
          err
        });
      }
      req.profile = user; // adds profile object in req with user info
      next();
    });
};

exports.hasAuthorzation = (req, res, next) => {
  const authorized =
    req.profile && req.auth && req.profile._id === req.auth._id;
  if (!authorized) {
    return res.status(403).json({
      error: "user is not authorized to perform this action."
    });
  }
};

exports.allUsers = (req, res) => {
  User.find((err, users) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }
    res.json(users);
  }).select("username name email updated created ");
};

exports.getUser = (req, res) => {
  req.profile.hasedPassword = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

exports.updateUser = (req, res, next) => {
  let user = req.profile;
  user = _.extend(user, req.body); //mutate current state to the state of the update entirely
  user.updated = Date.now();
  user.save(err => {
    if (err) {
      return res.status(400).json({
        error:
          "There was an error updating this profile. You are not authorized to perform this action."
      });
    }
    user.hasedPassword = undefined;
    user.salt = undefined;
    res.json({ user });
  });
};

// exports.updateUser = (req, res, next) => {
//   let form = new formidable.IncomingForm();
//   form.keepExtensions = true;
//   form.parse(req, (err, fields, files) => {
//     if (err) {
//       return res.status(400).json({
//         error: err
//       });
//     }
//     // save user
//     let user = req.profile;
//     user = _.extend(user, fields);
//     user.updated = Date.now();

//     if (files.photo) {
//       user.profilePhoto.data = fs.readFileSync(files.photo.path);
//       user.profilePhoto.contentType = files.photo.type;
//     }
//     user.save(err => {
//       if (err) {
//         return res.status(400).json({
//           error: err
//         });
//       }
//       user.hasedPassword = undefined;
//       user.salt = undefined;
//       res.json(user);
//     });
//   });
// };

exports.deleteUser = (req, res, next) => {
  let user = req.profile;
  user.remove((err, users) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }
    user.hasedPassword = undefined;
    user.salt = undefined;
    res.json({ message: "User deleted successfully." });
  });
};

//following / follow code
exports.addFollowing = (req, res, next) => {
  User.findByIdAndUpdate(
    req.body.userId,
    { $push: { following: req.body.followId } },
    (err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      next();
    }
  );
};

exports.addFollower = (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    { $push: { followers: req.body.userId } },
    { new: true }
  )
    .populate("following", "_id username")
    .populate("followers", "_id username")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      result.hashed_password = undefined;
      result.salt = undefined;
      res.json(result);
    });
};

// remove follow unfollow
exports.removeFollowing = (req, res, next) => {
  User.findByIdAndUpdate(
    req.body.userId,
    { $pull: { following: req.body.unfollowId } },
    (err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      next();
    }
  );
};

exports.removeFollower = (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    { $pull: { followers: req.body.userId } },
    { new: true }
  )
    .populate("following", "_id username")
    .populate("followers", "_id username")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      result.hashed_password = undefined;
      result.salt = undefined;
      res.json(result);
    });
};
