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
import dotenv from 'dotenv';

dotenv.config();

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
   passport.authenticate("google", { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=google` }),
  (req, res) => {
    const { accessToken, refreshToken } = generateToken({ id: req.user._id });
    setTokenCookies(res, accessToken, refreshToken);
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  }
);

// GitHub login
router.get("/github", passport.authenticate("github", { scope: ["read:user", "user:email"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    console.log("✅ GitHub User:", req.user);  

    const { accessToken, refreshToken } = generateToken({ id: req.user._id });
    setTokenCookies(res, accessToken, refreshToken);
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  }
);


export default router;