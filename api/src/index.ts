import { existsSync } from 'fs'
import { v4 as uuid4 } from 'uuid'
import { createFile, job, readFile, resendFailedJobs } from './HandleJobsCharge'
import express, { Request, Response } from "express"
const app = express()
app.use(express.json())

app.post("/criar_carga", (req: Request, res: Response) => {
    const uuid = uuid4()
    createFile(uuid)
    res.send({id_carga: uuid})
})

app.post("/listar_todos_jobs", (req: Request, res: Response) => {
    const {id_carga} = req.body
    const content = readFile(id_carga)
    console.log(content)
    res.send({content: content})
})

app.post("/listar_alguns_jobs", (req: Request, res: Response) => {
    const {id_carga, id_jobs}  = req.body
    const content = readFile(id_carga).filter((_job: job) => id_jobs.includes(id_jobs))
    res.send({content})
})

app.post("/reenviar_jobs_falhados", (req: Request, res: Response) => {
    const {id_carga} = req.body
    resendFailedJobs(id_carga)
    res.end()
})

app.listen(3005, () => console.log("Listening on port 3005"))


let i = 0
const uuid = uuid4()



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
