import { Request, Response } from "express";
import Bill from "../models/bill.js";
import Payment from "../models/payment.js";
import crypto from "crypto"
import axios from 'axios';
import { TokenPayload } from "../types/express.js";

export const initiatePayment = async (req: Request, res: Response) => {
    try {
        const { billId } = req.params; // Frontend tells us which bill they want to pay

        // 1. Fetch the bill from your DB
        const bill = await Bill.findById(billId);
        if (!bill) return res.status(404).json({ message: "Bill not found" });

        // patientId from auth middleware
        const user = req.user as TokenPayload
        if(!user || !user.userId){
            return res.status(401).json({
                status: 'failed',
                message: 'Unauthenticated'
            })
        }
 
        // assign patientId from token payload
        const patientId = user.userId.toString()

        // 2. Generate a unique Reference
        const transactionReference = `CS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const amountInKobo = bill.totalAmount * 100; // Convert Naira to Kobo

        // 3. Create the SHA512 Hash for INITIALIZATION (Different sequence than verification!)
        // Sequence: txn_ref + product_id + pay_item_id + amount + redirect_url + secret_key
        const hashString = `${transactionReference}${process.env.INTERSWITCH_PRODUCT_ID}${process.env.INTERSWITCH_PAY_ITEM_ID}${amountInKobo}${process.env.INTERSWITCH_REDIRECT_URL}${process.env.INTERSWITCH_SECRET_KEY}`;
        const hash = crypto.createHash('sha512').update(hashString).digest('hex');

        // 4. Save the "Pending" payment in your DB
        const newPayment = await Payment.create({
            patientId,
            billId,
            reference: transactionReference,
            amountPaid: amountInKobo,
            status: 'pending'
        });

        // 5. Send the payload back to the Frontend
        return res.status(200).json({
            merchantCode: process.env.INTERSWITCH_MERCHANT_CODE,
            payItemId: process.env.INTERSWITCH_PAY_ITEM_ID,
            amount: amountInKobo,
            reference: transactionReference,
            hash: hash,
            mode: "TEST" 
        });

    } catch (error) {
        res.status(500).json({ message: "Failed to initiate payment" });
    }
};




export const verifyPayment = async (req: Request, res: Response) => {
    const { reference } = req.params;
    console.log("1. Starting verification for:", reference);

    try {
        const productID = process.env.INTERSWITCH_PRODUCT_ID;
        const secretKey = process.env.INTERSWITCH_SECRET_KEY;
        const hashString = `${productID}${reference}${secretKey}`;
        const hash = crypto.createHash('sha512').update(hashString).digest('hex');

        const url = `https://newwebpay.qa.interswitchng.com/collections/api/v1/gettransaction.json?merchantcode=${process.env.INTERSWITCH_MERCHANT_CODE}&transactionreference=${reference}&amount=1000000`;

        console.log("2. Hitting Interswitch API...");
        // ADDED TIMEOUT: If no response in 10s, it will move to 'catch' block
        const response = await axios.get(url, {
            headers: { 'Hash': hash },
            timeout: 10000 
        });

        console.log("3. Interswitch Response Code:", response.data.ResponseCode);

        if (response.data.ResponseCode === "00") {
            console.log("4. Finding and updating Payment in DB...");
            
            // CHECK THIS: Is your field named 'reference' or 'transactionReference'?
            const payment = await Payment.findOneAndUpdate(
                { reference: reference }, 
                { status: 'success' },
                { new: true }
            );

            if(!payment){
                console.log("5a. Payment REF not found in DB");
                return res.status(404).json({ message: "Payment record not found" });
            }

            console.log("5b. Updating Bill...");
            await Bill.findByIdAndUpdate(payment.billId, { status: 'paid' });

            return res.status(200).json({ message: "Payment Verified", data: response.data });
        } else {
            return res.status(400).json({ message: "Payment Failed", reason: response.data.ResponseDescription });
        }

    } catch (error: any) {
        console.error("6. DETECTED ERROR:", error.message);
        res.status(500).json({ message: "Verification failed", error: error.message });
    }
};



const InterswitchController = {
    initiatePayment,
    verifyPayment
}


export default InterswitchController