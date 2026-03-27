import mongoose, { Document, Schema, Model} from "mongoose";

interface IPayment extends Document {
    billId: mongoose.Types.ObjectId;
    patientId: mongoose.Types.ObjectId;
    amountPaid: number;
    status: 'pending' | 'completed' | 'failed';
    reference: string;
    createdAt: Date;

}

const paymentSchema: Schema<IPayment> = new Schema({
    billId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bill',
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth',
        required: true
    },
    amountPaid: {
        type: Number,
        required: true
    },
    status: {
        type: String, 
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    reference: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


const Payment: Model<IPayment> = mongoose.model<IPayment>('Payment', paymentSchema)

export default Payment;