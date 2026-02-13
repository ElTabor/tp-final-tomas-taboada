const jwt = require("jsonwebtoken");

const express = require("express");
const router = express.Router();

const { register, login, logout } = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const { registerSchema, loginSchema } = require("../validators/auth.schema");
const authMiddleware = require("../middlewares/auth.middleware");
const { loginLimiter } = require("../middlewares/rateLimit.middleware");



router.post("/register", validate(registerSchema), register);
router.post("/login", loginLimiter, validate(loginSchema), login);


router.post("/refresh", (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
});
router.post("/logout", authMiddleware, logout);



module.exports = router;
