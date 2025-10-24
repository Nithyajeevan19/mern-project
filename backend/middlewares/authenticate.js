import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/UserModel.js'

export const authenticateRegister=async(req,res)=>{
    try{
        const {username,password,email}=req.body
        const hashedPassword=await bcrypt.hash(password,10)
        const newUser= await User.create({
            username,
            email,
            password:hashedPassword,
        })
        res.status(200).json({
            message:"User created Successfully",
            result:newUser,
            ok:true
        })
    }catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message  // gives actual reason
        });
}

}

export const authenticateLogin=async (req,res)=>{
    try{
        const {email,password}=req.body

        // check empty fields
        if (!email || !password) {
            return res.status(400).json({ message: "Fill all the details" });
        }

        if (!email.endsWith("@gmail.com")) {
            return res.status(400).json({ message: "Email must end with @gmail.com" });
        }

        // find user by email
        const user = await User.findOne({ email });

        if (user==null){
            return res.status(400).json({ message: "Email not registered" });
        }
        if (!user ) {
            return res.status(400).json({ message: "Email not registered" });
        }
        if (password.length < 3 || password.length > 20) {
            res.status(400).json({
                message:"length of password should be btw 3-20"
            })
            return 
        }
       
        // compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Password doesn't match" });
        }

        const accesstoken = jwt.sign({id:user._id,email:user.email},process.env.secret_key, { expiresIn: "1h" } )

        res.status(200).json({
            message: "Login successfully",
            result: user,
            jwt_token:accesstoken,
            ok:true
        });

    }
    
    catch(error){
    res.status(501).json({
        message: "server error",
        error: error.message,
        ok:false
    });
    
}

}


export const verifyToken=async(req,res,next)=>{
   const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token malformed" })
    };
    try {
        const decoded = jwt.verify(token, process.env.secret_key);
        req.user = decoded; 
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }


}