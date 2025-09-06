import { Router } from "express";
import { authenticateLogin, authenticateRegister } from "../middlewares/authenticate";

const authRoutes=Router()

authRoutes.post('/register',authenticateRegister)
authRoutes.post('/login',authenticateLogin)

export default authRoutes