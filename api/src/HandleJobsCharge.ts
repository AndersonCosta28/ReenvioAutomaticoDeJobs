import { readFileSync, writeFileSync } from 'fs'
import { v4 as uuid4 } from 'uuid'

export type job = {
    id_job: string,
    id_charge: string,
    status: string,
    was_sent: boolean,
    id_parent: string
}

const generateChargeJobs = (id_charge: string): job[] => {
    const jobs: job[] = []
    for (let i = 0; i < 12; i++)
        jobs.push(generateOneJob(id_charge))
    return jobs
}

const generateOneJob = (id_charge: string, id_parent = ""): job => ({
    id_job: uuid4(),
    id_charge: id_charge,
    status: generateStatus(),
    was_sent: false,
    id_parent: id_parent
})

const generateStatus = (): string => {
    const numberRandom = Math.floor(Math.random() * 3) + 1
    if (numberRandom === 1)
        return "running"
    else if (numberRandom === 2)
        return "done"
    else
        return "failed"
}

export const createFile = (id_charge: string) => writeFileSync(id_charge + ".json", JSON.stringify(generateChargeJobs(id_charge)))

export const updateFile = (id_charge: string, content: job[]) => writeFileSync(id_charge + ".json", JSON.stringify(content))

export const readFile = (id_charge: string): job[] => {
    const file = JSON.parse(readFileSync(id_charge + ".json").toString())
    file.map(updateRunningJobs)
    return file
}

const updateRunningJobs = (job: job) => {
    if (job.status === 'running')
        job.status = generateStatus()
    return job
}

export const resendFailedJobs = (id_charge: string) => {
    const currentAllJobs = readFile(id_charge)
    const newsSentJobs: job[] = []
    currentAllJobs.map((element: job) => {
        if (element.status === "failed" && element.was_sent === false) {
            element.was_sent = true;
            newsSentJobs.push(generateOneJob(id_charge, element.id_job))
            return element
        }
    });
    const newContent = [...currentAllJobs, ...newsSentJobs]
    updateFile(id_charge, newContent)
}
