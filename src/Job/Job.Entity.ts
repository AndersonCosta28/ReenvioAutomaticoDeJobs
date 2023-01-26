import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export default class Job {
    @PrimaryColumn()
    id: string
    
    @Column()
    id_charge: string

    @Column({ default: "Queue" })
    status: string

    @Column({ default: false })
    was_sent: boolean

    @Column({ default: "" })
    id_parent: string

    @Column({ default: 0 })
    retry: number

    @CreateDateColumn()
    create_at?: Date

    @UpdateDateColumn()
    update_at?: Date
}