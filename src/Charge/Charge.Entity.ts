import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm"

@Entity()
export default class Charge {
    @PrimaryColumn()
    id: string

    @Column()
    status: string

    @CreateDateColumn()
    create_at?: Date

    @UpdateDateColumn()
    update_at?: Date
}