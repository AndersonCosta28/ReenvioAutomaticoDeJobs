import Job from "./Job.Entity"
import { StatusJob } from "./Job.commom"
import { v4 as uuid4 } from 'uuid'
import AppDataSource from "../Database/DataSource"

export default class JobService {
    repository = AppDataSource.getRepository(Job)


    create = async (id_charge: string, jobsId: string[]) => {
        for (const jobId of jobsId) {
            const job = this.generateOneJob(id_charge, jobId)
            const jobCreated = this.repository.create(job)
            await this.repository.save(jobCreated)
        }
    }

    createChild = async (job: Job, newJobId: string) => {
        const childJob = this.generateOneJob(job.id_charge, newJobId, job)
        const jobCreated = this.repository.create(childJob)
        await this.repository.save(jobCreated)
    }

    update = async (job: Job) => await this.repository.update({ id: job.id, id_charge: job.id_charge }, job)

    findAll = async (id_charge: string): Promise<Job[]> => {
        const updatedJobs: Job[] = []
        let jobs = await this.repository.findBy({ id_charge })

        for (const job of jobs) {
            updatedJobs.push(await this.updatePendingJobs(job))
        }

        return updatedJobs
    }

    getPendingJobs = async (id_charge: string): Promise<Job[]> => {
        const content = (await this.findAll(id_charge))
            .filter((job: Job) => {
                const failed = job.status === StatusJob[StatusJob.Failed] && job.was_sent === false;
                const runnig = job.status === StatusJob[StatusJob.Running]
                const queue = job.status === StatusJob[StatusJob.Queue]
                return failed || runnig || queue
            })
        return content
    }

    getStaleJobs = async (id_charge: string): Promise<Job[]> => (await this.findAll(id_charge)).filter((job: Job) => job.status === StatusJob[StatusJob.Stale])

    generateOneJob = (id_charge: string, jobId: string, jobParent?: Job): Job => ({
        id: jobId,
        id_charge: id_charge,
        status: StatusJob[StatusJob.Queue],
        was_sent: false,
        id_parent: !jobParent ? "" : jobParent.id,
        retry: !jobParent ? 0 : jobParent.retry + 1
    })

    generateStatus = () => {
        const numberRandom = Math.floor(Math.random() * 3) + 1 // Essa parte é importante de notar o +1, ele exclui o Queue
        return StatusJob[numberRandom]
    }

    updatePendingJobs = async (job: Job) => {
        if (job.status === StatusJob[StatusJob.Running] || job.status === StatusJob[StatusJob.Queue])
            job.status = this.generateStatus()
        await this.update(job)
        return job
    }

    resendFailedJobs = async (id_charge: string) => {
        const currentAllJobs = await this.findAll(id_charge)
        const faliedJobs = currentAllJobs.filter((job: Job) => job.status === StatusJob[StatusJob.Failed] && job.was_sent === false)
        for (const job of faliedJobs) {
            if (job.retry < 3) {
                job.was_sent = true;
                await this.createChild(job, uuid4())
            }
            else
                job.status = StatusJob[StatusJob.Stale]

            await this.update(job)
        }
    }
}