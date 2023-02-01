import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Params } from "./Job.commom";

@Entity()
export default class Job {
    @PrimaryColumn()
    job_id: string
    
    @Column()
    id_charge: string

    @Column({ default: "queue" })
    status: string

    @Column({ default: false })
    was_sent: boolean

    @Column({ default: "" })
    parent_id: string

    @Column({ default: 2 })
    retries: number

    @Column({ default: false })
    isInvalidCredential: boolean

    @Column({ default: "" })
    credential_id: string

    @Column('json')
    params: Params

    @Column({nullable: true})
    errors: string

    @CreateDateColumn()
    create_at?: Date

    @UpdateDateColumn()
    update_at?: Date
}