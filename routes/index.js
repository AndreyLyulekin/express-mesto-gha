const router = require("express").Router();
const usersRouter = require("./users");
const cardsRouter = require("./cards");
const signupRouter = require("./signup");
const signinRouter = require("./signin");
const auth = require("../middlewares/auth");

router.use("/signup", signupRouter);
router.use("/signin", signinRouter);
router.use(auth);
router.use("*", (req, res, next) => {
  next(new NotFoundError("Страница не найдена"));
});
router.use("/users", usersRouter);
router.use("/cards", cardsRouter);

module.exports = router;
