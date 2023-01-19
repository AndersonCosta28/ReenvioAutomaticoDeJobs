import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { createJobFile, getPendingJobs, getStaleJobs, Job, leaveStaleWorkThatExceededAttempts, resendFailedJobs } from './HandleJobs'
import express, { Request, Response } from "express"
import cors from 'cors'
import { Charge, StatusCharge, chargePath, createCharge, getPendingCharges, updateStatusOfCharge } from './HandleCharge'

const PORT = 3005
const app = express()

if (!existsSync("./charges_jobs")) mkdirSync("charges_jobs")
if (!existsSync(chargePath)) writeFileSync(chargePath, "[]")

app.use(cors())
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
    console.log("teste")
    return res.send("Hello World")
})

app.get("/criar_carga", (req: Request, res: Response) => {
    const charge = createCharge()
    createJobFile(charge.id)
    res.send({ id_carga: charge.id })
})

app.listen(PORT, () => console.log("Listening on port 3005"))

setInterval(() => {
    const pendingCharges = getPendingCharges()
    console.log("Number of pending charges: " + pendingCharges.length)
    pendingCharges.forEach((charge: Charge) => {
        const pendingJobs = getPendingJobs(charge.id)
        if (pendingJobs.length > 0){
            leaveStaleWorkThatExceededAttempts(charge.id)
            resendFailedJobs(charge.id)
        }
        else {
            if (getStaleJobs(charge.id).length > 0)
                updateStatusOfCharge(charge.id, StatusCharge[StatusCharge.Partially_Done])
            else
                updateStatusOfCharge(charge.id, StatusCharge[StatusCharge.Done])
        }
    })
}, 5000)


// app.get("/lista_cargas_pendentes", (req: Request, res: Response) => {
//     const content = getPendingCharges()
//     res.send({content})
// })

// app.get("/listar_todos_pendentes_de_uma_carga/:id_charge", (req: Request, res: Response) => {
//     const id_charge = req.params.id_charge
//     const content = getPendingJobs(id_charge);
//     res.send({content: content})
// })

// app.get("/reenviar_jobs_falhados/:id_charge", (req: Request, res: Response) => {
//     const id_charge = req.params.id_charge
//     resendFailedJobs(id_charge)
//     res.end()
// })

// app.post("/alterar_carga_para_concluido/:id_charge", (req: Request, res: Response) => {
//     const id_charge = req.params.id_charge
//     updateChargeToDone(id_charge)
//     res.end()
// })