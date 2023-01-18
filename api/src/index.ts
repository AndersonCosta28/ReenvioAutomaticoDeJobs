import 'reflect-metadata'
import './Database/DataSource'
import express, { Request, Response } from "express"
import cors from 'cors'
import JobService from './Job/Job.Service'
import ChargeService from './Charge/Charge.Service'
import Charge from './Charge/Charge.Entity'
import { StatusCharge } from './Charge/Charge.Commom'

const PORT = 3005
const app = express()
const jobService = new JobService()
const chargeService = new ChargeService()

app.use(cors())
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
    console.log("teste")
    return res.send("Hello World")
})

app.get("/criar_carga", async (req: Request, res: Response) => {
    const { charge, jobsId } = await chargeService.create()
    jobService.create(charge.id, jobsId)
    res.send({ id_carga: charge.id, jobsId: jobsId })
})

app.listen(PORT, () => console.log("Listening on port 3005"))

setInterval(async () => {
    const pendingCharges = await chargeService.getPendingCharges()
    console.log("Number of pending charges: " + pendingCharges.length)
    for (const pendingCharge of pendingCharges) {
        const pendingJobs = await jobService.getPendingJobs(pendingCharge.id)
        if (pendingJobs.length > 0)
            await jobService.resendFailedJobs(pendingCharge.id)
        else {
            if ((await jobService.getStaleJobs(pendingCharge.id)).length > 0)
                await chargeService.updateStatusOfCharge(pendingCharge.id, StatusCharge[StatusCharge.Partially_Done])
            else
                await chargeService.updateStatusOfCharge(pendingCharge.id, StatusCharge[StatusCharge.Done])
        }
    }
}, 5000)