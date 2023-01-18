import { readFileSync, writeFileSync } from 'fs'
import { v4 as uuid4 } from 'uuid'

export type Job = {
    id_job: string,
    id_charge: string,
    status: string,
    was_sent: boolean,
    id_parent: string
}

export enum StatusJob { Queue, Running, Done, Failed }

//#region Job_File

export const createJobFile = (id_charge: string) => writeFileSync(getPathToJob(id_charge), JSON.stringify(generateChargeJobs(id_charge)))

export const updateJobFile = (id_charge: string, content: Job[]) => writeFileSync(getPathToJob(id_charge), JSON.stringify(content))

export const readJobFile = (id_charge: string): Job[] => {
    let content = JSON.parse(readFileSync(getPathToJob(id_charge)).toString())
    content = content.map(updatePendingJobs)
    updateJobFile(id_charge, content)
    return content
}

const getPathToJob = (uuid: string): string => "./charges_jobs/" + uuid + ".json"
//#endregion

//#region Handler Job
export const getPendingJobs = (id_charge: string): Job[] => {
    const content = readJobFile(id_charge).filter((job: Job) => {
        const failed = job.status === StatusJob[StatusJob.Failed] && job.was_sent === false;
        const runnig = job.status === StatusJob[StatusJob.Running]
        const queue = job.status === StatusJob[StatusJob.Queue]
        return failed || runnig || queue
    })
    return content
}

const generateChargeJobs = (id_charge: string): Job[] => {
    const jobs: Job[] = []
    for (let i = 0; i < 12; i++)
        jobs.push(generateOneJob(id_charge))
    return jobs
}

const generateOneJob = (id_charge: string, id_parent = ""): Job => ({
    id_job: uuid4(),
    id_charge: id_charge,
    status: StatusJob[StatusJob.Queue],
    was_sent: false,
    id_parent: id_parent
})

const generateStatus = () => {
    const numberRandom = Math.floor(Math.random() * 3) + 1 // Essa parte é importante de notar o +1, ele exclui o Queue
    return StatusJob[numberRandom]
}

const updatePendingJobs = (job: Job) => {
    if (job.status === StatusJob[StatusJob.Running] || job.status === StatusJob[StatusJob.Queue])
        job.status = generateStatus()
    return job
}

export const resendFailedJobs = (id_charge: string) => {
    const currentAllJobs = readJobFile(id_charge)
    const newsSentJobs: Job[] = []
    currentAllJobs.map((element: Job) => {
        if (element.status === StatusJob[StatusJob.Failed] && element.was_sent === false) {
            element.was_sent = true;
            newsSentJobs.push(generateOneJob(id_charge, element.id_job))
            return element
        }
    });
    const newContent = [...currentAllJobs, ...newsSentJobs]
    updateJobFile(id_charge, newContent)
}
//#endregion