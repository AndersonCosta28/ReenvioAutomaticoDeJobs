import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export default class Job {
    @PrimaryColumn()
    id: string
    @Column()
    id_charge: string

    @Column()
    status: string

    @Column()
    was_sent: boolean

    @Column()
    id_parent: string

    @Column()
    retry: number

    @CreateDateColumn()
    create_at?: Date

    @UpdateDateColumn()
    update_at?: Date
}