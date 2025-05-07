const router = require("express").Router();
const { User } = require("../../../models/user"); // Sequelize User model
const { validateUser } = require("../../validators/userValidator"); // Joi validators
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../../../utils/mailer");
const { uploadToCloudinary } = require("../../../utils/cloudnaryUploader");
const { getRandomStringFromArray } = require("../../../utils/extractors");
require("dotenv").config();

router.post("/", async (req, res) => {
  try {
    // Validate user input
    const { error } = validateUser(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if email or phone already exists
    const existingUser = await User.findOne({
      where: { email: req.body.email },
    });

    const existingUserByPhone = await User.findOne({
      where: { phone: req.body.phone },
    });

    if (existingUser) {
      return res.status(400).json({ message: "That email is already in use." });
    }

    if (existingUserByPhone) {
      return res
        .status(400)
        .json({ message: "That phone number is already in use." });
    }


    const profiles = [
      "https://res.cloudinary.com/ddsojj7zo/image/upload/v1740845112/byose%20org%20site/dagubrrhscapupfkinth.jpg",
      "https://res.cloudinary.com/ddsojj7zo/image/upload/v1740845112/byose%20org%20site/jirbrme6xggrkkhxfcxv.jpg",
      "https://res.cloudinary.com/ddsojj7zo/image/upload/v1740845111/byose%20org%20site/ftwrjvtebci0ifdzuzii.jpg",
      "https://res.cloudinary.com/ddsojj7zo/image/upload/v1740845111/byose%20org%20site/ezcugunruqofoob1x53f.jpg",
      "https://res.cloudinary.com/ddsojj7zo/image/upload/v1740845111/byose%20org%20site/ijnsvnimzb6z6szgjn5k.jpg",
      "https://res.cloudinary.com/ddsojj7zo/image/upload/v1740845111/byose%20org%20site/tsukx2j96rntzoej0cuv.jpg",
      "https://res.cloudinary.com/ddsojj7zo/image/upload/v1740845111/byose%20org%20site/rpu01aussyxzfkm93nu3.jpg",
      "https://res.cloudinary.com/ddsojj7zo/image/upload/v1740845111/byose%20org%20site/t11rgc2pcgujxvq5qstm.jpg",
      "https://res.cloudinary.com/ddsojj7zo/image/upload/v1740845110/byose%20org%20site/exea7rofrhtsphx9on2f.jpg",
    ];

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create user
    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPassword,
      role: "NORMAL",
      image: getRandomStringFromArray(profiles), //uploadResult.url,
      isVerified: false,
    });

    const user_token_object = user.get({ plain: true });
    delete user_token_object.password; // Remove password field for safety

    // Generate JWT
    const token = jwt.sign(user_token_object, process.env.JWT, {
      expiresIn: "1h",
    });

    return res.status(200).json({ token, message: "Success." });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
