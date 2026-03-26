import { Request, Response } from "express"
import { TokenPayload } from "../types/express.js"
import BillService from "../services/bill.js"



export const bill = async (req: Request, res: Response) => {
      const { totalAmount, hospitalName,
    treatmentBreakdown,
    hospitalAddress,
    dateOfService  } =req.body



    try {


            // // get userId from token payload
              const user = req.user as TokenPayload
      
              // if user or userId is not found in t
              if(!user || !user.userId){
                  return res.status(401).json({
                      status: 'failed',
                      message: 'Unauthenticated: user not found'
                  })
              }
               
              // patientId from user
              const patientId = user.userId


              const bill = await BillService.uploadBill(
                patientId, 
    totalAmount, 
    hospitalName, 
    treatmentBreakdown, // 4th
    hospitalAddress,    // 5th
    dateOfService
            )

                res.status(201).json({
                    status:"success",
                    message: 'Bill uploaded successfully',
                    data: bill
                })

    } catch(error){
        res.status(500).json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Error creating bill'
        })
    }


}


export const getBills = async (req: Request, res: Response) => {
      

    try {
        
    const bills = await BillService.getBills()

    res.status(200).json({
        status:'success',
        message:'Successfully fetched bills',
        data: bills
    })
        
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Error fetching bills'
        })
    }
}

export const getBill = async (req: Request, res: Response) => {


    try {
         const { billId } = req.params

    const bill = await BillService.getBill(billId)

    res.status(200).json({
        status:'success',
        message:'Bill fetched successfully',
        data: bill
    })

    } catch(error){
        res.status(500).json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Error fetching bill'
        })
    }
   
}




const BillController = {
    bill,
    getBills,
    getBill
}


export default BillController