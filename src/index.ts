import 'reflect-metadata'
import './Database/DataSource'
import express, { Request, Response } from "express"
import cors from 'cors'
import JobService from './Job/Job.Service'
import ChargeService from './Charge/Charge.Service'
import { StatusCharge } from './Charge/Charge.Commom'
import http from 'http'
import { Server as WebSocketServer } from "socket.io"
import { v4 as uuid4 } from "uuid"
import { pastDays, splitDayInterval } from './utils'
import Charge from './Charge/Charge.Entity'
import CredentialService from './Credential/Credential.service'

const PORT = 3005
const app = express()
const server = http.createServer(app)
const io = new WebSocketServer(server)
const jobService = new JobService()
const chargeService = new ChargeService()
const credentialService = new CredentialService()

app.use(cors())
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
    res.sendFile(__dirname + '/Pages/index.html');
})

app.get("/ping", (req: Request, res: Response) => {
    res.send("pong");
})

app.post("/create_charge", async (req: Request, res: Response) => {
    const { credentialId, pastDays: numberPastDays, splitDayInterval: numberSplitDayInterval } = req.body
    const chargeId = uuid4()
    const params = splitDayInterval(pastDays(new Date(), numberPastDays), new Date(), numberSplitDayInterval)
    const credential = await credentialService.create(credentialId)
    const charge = await chargeService.create(chargeId, credential)
    const jobsId = await jobService.create(params, credential, charge)
    res.send({ uuid: chargeId, children: jobsId })
})

app.post("/splitjob", async (req: Request, res: Response) => {
    const { startDate, endDate, splitDayInterval: numberSplitDayInterval, credentialId, chargeId } = req.body

    const params = splitDayInterval(new Date(startDate), new Date(endDate), numberSplitDayInterval)
    const credential = await credentialService.findOneById(credentialId)
    const charge = await chargeService.findOneById(chargeId)
    const jobsId = await jobService.create(params,credential, charge)
    res.send({ uuid: uuid4(), children: jobsId })
})

server.listen(PORT, () => console.log("Listening on port 3005"))

io.on('connection', (socket) => { });

// setInterval(async () => {
//     let currentCharge = "";
//     try {
//         await jobService.updateAllJobsPending()
//         console.log(new Date())
//         // const pendingCharges = await chargeService.getPendingCharges()

//         // for (const pendingCharge of pendingCharges) {
//         //     currentCharge = pendingCharge.id
//         //     const pendingJobs = await jobService.getPendingJobs(pendingCharge.id)
//         //     console.log(pendingJobs.length)
//         //     if (pendingJobs.length > 0)
//         //         await jobService.resendFailedJobs(pendingCharge.id)
//         //     else {
//         //         if ((await jobService.getErrorJobsThatExceededAttempts(pendingCharge.id)).length > 0)
//         //             await chargeService.updateStatusOfCharge(pendingCharge.id, StatusCharge[StatusCharge.partially_done])
//         //         else
//         //             await chargeService.updateStatusOfCharge(pendingCharge.id, StatusCharge[StatusCharge.done])
//         //     }
//         // }
//     } catch (error) {
//         console.error("Occured an error in the charge -> " + currentCharge)
//         console.error(error)
//     }
//     finally {
//         const allCharges = await chargeService.findAll()
//         const doneCharges = []
//         const runningCharges = []
//         const partially_DoneCharges = []
//         for (const charge of allCharges) {
//             if (charge.status === StatusCharge[StatusCharge.done])
//                 doneCharges.push(charge)
//             else if (charge.status === StatusCharge[StatusCharge.partially_done])
//                 partially_DoneCharges.push(charge)
//             else if (charge.status === StatusCharge[StatusCharge.running])
//                 runningCharges.push(charge)
//         }
//         io.emit("charges", { doneCharges: doneCharges.length, runningCharges: runningCharges.length, partially_DoneCharges: partially_DoneCharges.length })
//     }
// }, 10000)