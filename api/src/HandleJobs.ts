import { readFileSync, writeFileSync } from 'fs'
import { v4 as uuid4 } from 'uuid'

export type Job = {
    id_job: string,
    id_charge: string,
    status: string,
    was_sent: boolean,
    id_parent: string,
    retry: number
}

export enum StatusJob { Queue, Running, Done, Failed, Stale }

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

export const getStaleJobs = (id_charge: string): Job[] => readJobFile(id_charge).filter((job: Job) => job.status === StatusJob[StatusJob.Stale])

const generateChargeJobs = (id_charge: string): Job[] => {
    const jobs: Job[] = []
    for (let i = 0; i < 12; i++)
        jobs.push(generateOneJob(id_charge))
    return jobs
}

const generateOneJob = (id_charge: string, jobParent?: Job): Job => ({
    id_job: uuid4(),
    id_charge: id_charge,
    status: StatusJob[StatusJob.Queue],
    was_sent: false,
    id_parent: !jobParent ? "" : jobParent.id_job,
    retry: !jobParent ? 0 : ++jobParent.retry
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

export const leaveStaleWorkThatExceededAttempts = (id_charge: string) => {
    let currentAllJobs = readJobFile(id_charge)
    currentAllJobs = currentAllJobs
        .map((job: Job) => {
            if (job.status === StatusJob[StatusJob.Failed] && job.was_sent === false && job.retry === 3)
                job.status = StatusJob[StatusJob.Stale]
            return job
        })
    updateJobFile(id_charge, currentAllJobs)
}

export const resendFailedJobs = (id_charge: string) => {
    let currentAllJobs = readJobFile(id_charge)
    const newsSentJobs: Job[] = []
    
    currentAllJobs = currentAllJobs        
        .map((job: Job) => {
            if (job.status === StatusJob[StatusJob.Failed] && job.was_sent === false && job.retry < 3){
                job.was_sent = true;
                newsSentJobs.push(generateOneJob(id_charge, job))
            }
            return job
        })

    const newContent = [...currentAllJobs, ...newsSentJobs]
    updateJobFile(id_charge, newContent)
}
//#endregion