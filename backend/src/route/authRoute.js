import Router from "express";
import passport from "../lib/passport.js";
import {
  login,
  logout,
  me,
  refreshToken,
  register,
} from "../controller/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { generateToken, setTokenCookies } from "../lib/Token&Cookies.js";

const router = Router();

// Local Auth
router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/me", authMiddleware, me);
router.post("/refresh-token", refreshToken);

// Google login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
   passport.authenticate("google", { session: false, failureRedirect: "http://localhost:5173/login?error=google" }),
  (req, res) => {
    const { accessToken, refreshToken } = generateToken({ id: req.user._id });
    setTokenCookies(res, accessToken, refreshToken);
    res.redirect("http://localhost:5173/dashboard");
  }
);

// GitHub login
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: "http://localhost:5173/login?error=google" }),
  (req, res) => {
    const { accessToken, refreshToken } = generateToken({ id: req.user._id });
    setTokenCookies(res, accessToken, refreshToken);
    res.redirect("http://localhost:5173/dashboard");
  }
);

export default router;