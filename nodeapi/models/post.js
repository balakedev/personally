const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema({
  text: {
    type: String,
    required: "content is required to make a post.",
    minLength: 4,
    maxlength: 2000
  },
  tags: {
    type: String
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  postedBy: {
    type: ObjectId,
    ref: "User"
  },
  create: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Post", postSchema);
