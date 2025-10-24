import { verifyToken } from "../lib/Token&Cookies.js";
import User from "../model/User.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if(!accessToken){
            return res.status(401).json({ message: 'Acces token is not found. '})
        }
        try {
            const decoded = verifyToken(accessToken, 'access');
            const user = await User.findOne(decoded.userId).select("-password");
            if (!user) {
                console.log('User not found.')
				return res.status(401).json({ message: "User not found" });
			}
			req.user = user;

			next();
        } catch (error) {
            if(error.name === "TokenExpiredError"){
                return res.status(401).json({ message: "Token is expired."})
            }
            throw error;
        }
    } catch (error){
       res.status(500).json({ message: 'Server error:', error })
    }
}