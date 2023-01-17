import handlefile
import json
import uuid
from os import path


def main():
    jsonFileExists = path.isfile('./data.json')
    if (not jsonFileExists): # Aqui simulados a primeira carga, que o corretor acaba de cadastrar a credential
        handlefile.createFile(uuid.uuid4())
        return;

    if (jsonFileExists):     # Numa segunda execução deste script seria uma simulação de a cada x tempo, iremos verificar se o job foi concluído
        file = open("data.json", "r")        
        content = json.loads(file.read())
        content = handlefile.updateRunningJobs(content) # Vamos atualizar os jobs que ainda estão rodando
        failedJobs = handlefile.getFailedJobs(content) # Pegar os Jobs que falharam
        resentJobs = handlefile.resendJobsFailed(failedJobs, content) # Reenviamos os Jobs falhados
        newContentToAppend = content + resentJobs # Refazemos a lista para escrever no JSON

        file.close()
        handlefile.updateFile(newContentToAppend)


main()
