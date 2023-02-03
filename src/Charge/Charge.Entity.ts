import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm"
import Credential from "../Credential/Credential.entity"

@Entity()
export default class Charge {
    @PrimaryColumn()
    id: string

    @Column({ default: "running" })
    status: string

    @OneToOne(() => Credential, credential => credential.id)
    @JoinColumn()
    credential: Credential

    @CreateDateColumn()
    create_at?: Date

    @UpdateDateColumn()
    update_at?: Date
}