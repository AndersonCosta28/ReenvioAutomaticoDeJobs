import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export default class Charge {
    @PrimaryColumn()
    id: string

    @Column()
    status: string
}