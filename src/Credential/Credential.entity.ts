import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Credential{
    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    create_at?: Date

}