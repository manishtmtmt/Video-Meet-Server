const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const NodeCache = require("node-cache");

const UserModel = require("../models/User");
const { validateSignUp, validateLogin } = require("../middleware/validator");

const router = Router();
const myCache = new NodeCache();

router.post("/signup", validateSignUp, async (req, res) => {
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

router.post("/login", validateLogin, async (req, res) => {
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

    const userId = user._id;
    const cachedUserId = myCache.get(userId.toString());
    console.log("🚀 ~ authRouter.post ~ cachedUserId:", cachedUserId);
    if (!cachedUserId) {
      myCache.set(userId.toString(), userId.toString());
    }

    return res.status(200).json({
      success: true,
      message: "login successful",
      userId,
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

router.post("/combiner", async (req, res) => {
  try {
    console.log("req.body combiner api-->", req.body);
    const { roomId, uuid, python_id } = req.body;
    const roomParticipants = myCache.get(roomId);
    console.log("roomParticipants: -->", roomParticipants);
    if (!roomParticipants && roomParticipants.length === 0) {
      throw new Error();
    }
    const participant = roomParticipants.filter(
      (participant) => participant.uuid === uuid
    );
    const listWithoutParticipant = roomParticipants.filter(
      (participant) => participant.uuid !== uuid
    );
    if (participant.length === 0) {
      throw new Error();
    }
    _p_ = participant[0];
    _p_.pySid = python_id;
    listWithoutParticipant.push(_p_);
    myCache.set(roomId, listWithoutParticipant);
    console.log(listWithoutParticipant);
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(400).send();
  }
});

module.exports = { router, myCache };
