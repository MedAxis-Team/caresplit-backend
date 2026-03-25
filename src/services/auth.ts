import Auth from "../models/auth";
import bcrypt from "bcryptjs";

const signUp = async (
     
    fullname: string,
     email: string,
     phone: string,
     password: string, 
     confirmPassword: string) => {
         

        // implement sign-up logic here
        const user = await Auth.findOne({ email});

        if (user){
            throw new Error('User already exists');
        }

        // validate password and confirm password
        if (password !== confirmPassword){
            throw new Error ('Passwords do not match')
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

    const AuthService = {
        signUp
    }

    export default AuthService;
      