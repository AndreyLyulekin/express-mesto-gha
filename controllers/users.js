const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch(() =>
      res
        .status(400)
        .send({
          message: "Пользователь не найден или переданы некорректные данные",
        })
    );
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() =>
      res.status(400).send({ message: "Переданы некорректные данные" })
    );
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
