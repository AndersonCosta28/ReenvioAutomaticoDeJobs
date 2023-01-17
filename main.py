from handlefile import HandleJobsCharge
import json
import uuid
import time
from os import path


def main():
    handleJobsCharge = HandleJobsCharge()
    while (True):
        time.sleep(5) # Simular o x tempo para cada execução
        jsonFileExists = path.isfile(handleJobsCharge.id_charge + '.json')
        if (not jsonFileExists): # Aqui simulados a primeira carga, que o corretor acaba de cadastrar a credential
            handleJobsCharge.createFile()
            continue

        if (jsonFileExists):     # Numa segunda execução deste script seria uma simulação de a cada x tempo, iremos verificar se o job foi concluído
            file = open(handleJobsCharge.id_charge + ".json", "r")        
            content = json.loads(file.read())
            content = handleJobsCharge.updateRunningJobs(content) # Vamos atualizar os jobs que ainda estão rodando
            failedJobs = handleJobsCharge.getFailedJobs(content) # Pegar os Jobs que falharam
            resentJobs = handleJobsCharge.resendJobsFailed(failedJobs, content) # Reenviamos os Jobs falhados
            newContentToAppend = content + resentJobs # Refazemos a lista para escrever no JSON

            file.close()
            handleJobsCharge.updateFile(newContentToAppend)
            if (len(failedJobs) == 0):
                break


main()
