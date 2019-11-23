const express = require("express");
const router = express.Router();
const uploader = require("../helpers/multer");
const User = require("../models/User");
const { verifyToken } = require("../helpers/auth-helper");

router.patch(
  "/edit",
  verifyToken,
  uploader.single("profilepic"),
  (req, res) => {
    const { user } = req;

    User.findByIdAndUpdate(user._id, { $set: { ...req.body } }, { new: true })
      .then(user => {
        console.log(user);
        delete user._doc.password;
        res.status(200).json({ user });
      })
      .catch(error => {
        res.status(500).json({ error });
      });
  }
);

module.exports = router;
