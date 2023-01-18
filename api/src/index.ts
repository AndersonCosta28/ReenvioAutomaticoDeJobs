import { existsSync, mkdirSync } from 'fs'
import { v4 as uuid4 } from 'uuid'
import { createJobFile, getPendingJobs, Job, readJobFile, resendFailedJobs, StatusJob } from './HandleJobs'
import express, { Request, Response } from "express"
import cors from 'cors'
import { createCharge, getPendingCharges, updateChargeToDone } from './HandleCharge'

const PORT = 3005
const HOST = '0.0.0.0'
const app = express()

if(!existsSync("./charges_jobs")) mkdirSync("charges_jobs")

app.use(cors())
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
    console.log("teste")
    return res.send("Hello World")
})

app.get("/criar_carga", (req: Request, res: Response) => {
    const charge = createCharge()
    createJobFile(charge.id)
    res.send({id_carga: charge.id})
})

app.get("/lista_cargas_pendentes", (req: Request, res: Response) => {
    const content = getPendingCharges()
    res.send({content})
})

app.get("/listar_todos_pendentes_de_uma_carga/:id_charge", (req: Request, res: Response) => {
    const id_charge = req.params.id_charge
    const content = getPendingJobs(id_charge);
    res.send({content: content})
})

app.get("/reenviar_jobs_falhados/:id_charge", (req: Request, res: Response) => {
    const id_charge = req.params.id_charge
    resendFailedJobs(id_charge)
    res.end()
})

app.post("/alterar_carga_para_concluido/:id_charge", (req: Request, res: Response) => {
    const id_charge = req.params.id_charge
    updateChargeToDone(id_charge)
    res.end()
})
app.listen(PORT, () => console.log("Listening on port 3005"))


// let i = 0
// const uuid = uuid4()
// const timer = setInterval(() => {
//     const jsonFileExists = existsSync(uuid + ".json")
//     console.log(i++)
    
//     if (!jsonFileExists) {
//         createFile(uuid)
//         return
//     }

//     if (jsonFileExists){
//         const content = readFile(uuid)
//         console.log(content.some((_job: job) => _job.status === "failed" && _job.was_sent === false))
//         if(content.some((_job: job) => _job.status === "failed" && _job.was_sent === false))
//             resendFailedJobs(uuid)
//         else
//             clearInterval(timer)
//     }

//     // console.log(i)
//     // i++

//     // if (i === 5)
//     //     clearInterval(timer)
// }, 1000)
