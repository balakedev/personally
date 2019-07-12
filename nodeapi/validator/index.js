exports.createPostValidator = (req, res, next) => {
  req.check("text", "Creating your post...").notEmpty();
  req
    .check("text", "title must be move than 1 character and 2000 characters.")
    .isLength({
      min: 4,
      max: 2000
    });

  req.check("tags", "chose some tags, from post.helpers").notEmpty();
  req
    .check("tags", "title must be move than 0 character and 150 characters.")
    .isLength({
      min: 0,
      max: 150
    });

  //const errors
  const errors = req.validationErrors();
  //if error shows the first on as they happen
  if (errors) {
    const firstError = errors.map(error => error.msg)[0];
    return res.status(400).json({
      error: firstError
    });
  }

  next();
};

exports.userSignupValidator = (req, res, next) => {
  req.check("name.firstName", "First name is required").notEmpty();

  req.check("name.lastName", "Last name is required").notEmpty();

  req
    .check("email", "email is required")
    .notEmpty()
    .matches(/.+@.+..+/)
    .withMessage("email must be a valid email address.")
    .isLength({
      min: 5,
      max: 100
    });

  req.check("password", "Last name is required").notEmpty();

  req
    .check("password")
    .isLength({
      min: 8,
      max: 20
    })
    .withMessage("Password must use at least 8 characters")
    .matches(/\d/)
    .withMessage("Password must contain at least 1 numerical character");

  req
    .check("username")
    .isLength({
      min: 3,
      max: 16
    })
    .withMessage(
      "username must use at least 3 characters, and no more than 16 characters"
    )
    .matches(/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/)
    .withMessage(
      "usernames must not contain numbers, or any special characters"
    );

  const errors = req.validationErrors();

  if (errors) {
    var firstError = errors.map(error => error.msg)[0];
    return res.status(400).json({
      error: firstError
    });
  }

  next();
};
