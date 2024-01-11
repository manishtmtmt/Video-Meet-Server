const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/User");
const { validateSignUp, validateLogin } = require("../middleware/validator");

const authRouter = Router();

authRouter.post("/signup", validateSignUp, async (req, res) => {
  try {
    const { username, email, password, userType } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    await UserModel.create({
      username,
      email,
      password: hashPassword,
      userType,
    });

    return res
      .status(200)
      .json({ success: true, message: "User successfully registered!" });
  } catch (error) {
    console.log("signup request failed due to:", error);
    if (error.code && error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "email already registered" });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

authRouter.post("/login", validateLogin, async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword)
      return res
        .status(404)
        .json({ success: false, message: "Invalid Credentials" });

    if (userType !== user.userType) {
      return res
        .status(404)
        .json({ success: false, message: "User type is different." });
    }

    const token = jwt.sign(
      { username: user.username, userType },
      "secret-key",
      {
        expiresIn: "24h",
      }
    );

    return res
      .status(200)
      .json({
        success: true,
        message: "login successful",
        token,
        userType,
        username: user.username,
      });
  } catch (error) {
    console.log("login request failed due to:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = authRouter;
