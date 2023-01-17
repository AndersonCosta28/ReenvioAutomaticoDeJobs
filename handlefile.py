import json
import uuid
class HandleJobsCharge:
    id_charge = str(uuid.uuid4())
    
    def generateStatus(self):
        from random import randint
        value = randint(1, 3)
        if (value == 1):
            return "running"
        elif (value == 2):
            return "done"
        else:
            return "failed"

    def generateOneJob(self, id_parent = ""): 
        return {
                "id_job": str(uuid.uuid4()),
                "id_charge": self.id_charge,
                "status": self.generateStatus(),
                "was_sent" : False,
                "id_parent": id_parent
            }

    def generateChargeJobs(self):
        listObjects = []
        for i in range(0, 12):
            listObjects.append(self.generateOneJob())
        return listObjects

    def updateFile(self, jobs):
        jsonString = json.dumps(jobs)
        jsonFile = open(self.id_charge + ".json", "w")
        jsonFile.write(jsonString)
        jsonFile.close()

    def createFile(self):
        jsonString = json.dumps(self.generateChargeJobs())
        jsonFile = open(self.id_charge + ".json", "w")
        jsonFile.write(jsonString)
        jsonFile.close()

    def getFailedJobs(self, jobs): 
        failedJobs = []
        for i in range(0, len(jobs)):
            job = jobs[i]
            isPendent = job['status'] == "failed"
            wasAlreadySent = job['was_sent'] == False
            if (isPendent and wasAlreadySent):
                failedJobs.append({ "job": job, "index": i })
        return failedJobs

    def resendJobsFailed(self, failedJobs, allJobs):
        jobsResent = []
        for i in range(0, len(failedJobs)):
            indexJob = failedJobs[i]["index"]
            job = allJobs[indexJob]
            job['was_sent'] = True
            jobsResent.append(self.generateOneJob(job['id_job']))
        return jobsResent

    def updateRunningJobs(self, jobs):
        for i in range(0, len(jobs)):
            
            isRunning = jobs[i]['status'] == "running"
            if (isRunning):
                jobs[i]['status'] = self.generateStatus()
        return jobs