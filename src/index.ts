import 'reflect-metadata'
import './Database/DataSource'
import express, { Request, Response } from "express"
import cors from 'cors'
import JobService from './Job/Job.Service'
import ChargeService from './Charge/Charge.Service'
import { StatusCharge } from './Charge/Charge.Commom'
import http from 'http'
import { Server as WebSocketServer } from "socket.io"


const PORT = 3005
const app = express()
const server = http.createServer(app)
const io = new WebSocketServer(server)
const jobService = new JobService()
const chargeService = new ChargeService()

app.use(cors())
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
    res.sendFile(__dirname + '/Pages/index.html');
})

app.get("/criar_carga", async (req: Request, res: Response) => {
    const { charge, jobsId } = await chargeService.create()
    jobService.create(charge.id, jobsId)
    res.send({ id_charge: charge.id, jobsId: jobsId })
})

server.listen(PORT, () => console.log("Listening on port 3005"))

io.on('connection', (socket) => {
    setInterval(async () => {
        let currentCharge = "";
        try {
            const pendingCharges = await chargeService.getPendingCharges()
            console.log("Number of pending charges: " + pendingCharges.length)

            for (const pendingCharge of pendingCharges) {
                currentCharge = pendingCharge.id
                const pendingJobs = await jobService.getPendingJobs(pendingCharge.id)
                if (pendingJobs.length > 0) {
                    await jobService.leaveStaleWorkThatExceededAttempts(pendingCharge.id)
                    await jobService.resendFailedJobs(pendingCharge.id)
                }
                else {
                    if ((await jobService.getStaleJobs(pendingCharge.id)).length > 0)
                        await chargeService.updateStatusOfCharge(pendingCharge.id, StatusCharge[StatusCharge.Partially_Done])
                    else
                        await chargeService.updateStatusOfCharge(pendingCharge.id, StatusCharge[StatusCharge.Done])
                }
            }
        } catch (error) {
            console.error("Occured an error in the charge -> " + currentCharge)
            console.error(error)
        }
        finally {
            const allCharges = await chargeService.findAll()
            const doneCharges = []
            const runningCharges = []
            const partially_DoneCharges = []
            for (const charge of allCharges) {
                if (charge.status === StatusCharge[StatusCharge.Done])
                    doneCharges.push(charge)
                else if (charge.status === StatusCharge[StatusCharge.Partially_Done])
                    partially_DoneCharges.push(charge)
                else if (charge.status === StatusCharge[StatusCharge.Running])
                    runningCharges.push(charge)
            }
            io.emit("charges", { doneCharges: doneCharges.length, runningCharges: runningCharges.length, partially_DoneCharges: partially_DoneCharges.length })
        }
    }, 5000)
});