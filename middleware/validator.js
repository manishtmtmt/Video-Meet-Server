const validator = require("validator");

function validateSignUp(req, res, next) {
  const { username, email, password, userType } = req.body;

  // Validation for username
  if (
    !username ||
    typeof username !== "string" ||
    validator.isEmpty(username)
  ) {
    return res.status(400).json({
      success: false,
      error: "Username is required and must be a non-empty string",
    });
  }

  // Validation for email
  if (!email || !validator.isEmail(email) || validator.isEmpty(email)) {
    return res.status(400).json({
      success: false,
      error: "Email is required and must be a valid email address",
    });
  }

  // Validation for password
  if (
    !password ||
    typeof password !== "string" ||
    password.length < 8 || // At least 8 characters long
    !/[A-Z]/.test(password) || // At least one uppercase letter
    !/[a-z]/.test(password) || // At least one lowercase letter
    !/\d/.test(password) || // At least one digit
    !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) // At least one special character
  ) {
    return res.status(400).json({
      success: false,
      error:
        "Password is required and must be at least 8 characters long with at least one uppercase letter, one lowercase letter, one digit, and one special character",
    });
  }

  // Validation for userType
  if (!userType || (userType !== "teacher" && userType !== "student")) {
    return res.status(400).json({
      success: false,
      error: "UserType is required and must be either 'teacher' or 'student'",
    });
  }

  next();
}

function validateLogin(req, res, next) {
  const { email, password, userType } = req.body;

  // Validation for email
  if (!email || !validator.isEmail(email) || validator.isEmpty(email)) {
    return res.status(400).json({
      success: false,
      error: "Email is required and must be a valid email address",
    });
  }

  // Validation for password
  if (
    !password ||
    typeof password !== "string" ||
    password.length < 8 || // At least 8 characters long
    !/[A-Z]/.test(password) || // At least one uppercase letter
    !/[a-z]/.test(password) || // At least one lowercase letter
    !/\d/.test(password) || // At least one digit
    !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) // At least one special character
  ) {
    return res.status(400).json({
      success: false,
      error:
        "Password is required and must be at least 8 characters long with at least one uppercase letter, one lowercase letter, one digit, and one special character",
    });
  }

  // Validation for userType
  if (!userType || (userType !== "teacher" && userType !== "student")) {
    return res.status(400).json({
      success: false,
      error: "UserType is required and must be either 'teacher' or 'student'",
    });
  }

  next();
}

module.exports = { validateSignUp, validateLogin };
