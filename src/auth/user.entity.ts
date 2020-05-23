import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { Task } from '../tasks/task.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @OneToMany(type => Task, task => task.user, { eager: true})
    tasks: Task[];

    async validatePassword(password: string) : Promise<boolean> {
        return bcrypt.compareSync(password, this.password); 
    }
}