import { mailOptions, transporter } from '../lib/nodemailer.js';
import { generateToken, setTokenCookies, verifyToken } from '../lib/Token&Cookies.js';
import User from '../model/User.js';
import cloudinary from '../lib/cloudinary.js';

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !user.comparePassword(password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const { accessToken, refreshToken } = generateToken(user._id);
        setTokenCookies(res, accessToken, refreshToken);
        res.json({ message: 'User Login SuccesFully.', userData: {
            _id: user._id,
            username: user.username,
            fullname: user.fullname,
            email: user.email
        }});
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const register = async (req, res) => {
    try {
        const { fullname, username, email, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        const newUser = new User({ fullname, username, email, password });
        await newUser.save();
        const { accessToken, refreshToken } = generateToken(newUser._id);
        setTokenCookies(res, accessToken, refreshToken);

        try {
            await transporter.sendMail(mailOptions(newUser));
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            console.error('Email error details:', {
                code: emailError.code,
                command: emailError.command,
                response: emailError.response,
                responseCode: emailError.responseCode
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }

    return res.status(201).json({ 
            message: 'User registered successfully', 
            userData: {
                _id: newUser._id,
                username: newUser.username,
                fullname: newUser.fullname,
                email: newUser.email
            },
    });
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
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }

        const payload = verifyToken(token, 'refresh');
        if (!payload) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const { accessToken: newAccessToken } = generateToken(payload.userId);
        setTokenCookies(res, newAccessToken, token);

        res.json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const me = async (req, res) => {
    try{
        const user = req.user;
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server Error'})
    }
}

export const allUsers = async (req, res) => {
    try {
        const currentUser = await req.user;
        const allUsers = await User.find().select("-password");
        const filteredUsers = allUsers.filter((users) => users._id.toString() !== currentUser._id.toString());
        res.status(200).json({ users: filteredUsers });
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { username, fullname } = req.body;
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update basic info if provided
        if (username) user.username = username;
        if (fullname) user.fullname = fullname;

        // Handle avatar upload if provided
        if (req.file) {
            // Delete old avatar if exists
            if (user.avatar) {
                // Extract public_id from the URL (Cloudinary provides this in the format: v1234567890/...)
                const publicId = user.avatar.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`avators/${publicId}`);
            }

            // Upload new avatar
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "avators",
            });

            user.avatar = result.secure_url;
        }

        await user.save();
        
        res.status(200).json({
            message: 'Profile updated successfully',
            userData: {
                _id: user._id,
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ 
            message: 'Error updating profile',
            error: error.message 
        });
    }
}