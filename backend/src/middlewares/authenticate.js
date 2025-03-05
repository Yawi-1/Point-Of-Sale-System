import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'

export const authenticate = async(req,res,next)=>{
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if(!token){
            return res.status(401).json({message:'Token not found'});
        }      
        const decoded = jwt.verify(token,process.env.JWT_SECRET) ;
        const user = await User.findById(decoded.id);
        if(!user){
            return res.status(401).json({message:'User not found'});
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(400).json({messsage:error.message,success:false})
    }
}