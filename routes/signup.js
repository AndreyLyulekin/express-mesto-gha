const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { addUser } = require("../controllers/users");
const urlValidation =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

router.post(
  "/",
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().min(2).max(30),
        about: Joi.string().min(2).max(30),
        avatar: Joi.string().pattern(urlValidation),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(2),
      })
      .unknown(true),
  }),
  addUser
);

module.exports = router;
