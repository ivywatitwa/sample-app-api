import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ name: 'users'})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    middleName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;
}
