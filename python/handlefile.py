import json
import uuid


class HandleJobsCharge:
    id_charge = str(uuid.uuid4())
    content = []
    runningJobs = []

    def readFile(self):
        file = open(self.id_charge + ".json", "r")
        self.content = json.loads(file.read())        
        self._updatePendingJobs() # Vamos atualizar os jobs que ainda estão rodando
        file.close()

    def resendJobsFailed(self):
        failedJobs = self._getFailedJobs()
        for i in range(0, len(failedJobs)):
            indexJob = failedJobs[i]["index"]
            job = self.content[indexJob]
            job['was_sent'] = True
            self.content.append(self._generateOneJob(job['id_job']))

    def updateFile(self):
        jsonString = json.dumps(self.content) # , sort_keys=True, indent=4
        jsonFile = open(self.id_charge + ".json", "w")
        jsonFile.write(jsonString)
        jsonFile.close()

    def createFile(self):
        jsonString = json.dumps(self._generateChargeJobs()) # , sort_keys=True, indent=4
        jsonFile = open(self.id_charge + ".json", "w")
        jsonFile.write(jsonString)
        jsonFile.close()

    def getPendingJobs(self): # É recomendado que essa função seja chamada após o reenvio dos Jobs falhos
        pendingJobs = []
        for i in range(0, len(self.content)):
            job = self.content[i]
            isPendent = job['status'] == "running" or job['status'] == "queue"
            if (isPendent):
                pendingJobs.append({"job": job, "index": i})
        return pendingJobs

    def _updatePendingJobs(self):
        for i in range(0, len(self.content)):
            job = self.content[i]
            isPendent = job['status'] == "running" or job['status'] == "queue"
            if (isPendent):
                self.content[i]['status'] = self._generateStatus()

    def _getFailedJobs(self):
        failedJobs = []
        for i in range(0, len(self.content)):
            job = self.content[i]
            isPendent = job['status'] == "failed" and job['was_sent'] == False
            if (isPendent):
                failedJobs.append({"job": job, "index": i})
        return failedJobs

    def _generateStatus(self):
        from random import randint
        value = randint(1, 3)
        if (value == 1):
            return "running"
        elif (value == 2):
            return "done"
        else:
            return "failed"

    def _generateOneJob(self, id_parent=""):
        return {
            "id_job": str(uuid.uuid4()),
            "id_charge": self.id_charge,
            "status": "queue",
            "was_sent": False,
            "id_parent": id_parent
        }

    def _generateChargeJobs(self):
        listObjects = []
        for i in range(0, 12):
            listObjects.append(self._generateOneJob())
        return listObjects
