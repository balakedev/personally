const jwt = require("jsonwebtoken")
const expressJwt = require("express-jwt")
require("dotenv").config()
const User = require("../models/user");

exports.signup = async (req, res) => {
    const userExistsEmail = await User.findOne({
        email: req.body.email
    });
    const userExistsUsername = await User.findOne({
        email: req.body.username
    });
    if (userExistsEmail || userExistsUsername) {
        return res.status(403).json({
            error: "email or username is already in use!"
        });
    }

    const user = await new User(req.body);
    await user.save();
    console.log("saving user")

    res.status(200).json({
        message: "Signup success! Please login."
    });

};

exports.signin = (req, res) => {
    //find user based on email
    const {
        id,
        email,
        password
    } = req.body

    User.findOne({
        email
    }, (err, user) => {
        //if no user or err
        if (err || !user) {
            return res.status(401).json({
                error: "User with that email does not exist."
            })
        }
        //if user is found, make sure the email and password match

        //create authenticating method in modeal and user here.
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email or password is incorrect."
            })
        }
        //generate token with user ID and secret
        const token = jwt.sign({
            _id: user._id
        }, process.env.JWT_SECRET);
        //persist the token as 't' in cooking with expiry date
        res.cookie("t", token, {
            expire: new Date() + 10000
        })
        //return response with user and token to front end
        var {
            _id,
            name: {
                firstName,
                lastName
            },
            email,
            username
        } = user
        return res.json({
            token,
            user: {
                _id,
                email,
                name: {
                    firstName,
                    lastName
                },
                username
            }
        });

    })
}


exports.signout = (req, res) => {
    //clear cookie, makes the old token invalid
    res.clearCookie("t")

    return res.status(200).json({
        message: "Signed out sucessfully."
    })
};

exports.requireSignin = expressJwt({
    //if token is valid, express jwt appends the verified users id
    //in an auth key to the request object
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});