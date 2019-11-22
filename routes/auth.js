const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function sign(user) {
  jwt.sign(
    {
      id: user._id
    },
    process.env.SECRET,
    (error, token) => {
      delete user._doc.password;

      if (error) return res.status(500).json({ error });
      res.status(200).json({ user, token });
    }
  );
}

//RUTA PARA SIGNUP // API REST
router.post("/signup", (req, res, next) => {
  const { password, username, email } = req.body; // deconstuction of password from req.body

  if (!password || !username || !email) {
    return res.status(500).json({
      errormsg: "Todos los campos deben llenarse"
    });
  }

  //verify password length
  if (password.length <= 7)
    return res.status(500).json({
      errormsg: "Tu password debe contener por lo menos 8 caracteres"
    });

  const salt = bcrypt.genSaltSync(10);
  const hashPass = bcrypt.hashSync(password, salt); //hashing the password to prepare it to save in DB

  User.create({ ...req.body, password: hashPass }) // create new user with all data from de req.body, and the hashpass
    .then(user => {
      jwt.sign({ id: user._id }, process.env.SECRET, (error, token) => {
        //generate a token
        delete user._doc.password; // delete de password from the document retrieved
        if (error) return res.status(500).json({ error });
        res.status(200).json({ user, token }); //response with the user signedup and a token
      });
    })
    .catch(error => {
      if (error.errmsg.includes("email"))
        //check mongoose error to find if error is because of email field
        res.status(404).json({
          errormsg: "El mail que intentas registrar ya ha sido tomado"
        });
      res.status(404).json({
        //mongoose error to find if error is because of username field
        errormsg: "El username que intentas registrar ya ha sido tomado"
      });
    });
});

//RUTA PARA LOGIN // API REST
router.post("/login", (req, res) => {
  const { password, usernameOrEmail } = req.body; //deconstruccion de password y usernameOrEmail data

  if ((!password, !usernameOrEmail)) {
    return res
      .status(500)
      .json({ errormsg: "Todos los campos deben llenarse" });
  }

  User.find({
    $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }] // find with or operator
  })
    .then(theUser => {
      const user = theUser[0]; //its suppose than this query retrieves always one result
      const isValid = bcrypt.compareSync(password, user.password); // true if hashPass and pass are the same
      if (!isValid) {
        res
          .status(401)
          .json({ errormsg: "La contraseña introducida es incorrecta" });
      }

      // sign(user);

      jwt.sign(
        {
          id: user._id
        },
        process.env.SECRET,
        (error, token) => {
          delete user._doc.password; // delete de password from the document retrieved

          if (error) return res.status(500).json({ error });
          res.status(200).json({ user, token }); //response with the user logged and a token
        }
      );
    })
    .catch(error => {
      res.status(404).json({ error, errormsg: "Username o email incorrecto" });
      // response if there is no document with match with given email or username
    });
});

module.exports = router;
