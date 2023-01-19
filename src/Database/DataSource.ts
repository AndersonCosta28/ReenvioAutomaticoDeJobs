import { DataSource } from "typeorm"
import Charge from "../Charge/Charge.Entity"
import Job from "../Job/Job.Entity"

const AppDataSource = new DataSource({
    type: "sqlite",            
    database: "db.sql",
    synchronize: true,
    entities: [Charge, Job]
})

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })

export default AppDataSource