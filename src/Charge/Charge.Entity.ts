import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm"

@Entity()
export default class Charge {
    @PrimaryColumn()
    id: string

    @Column({ default: "running" })
    status: string

    @Column()
    credential_id: string

    @CreateDateColumn()
    create_at?: Date

    @UpdateDateColumn()
    update_at?: Date
}