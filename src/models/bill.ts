import mongoose, { Document, Model, Schema } from "mongoose";

interface IBill extends Document {
    patientId: mongoose.Types.ObjectId;
    totalAmount: number;
    hospitalName: string;
    treatmentBreakdown: {
        name: string;
        cost: number;
    }[];
    hospitalAddress: string;
    status: 'pending' | 'approved' | 'rejected';
    dateOfService: Date;
    createdAt: Date;
    updatedAt: Date;

}

const BillSchema: Schema<IBill> = new Schema({
    patientId: { 
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Auth', 
         required: true},

    totalAmount: { 
        type: Number, 
        required: true },

    hospitalName: {
        type: String, 
        required: true},

    treatmentBreakdown: [{
        name: { type: String, required: true},
        cost: { type: Number, required: true}
    }],

    hospitalAddress: { 
        type: String, 
        required: true},

    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending'},

    dateOfService: { 
        type: Date, 
        required: true}
}, {
    timestamps: true
}
)


const Bill: Model<IBill> = mongoose.model<IBill>('Bill', BillSchema)

export default Bill;