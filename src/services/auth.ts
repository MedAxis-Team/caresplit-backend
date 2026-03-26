import Auth from "../models/auth.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export const signUp = async (
     
    fullname: string,
     email: string,
     phone: string,
     password: string, 
     ) => {


        // check inputs are not empty
        if (!fullname || !email || !phone || !password){
            throw new Error('All fields are required')
        }
         

        // implement sign-up logic here
        const user = await Auth.findOne({ email});

        if (user){
            throw new Error('User already exists');
        }


        // hash password
        const hashedPassword = await bcrypt.hash(password, 12); 

        const newUser = new Auth({
            fullname,
            email,
            phone,
            password: hashedPassword,
            confirmPassword: hashedPassword
        })

        await newUser.save();
        return newUser;
    }


    export const loginService = async (email: string, password: string) => {

        // check inputs
        if (!email || !password){
            throw new Error('All fields are required')
        }

        // implement login logic here
        const user = await Auth.findOne({email})
        if(!user){
            throw new Error('User not found')
        }

        // check password
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid){
            throw new Error('Invalid credentials')
        }

     return user

    }
    const AuthService = {
        signUp,
        loginService
    }

    export default AuthService;
      