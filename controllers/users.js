const { default: validator } = require("validator");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Пользователь не найден" });
      }
      res.send({ data: user });
    })
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).send({ message: "Некорректный email" });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).send({ message: "Ошибка хэширования пароля" });
    }

    User.create({ name, about, avatar, email, password: hashedPassword })
      .then((user) => res.send({ data: user }))
      .catch(() =>
        res.status(400).send({ message: "Переданы некорректные данные" })
      );
  });
};

module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(req.params.id, {
    name: "Виктор Гусев",
    about: 30,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Пользователь не найден" });
      }
      res.send({ data: user });
    })
    .catch(() =>
      res.status(400).send({ message: "Переданы некорректные данные" })
    );
};

module.exports.updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(req.params.id, {
    avatar: "https://www.image.com",
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Пользователь не найден" });
      }
      res.send({ data: user });
    })
    .catch(() =>
      res.status(400).send({ message: "Переданы некорректные данные" })
    );
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).send({ message: "Некорректный email" });
  }
  // Поиск пользователя по email
  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .send({ message: "Неправильные почта или пароль" });
      }

      // Проверка пароля
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err || !isMatch) {
          return res
            .status(401)
            .send({ message: "Неправильные почта или пароль" });
        }

        // Создание JWT токена
        const token = jwt.sign({ _id: user._id }, "super-secret-key", {
          expiresIn: "7d",
        });

        // Отправка токена клиенту
        res
          .cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
          })
          .send({ message: "Успешный вход" });
      });
    })
    .catch(() =>
      res.status(401).send({ message: "Неправильные почта или пароль" })
    );
};
