import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Params } from "./Job.commom";
import Charge from "../Charge/Charge.Entity";
import Credential from "../Credential/Credential.entity";

@Entity()
export default class Job {
    @PrimaryColumn()
    job_id: string

    @ManyToOne(() => Charge, charge => charge.id)
    charge: Charge

    @Column({ default: "queued" })
    status: string

    @Column({ default: false })
    was_sent: boolean

    @Column({ nullable: true })
    parent_id: string

    @Column({ default: 1 })
    retries: number

    @Column({ default: false })
    isInvalidCredential: boolean

    @ManyToOne(() => Credential, credential => credential.id)
    credential: Credential

    @Column('json', { nullable: true })
    params: Params

    @Column({ nullable: true })
    errors?: string

    @Column({ nullable: true })
    jobFromSplited?: string

    @Column({ nullable: true })
    numberOfDays?: number

    @CreateDateColumn()
    create_at?: Date

    @UpdateDateColumn()
    update_at?: Date
}