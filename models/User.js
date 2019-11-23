const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true
    },

    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    profilepic: {
      type: String,
      default:
        "https://res.cloudinary.com/elwiiman/image/upload/v1574541695/MexicoParaTodos/user_g9flse.png"
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    }
  },

  { timestamps: true }
);

module.exports = model("User", userSchema);
