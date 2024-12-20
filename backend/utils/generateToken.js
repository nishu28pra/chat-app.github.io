import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (userId,res) => {
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:'15d'
    });
    res.cookie("jwt",token,{
        maxAge: 15 * 24 * 60 * 60 * 1000,  //time for cookie
        httpOnly:true, // to prevent xss(cross-site scripting means javascript se access nho kr skte ) attacks 
        sameSite : "strict",
        secure: process.env.NODE_ENV !== "development",

    });
};
export default generateTokenAndSetCookie;
