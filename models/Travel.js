const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const travelSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    transport: {
      type: {
        type: String,
        enum: ["autobus", "van"],
        default: "van",
        required: true
      },
      aviableSeats: {
        type: Number,
        minlength: 8,
        maxlength: 48,
        required: true
      }
    },
    photos: {
      type: [String],
      minlength: 1,
      maxlength: 6,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    route: {
      type: [String],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = model("Travel", travelSchema);
