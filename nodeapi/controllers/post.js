const _ = require("lodash");
const Post = require("../models/post");
const formidable = require("formidable");
const fs = require("fs");

exports.postById = (req, res, next, id) => {
  Post.findById(id)
    .populate("postedBy", "_id username")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(400).json({
          error: err
        });
      }
      req.post = post;
      next();
    });
};

exports.getPosts = (req, res) => {
  var posts = Post.find()
    .populate("postedBy", "_id username")
    .select("_id text tags")
    .then(posts => {
      res.json({
        posts
      });
    })
    .catch(err => console.log(err));
};

exports.createPost = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        message: "Media files could not be uploaded"
      });
    }
    let post = new Post(fields);

    post.postedBy = req.profile;

    //ensure senstive data isnt sent back with response
    req.profile.hasedPassword = undefined;
    req.profile.salt = undefined;

    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = FileList.photo.type;
    }
    post.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      res.json(result);
    });
  });
};

exports.postsByUser = (req, res) => {
  Post.find({ postedBy: req.profile._id })
    .populate("postedBy", "_id username")
    .sort("_created")
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      res.json(posts);
    });
};

exports.isPoster = (req, res, next) => {
  let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;
  if (!isPoster) {
    return status(400).json({
      error: "user is not authorized."
    });
  }
  next();
};

exports.updatePost = (req, res, next) => {
  let post = req.post;
  post = _.extend(post, req.body); //mutate current state to the state of the update entirely
  post.updated = Date.now();
  post.save(err => {
    if (err) {
      return res.status(400).json({
        error:
          "There was an error updating this post. You are not authorized to perform this action."
      });
    }
    // user.hasedPassword = undefined;
    // user.salt = undefined;
    res.json({ post });
  });
};

exports.deletePost = (req, res) => {
  let post = req.post;
  post.remove((err, post) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }
    res.json({
      message: "Post deleted."
    });
  });
};
