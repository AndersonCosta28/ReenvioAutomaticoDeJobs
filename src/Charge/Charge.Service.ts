import { StatusCharge } from "./Charge.Commom"  
import Charge from "./Charge.Entity"
import { v4 as uuid4 } from 'uuid'
import AppDataSource from "../Database/DataSource"

export default class ChargeService {
    repository = AppDataSource.getRepository(Charge)

    create = async (): Promise<{charge: Charge, jobsId: string[]}> => {
        const charge: Charge = { id: uuid4(), status: StatusCharge[StatusCharge.Running], credential_id: '' }
        const chargeCreated = this.repository.create(charge)
        const jobsId: string[] = []
        for (let i = 0; i < 12; i++)
            jobsId.push(uuid4())
        return {charge: await this.repository.save(chargeCreated), jobsId}
    }

    create2 = async (id_charge: string, id_credential: string): Promise<Charge> => {
        const charge: Charge = { id: id_charge, status: StatusCharge[StatusCharge.Running], credential_id: id_credential }
        const chargeCreated = this.repository.create(charge)
        return await this.repository.save(chargeCreated)
    }

    findAll = async (): Promise<Charge[]> => await this.repository.find()

    findOne = async (id_charge: string): Promise<Charge>  => {        
        const charge = await this.repository.findOneBy({id: id_charge})
        if(!charge) throw new Error("Charge is not Found")
        return charge
    }

    update = async (id_charge: string, charge: Charge) => await this.repository.update(id_charge, charge)

    getPendingCharges = async (): Promise<Charge[]> => {
        const content = await this.findAll()
        return content.filter((charge: Charge) => charge.status === StatusCharge[StatusCharge.Running])
    }

    updateStatusOfCharge = async (id_charge: string, status: string): Promise<void> => {
        let charge = await this.findOne(id_charge)        
        charge.status = status
        await this.update(id_charge, charge)
    }
}