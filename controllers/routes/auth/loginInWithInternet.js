const router = require("express").Router();
const { User } = require("../../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validateOnLogin } = require("../../validators/userValidator");
require("dotenv").config();

router.post("/", async (req, res) => {
  try {
    const { error } = validateOnLogin(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const email_phone = req.body.email_phone.replace(/\s/g, "");
    const isNumeric = /^\d+$/.test(email_phone);
    let user;

    if (isNumeric) {
      user = await User.findOne({ where: { phone: parseInt(email_phone) } });
    } else {
      user = await User.findOne({ where: { email: email_phone } });
    }

    if (!user)
      return res
        .status(401)
        .json({ message: "Invalid Email/Phone or Password" });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res
        .status(401)
        .json({ message: "Invalid Email/Phone or Password" });

    await sendEmail(user.email, { type: "LOGIN_OTP", message: "" });

    return res.status(201).json({
      message:
        "Successfully Logged. We sent a verification code to your email.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/otp", async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      return res
        .status(400)
        .json({ message: "Email and verification code are required." });
    }

    // Sequelize: find user by email
    const existingUser = await User.findOne({ where: { email } });

    if (!existingUser) {
      return res.status(400).json({ message: "User not Found." });
    }

    // Validate the one-time code
    const { valid, message } = await validateOneTimeCode(
      email,
      verificationCode
    );

    if (!valid) {
      return res.status(400).json({ message });
    }

    // Convert Sequelize model instance to plain object
    const user_token_object = existingUser.get({ plain: true });
    delete user_token_object.password; // Remove password field for safety

    // Generate JWT
    const token = jwt.sign(user_token_object, process.env.JWT, {
      expiresIn: "1h",
    });

    return res.status(201).json({ message: "success", token });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
