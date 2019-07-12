const mongoose = require("mongoose");
const uuidv1 = require("uuid/v1");
const crypto = require("crypto");
const { ObjectId } = mongoose.SchemaTypes;

const userSchema = new mongoose.Schema({
  name: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    }
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  birthday: Date,
  hasedPassword: {
    type: String,
    required: true
  },
  salt: String,
  created: {
    type: Date,
    default: Date.now
  },
  updated: Date,
  NSFW: Boolean,
  profilePhoto: {
    data: Buffer,
    contentType: String
  },
  headerPhoto: {
    data: Buffer,
    contentType: String
  },
  following: [{ _id: String, type: ObjectId, ref: "User" }],
  followers: [{ _id: String, type: ObjectId, ref: "User" }]
});

userSchema
  .virtual("password")
  .set(function(password) {
    //create temportary variable called _password
    this._password = password;
    // generate a timestamp for salt
    this.salt = uuidv1();
    // encryptPassword
    this.hasedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

//methods
userSchema.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hasedPassword;
  },

  encryptPassword: function(password) {
    if (!password) {
      return "";
    }
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      console.log("FROM USER MODEL:" + err);
    }
  }
};
module.exports = mongoose.model("User", userSchema);
