import Bill from "../models/bill.js"

export const uploadBill = async (
    
    patientId: string, 
    totalAmount: number, 
    hospitalName: string,
    treatmentBreakdown: { name: string; cost: number }[],
    hospitalAddress: string,
    dateOfService: Date

    ) =>
        
        {
         
            if(!patientId || !totalAmount 
                || !hospitalName || !hospitalAddress 
                || !treatmentBreakdown || !dateOfService){
                  
                    throw new Error('All fields are required')
            }
        


        const bill = new Bill({
            patientId,
    totalAmount,
    hospitalName,
    treatmentBreakdown,
    hospitalAddress,
    dateOfService

        })

        await bill.save()
        return bill


}


export const getBills = async () => {

    const bills = await Bill.find()

    if(!bills){
        throw new Error('Bills not found')
    }

    return bills
}

export const getBill = async (id: string)=>{

    if(!id){
        throw new Error('ID is required')
    }

    const bill = await Bill.findById(id)

    if(!bill){
        throw new Error('Bill not found')
    }

    return bill
}


const BillService = {
    uploadBill, 
    getBills,
    getBill
}

export default BillService