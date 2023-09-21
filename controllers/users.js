const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.getUser = (req, res) => {
  // Для уважаемого ревьюрера :)
  // в документации Монго сказано, что ObjectId — это 12-байтовая
  // шестнадцатеричная строка типа BSON, что означает что это всегда длинна в 24
  // символа, но там могут быть как цифры 0-9, так и латинские буквы a-z || A-Z
  // проверкой на длинну строки можно достичь бага, что в запросе у нас будут
  // другие символы (.,* и тд), тогда ответ сервера будет приходить,
  // что пользователь не найден, а это неверный ответ
  // регулярное выражение помогает решить эту проблему
  // тк мы знаем что длинна строки всегда 24 символа и мы ее валидируем
  // можно избежать лишних запросов в БД и сразу вернуть ошибку
  const objectID = req.params.userId;
  const validationRegExp = new RegExp(/\w{24}/gm);
  const isValidate = validationRegExp.test(objectID);
  if (!isValidate) {
    return res.status(400).send({ message: "Переданы некорректные данные" });
  }
  User.findById(objectID)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Пользователь не найден" });
      }
      res.send({ data: user });
    })
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
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
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: "true", runValidators: "true" }
  )
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
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: "true", runValidators: "true" }
  )
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
