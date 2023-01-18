import { existsSync, readFileSync, writeFileSync } from 'fs'
import { v4 as uuid4 } from 'uuid'
export type Charge = {
    id: string,
    status: string
}
export enum StatusCharge { Running, Done }

const chargePath = "./charges.json"

//#region Charge_File
export const createCharge = (): Charge => {
    const newCharge = { id: uuid4(), status: StatusCharge[StatusCharge.Running]}
    if (!existsSync(chargePath)){
        const content = JSON.stringify([{...newCharge}])
        writeFileSync(chargePath, content)
    }
    else {
        const content = readFileCharge()
        content.push({...newCharge})
        writeFileSync(chargePath, JSON.stringify(content))
    }
    return newCharge
}

const readFileCharge = ():Charge[] => JSON.parse(readFileSync(chargePath).toString())

//#endregion

//#region Handle Charge
    export const getPendingCharges = (): Charge[] => {
        const content = readFileCharge()
        return content.filter((charge: Charge) => charge.status === StatusCharge[StatusCharge.Running])
    }

    export const updateChargeToDone = (id_charge: string): void => {
        let content = readFileCharge()
        content = content.map((charge: Charge) => {
            if (charge.id === id_charge)
                charge.status = StatusCharge[StatusCharge.Done]
            return charge
        })
        writeFileSync(chargePath, JSON.stringify(content))
    }
//#endregion