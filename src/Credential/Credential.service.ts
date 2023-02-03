import AppDataSource from "../Database/DataSource";
import Credential from "./Credential.entity";

export default class CredentialService {
    repository = AppDataSource.getRepository(Credential)

    create = async (id: number): Promise<Credential> => {
        const credentialCreated = this.repository.create({ id })
        return await this.repository.save(credentialCreated)
    }

    findOneById = async (id: number): Promise<Credential> => {
        const credential = await this.repository.findOneBy({id})
        if (!credential) throw new Error("Credential not found")
        return credential
    }
}