import json
import uuid


class HandleJobsCharge:
    id_charge = str(uuid.uuid4())
    content = []
    failedJobs = []

    def readFile(self):
        file = open(self.id_charge + ".json", "r")
        self.content = json.loads(file.read())        
        self.content = self._updateRunningJobs() # Vamos atualizar os jobs que ainda estão rodando
        self.failedJobs = self._getFailedJobs()  # Vamos separar os que falharam
        file.close()

    def resendJobsFailed(self):
        for i in range(0, len(self.failedJobs)):
            indexJob = self.failedJobs[i]["index"]
            job = self.content[indexJob]
            job['was_sent'] = True
            self.content.append(self._generateOneJob(job['id_job']))

    def updateFile(self):
        jsonString = json.dumps(self.content)
        jsonFile = open(self.id_charge + ".json", "w")
        jsonFile.write(jsonString)
        jsonFile.close()

    def createFile(self):
        jsonString = json.dumps(self._generateChargeJobs())
        jsonFile = open(self.id_charge + ".json", "w")
        jsonFile.write(jsonString)
        jsonFile.close()

    def _updateRunningJobs(self):
        for i in range(0, len(self.content)):
            isRunning = self.content[i]['status'] == "running"
            if (isRunning):
                self.content[i]['status'] = self._generateStatus()
        return self.content

    def _getFailedJobs(self):
        failedJobs = []
        for i in range(0, len(self.content)):
            job = self.content[i]
            isPendent = job['status'] == "failed"
            wasAlreadySent = job['was_sent'] == False
            if (isPendent and wasAlreadySent):
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
            "status": self._generateStatus(),
            "was_sent": False,
            "id_parent": id_parent
        }

    def _generateChargeJobs(self):
        listObjects = []
        for i in range(0, 12):
            listObjects.append(self._generateOneJob())
        return listObjects
