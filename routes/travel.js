const express = require("express");
const router = express.Router();
const uploader = require("../helpers/multer");
const Travel = require("../models/Travel");
const { verifyToken } = require("../helpers/auth-helper");

router.post("/", verifyToken, uploader.array("photos"), (req, res) => {
  const { files } = req;
  const photos = files.map(file => file.secure_url);
  Travel.create({ ...req.body, photos })
    .then(travel => {
      res.status(200).json({ travel });
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

router.get("/", verifyToken, (req, res) => {
  Travel.find()
    .then(travels => {
      res.status(200).json({ travels });
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

router.get("/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  Travel.findById(id, "-createdAt -updatedAt -currency")
    .then(travel => {
      res.status(200).json({ travel });
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

//TODO
router.patch("/:id", verifyToken, uploader.array("photos"), (req, res) => {
  let updateData = {};
  if (req.files.length > 0) {
    const { files } = req;
    const photos = files.map(file => file.secure_url);
    updateData = { ...req.body, photos };
  } else {
    updateData = { ...req.body };
  }

  console.log(updateData);

  const { id } = req.params;

  Travel.findByIdAndUpdate(id, { $set: { ...updateData } }, { new: true })
    .then(travel => {
      res.status(200).json({ travel });
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

router.delete("/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  Travel.findByIdAndDelete(id)
    .then(travel => {
      res.status(200).json({ travel });
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

module.exports = router;
