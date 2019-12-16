const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const reservationSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    companions: {
      type: [String]
    },
    travel: {
      type: Schema.Types.ObjectId,
      ref: "Travel",
      required: true
    }
  },

  { timestamps: true }
);

module.exports = model("Reservation", reservationSchema);
