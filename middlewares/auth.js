const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/Unauthorized");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Необходима авторизация");
  }

  const token = authorization.replace("Bearer ", "");

  try {
    // Верификация токена
    const payload = jwt.verify(token, "super-secret-key");

    // Добавление пейлоуда в объект запроса
    req.user = payload;

    next();
  } catch (err) {
    throw new UnauthorizedError("Необходима авторизация");
  }
};
