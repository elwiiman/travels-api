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
    let newUserdata = { ...req.body };
    if (req.file) {
      const { secure_url: profilepic } = req.file;
      newUserdata = { ...newUserdata, profilepic };
      console.log("mewdata", newUserdata);
    }

    User.findByIdAndUpdate(user._id, { $set: { ...newUserdata } }, { new: true })
      .then(user => {
        delete user._doc.password;
        console.log(user);
        res.status(200).json({ user });
      })
      .catch(error => {
        res.status(500).json({ error });
      });
  }
);

module.exports = router;
