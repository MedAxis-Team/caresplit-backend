import mongoose, { Model, Schema, Document } from 'mongoose';

interface IAuth extends Document {
  fullname: string;
  email: string;
  phone: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}



const AuthSchema: Schema<IAuth> = new Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true, minlength: 8 }
}, {
    timestamps: true
});

const Auth: Model<IAuth> = mongoose.model<IAuth>('Auth', AuthSchema);

export default Auth;