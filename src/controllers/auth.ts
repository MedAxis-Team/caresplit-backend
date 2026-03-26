import { Request, Response} from "express"
import jwt from "jsonwebtoken"

import AuthService from "../services/auth.js"

export const signUp = async (req: Request, res: Response) => {

    try {

      
    const { fullname, email, phone, password } = req.body

    const user = await AuthService.signUp(fullname, email, phone, password)

    res.status(201).json({
        status: 'success',
        message: 'User created successfully',
        data: {
            userId: user._id,
            email: user.email,
            phone: user.phone
        }
        
    })



    }catch(error){
        res.status(500).json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Error signing up user'
        })

    }

}


export const login = async (req: Request, res: Response) => {

    
       const { email, password } = req.body

          try {


const user = await AuthService.loginService(email, password);


        // generate tokens
       // generate auth token (JWT) - This can be done in controller or here based on your architecture
     const token = jwt.sign({
            userId: user._id,
            email: user.email
     }, process.env.ACCESS_TOKEN!, { expiresIn: '1h' });

     const refreshToken = jwt.sign({
          userId: user._id,
          email: user.email
     }, process.env.REFRESH_TOKEN!, { expiresIn: '7d' });

       res.status(200).json({
        status: 'success',
        message: 'User logged in successfully',
        data: {
            user: {
                id: user._id,
                email: user.email
            },
            token,
            refreshToken
        }
        
       })



          } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error instanceof Error ? error.message : 'Error logging in user'
            })
          }
}

const AuthController = {
    signUp,
    login
}

export default AuthController