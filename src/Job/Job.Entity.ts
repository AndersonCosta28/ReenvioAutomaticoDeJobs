import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export default class Job {
    @PrimaryColumn()
    id: string
    
    @Column()
    id_charge: string

    @Column({ default: "queue" })
    status: string

    @Column({ default: false })
    was_sent: boolean

    @Column({ default: "" })
    id_parent: string

    @Column({ default: 2 })
    retries: number

    @Column({ default: false })
    isInvalidCredential: boolean

    @CreateDateColumn()
    create_at?: Date

    @UpdateDateColumn()
    update_at?: Date
}