import { Router } from "express";
import { authenticateLogin, authenticateRegister } from "../middlewares/authenticate.js";

const authRoutes=Router()

authRoutes.post('/register',authenticateRegister)
authRoutes.post('/login',authenticateLogin)

export default authRoutes