import { Request, Response} from "express"

import AuthService from "../services/auth"

const signUp = async (req: Request, res: Response) => {

    const { fullname, email, phone, password, confirmPassword } = req.body

    const user = await AuthService.signUp(fullname, email, phone, password, confirmPassword)

    res.status(201).json({
        status: 'success',
        message: 'User created successfully'
    })
}


const AuthController = {
    signUp 
}

export default AuthController