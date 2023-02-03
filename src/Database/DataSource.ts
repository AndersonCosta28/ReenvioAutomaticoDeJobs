import { DataSource } from "typeorm"
import Charge from "../Charge/Charge.Entity"
import Job from "../Job/Job.Entity"
import Credential from "../Credential/Credential.entity"

const AppDataSource = new DataSource({
    type: "mysql",            
    database: "local",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "1234",
    synchronize: true,
    entities: [Charge, Job, Credential]
})

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })

export default AppDataSource