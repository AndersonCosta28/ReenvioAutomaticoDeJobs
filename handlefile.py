import json
import uuid

def generateStatus():
    from random import randint
    value = randint(1, 3)
    if (value == 1):
        return "running"
    elif (value == 2):
        return "done"
    else:
        return "failed"

def generateJob(idCharge, id_parent = ""): 
    return {
            "id_job": str(uuid.uuid4()),
            "id_charge": str(idCharge),
            "status": generateStatus(),
            "was_sent" : False,
            "id_parent": id_parent
        }

def generateChargeJobs(idCharge):
    listObjects = []
    for i in range(0, 12):
        listObjects.append(generateJob(idCharge))
    return listObjects

def updateFile(jobs):
    jsonString = json.dumps(jobs)
    jsonFile = open("data.json", "w")
    jsonFile.write(jsonString)
    jsonFile.close()

def createFile(id_charge):
    jsonString = json.dumps(generateChargeJobs(id_charge))
    jsonFile = open("data.json", "w")
    jsonFile.write(jsonString)
    jsonFile.close()

def getFailedJobs(jobs): 
    failedJobs = []
    for i in range(0, len(jobs)):
        job = jobs[i]
        isPendent = job['status'] == "failed"
        wasAlreadySent = job['was_sent'] == False
        if (isPendent and wasAlreadySent):
            failedJobs.append({ "job": job, "index": i })
    return failedJobs

def resendJobsFailed(failedJobs, allJobs):
    jobsResent = []
    for i in range(0, len(failedJobs)):
        indexJob = failedJobs[i]["index"]
        job = allJobs[indexJob]
        job['was_sent'] = True
        jobsResent.append(generateJob(job['id_charge'], job['id_job']))
    return jobsResent

def updateRunningJobs(jobs):
    for i in range(0, len(jobs)):
        
        isRunning = jobs[i]['status'] == "running"
        if (isRunning):
           jobs[i]['status'] = generateStatus()
    return jobs