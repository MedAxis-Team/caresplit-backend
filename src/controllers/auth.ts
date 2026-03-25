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


const login = async (req: Request, res: Response) => {
       const { email, password } = req.body

       const user = await AuthService.login(email, password)

       res.status(200).json({
        status: 'success',
        message: 'User logged in successfully'
       })
}

const AuthController = {
    signUp,
    login
}

export default AuthController