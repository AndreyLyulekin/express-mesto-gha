const jwt = require("jsonwebtoken");

module.exports.auth = (req, res, next) => {
  const token = req.headers.authorization;

  // Проверка наличия токена
  if (!token) {
    return res.status(401).send({ message: "Токен не предоставлен" });
  }

  try {
    // Верификация токена
    const payload = jwt.verify(token, "super-secret-key");

    // Добавление пейлоуда в объект запроса
    req.user = payload;

    next();
  } catch (err) {
    return res.status(401).send({ message: "Необходима авторизация" });
  }
};
