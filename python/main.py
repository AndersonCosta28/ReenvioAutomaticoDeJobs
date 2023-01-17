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
            handleJobsCharge.readFile() # Lê o arquivo e atualiza os jobs que estão running e separa os que estão falhados
            handleJobsCharge.resendJobsFailed() # Reenviamos os Jobs falhados
            handleJobsCharge.updateFile() # Atualizamos o arquivo
            if (len(handleJobsCharge.failedJobs) == 0):
                break


main()
