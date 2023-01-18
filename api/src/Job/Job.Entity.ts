import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

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
}