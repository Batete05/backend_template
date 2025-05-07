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

    const user_token_object = user.get({ plain: true });
    delete user_token_object.password; // Remove password field for safety

    // Generate JWT
    const token = jwt.sign(user_token_object, process.env.JWT, {
      expiresIn: "1h",
    });

    return res.status(201).json({ message: "Successfully Logged", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
