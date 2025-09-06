
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const authenticateRegister=async(req,res)=>{
    try{
        const {username,password,email}=req.body
        const hashedPassword=await bcrypt.hash(password,10)
        const newUser= await UserModel.create({
            username,
            email,
            password:hashedPassword,
        })
        res.status(200).json({
            message:"User created Successfully",
            result:newUser
        })
    }catch(err){
        res.status(500).send({
            error:err
        })
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
        const user = await usermodel.findOne({ email });

        if (user==null){
            return res.status(400).json({ message: "Email not registered" });
        }
        if (!user ) {
            return res.status(400).json({ message: "Email not registered" });
        }
        if (password.length<3 || password.length>20){
            res.status(400).json({
                message:"length of password should be btw 3-20"
            })
            return 
        }
       
        // compare password
        const isMatch = (password==user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password doesn't match" });
        }

        const accesstoken = jwt.sign({email:user.email,password:user.password},process.env.secret_key)
        res.status(200).json({
            message: "Login successfully",
            result: user,
            jwt_token:accesstoken
        });
    }
    catch(error){
        res.status(501).send({
            message:"server error",
            error:error
        })
    }
}