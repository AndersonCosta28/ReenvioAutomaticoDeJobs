import { StatusCharge } from "./Charge.Commom"  
import Charge from "./Charge.Entity"
import { v4 as uuid4 } from 'uuid'
import AppDataSource from "../Database/DataSource"
import Credential from "../Credential/Credential.entity"

export default class ChargeService {
    repository = AppDataSource.getRepository(Charge)

    create = async (id_charge: string, credential: Credential): Promise<Charge> => {
        const charge: Charge = { id: id_charge, status: StatusCharge[StatusCharge.running], credential }
        const chargeCreated = this.repository.create(charge)
        return await this.repository.save(chargeCreated)
    }

    findAll = async (): Promise<Charge[]> => await this.repository.find()

    findOneById = async (id_charge: string): Promise<Charge>  => {        
        const charge = await this.repository.findOneBy({id: id_charge})
        if(!charge) throw new Error("Charge is not Found")
        return charge
    }

    update = async (id_charge: string, charge: Charge) => await this.repository.update(id_charge, charge)

    getPendingCharges = async (): Promise<Charge[]> => {
        const content = await this.findAll()
        return content.filter((charge: Charge) => charge.status === StatusCharge[StatusCharge.running])
    }

    updateStatusOfCharge = async (id_charge: string, status: string): Promise<void> => {
        let charge = await this.findOneById(id_charge)        
        charge.status = status
        await this.update(id_charge, charge)
    }
}