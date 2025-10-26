import { verifyToken } from "../lib/Token&Cookies.js";
import User from "../model/User.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        console.log(accessToken);
        if(!accessToken){
            return res.status(401).json({ message: 'Acces token is not found. '})
        }
        try {
            const decoded = verifyToken(accessToken, 'access');
            console.log(decoded);
           const user = await User.findById(decoded.userId).select("-password");
            console.log(user);
            if (!user) {
                console.log('User not found.')
				return res.status(401).json({ message: "User not found" });
			}
			req.user = user;
            console.log(user);
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