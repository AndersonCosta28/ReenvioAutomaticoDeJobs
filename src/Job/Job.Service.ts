import Job from "./Job.Entity"
import { Params, StatusJob } from "./Job.commom"
import { v4 as uuid4 } from 'uuid'
import AppDataSource from "../Database/DataSource"
import Charge from "../Charge/Charge.Entity"
import Credential from "../Credential/Credential.entity"

export default class JobService {
    repository = AppDataSource.getRepository(Job)

    create = async (params: Params[], credential: Credential, charge: Charge): Promise<string[]> => {
        const jobsId: string[] = []        
        for (const param of params) {
            const jobId = uuid4()
            jobsId.push(jobId)
            const job = this.generateOneJob(jobId, param, credential, charge)
            const jobCreated = this.repository.create(job)
            await this.repository.save(jobCreated)
        }
        return jobsId
    }

    createChild = async (job: Job, newJobId: string) => {
        const childJob = this.generateOneJob(newJobId, job.params, job.credential, job.charge, job)
        const jobCreated = this.repository.create(childJob)
        return await this.repository.save(jobCreated)
    }

    update = async (job: Job) => await this.repository.update({ job_id: job.job_id }, job)


    generateOneJob = (jobId: string, params: Params, credential: Credential, charge:Charge, jobParent?: Job): Job => ({
        job_id: jobId,
        charge,
        status: StatusJob[StatusJob.queued],
        was_sent: false,
        parent_id: !jobParent ? "" : jobParent.job_id,
        retries: !jobParent ? 2 : jobParent.retries - 1,
        isInvalidCredential: false,
        params: params,
        credential,
        errors: "",
    })

    generateStatus = () => {
        const numberRandom = Math.floor(Math.random() * 3) + 1 // Essa parte é importante de notar o +1, ele exclui o Queued
        return StatusJob[numberRandom]
    }

    updateAllJobsPending = async () => {
        const jobs: Job[] = await this.repository.find()
        for (const job of jobs) {
            if (((job.status === StatusJob[StatusJob.running]
                || job.status === StatusJob[StatusJob.queued])
                && job.retries >= 0))
                await this.updatePendingJobs(job)

            else if (job.status === StatusJob[StatusJob.failed] && job.retries > 0 && job.was_sent === false)
                await this.resendFailedJob(job)
        }
    }

    updatePendingJobs = async (job: Job) => {
        if (job.status === StatusJob[StatusJob.running] || job.status === StatusJob[StatusJob.queued])
            job.status = this.generateStatus()
        await this.update(job)
        return job
    }

    resendFailedJob = async (job: Job) => {
        job.was_sent = true;
        await this.createChild(job, uuid4())
        await this.update(job)
    }
}