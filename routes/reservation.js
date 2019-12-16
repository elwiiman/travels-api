const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const { verifyToken } = require("../helpers/auth-helper");

router.post("/", verifyToken, (req, res) => {
  console.log(req.body);
  Reservation.create({ ...req.body })
    .then(reservation => {
      res.status(200).json({ reservation });
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

module.exports = router;
