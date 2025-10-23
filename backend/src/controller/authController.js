import { generateToken, setTokenCookies, verifyToken } from '../lib/Token&Cookies.js';
import User from '../model/User.js';

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !user.comparePassword(password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const { accessToken, refreshToken } = generateToken({ userId: user._id });
        setTokenCookies(res, accessToken, refreshToken);
        res.json({ message: 'User Login SuccesFully.', userData: {
            _id: user._id,
            username: user.username,
            fullname: user.fullname,
            email: user.email
        } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const register = async (req, res) => {
    try {
        const { fullname, username, email, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        const newUser = new User({ fullname, username, email, password });
        await newUser.save();
        const { accessToken, refreshToken } = generateToken({ userId: newUser._id });
        setTokenCookies(res, accessToken, refreshToken);
        res.status(201).json({ message: 'User registered successfully', userData: {
            _id: newUser._id,
            username: newUser.username,
            fullname: newUser.fullname,
            email: newUser.email
        }});
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  try{
      if (!refreshToken) {
      return res.status(400).json({ message: "No refresh token provided" });
    }

  const decoded = verifyToken(refreshToken, 'refresh');

  if (!decoded) {
    return res.status(400).json({ message: "Invalid refresh token" });
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json({ message: "Logged out successfully" });
  }catch(error){
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error:", error  });
  }
}

export const refreshToken = (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }
        const payload = verifyToken(refreshToken, 'refresh');
        if (!payload) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
        const { accessToken: newaccessToken } = generateToken({ id: payload.id });
        setTokenCookies(res, newaccessToken, null);
        res.json({ accessToken: newaccessToken });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const me = async (req, res) => {
    try{
        const user = req.body;
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server Error'})
    }
}