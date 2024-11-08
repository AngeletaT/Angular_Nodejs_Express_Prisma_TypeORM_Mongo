import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';
import { IsEmail } from 'class-validator';
import * as argon2 from 'argon2';

@Entity('Recruiter')
export class User {
    @ObjectIdColumn()
    id!: ObjectId;

    @Column()
    email!: string;

    @Column()
    image?: string;

    @Column()
    username!: string;

    @Column()
    password!: string;

    @Column()
    roles: string[] = [];

    @Column({ default: false })
    busy?: boolean;

    @Column('simple-array')
    jobs?: string[];

    // Método para encriptar la contraseña con Argon2
    async hashPassword() {
        this.password = await argon2.hash(this.password);
    }

    // Método para verificar la contraseña
    async validatePassword(unencryptedPassword: string) {
        return await argon2.verify(this.password, unencryptedPassword);
    }
}