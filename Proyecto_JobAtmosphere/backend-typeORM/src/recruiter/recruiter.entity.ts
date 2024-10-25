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
    username!: string;

    @Column()
    password!: string;

    @Column()
    roles: string[] = [];

    @Column({ default: false })
    busy?: boolean;

    @Column('simple-array')  // Definir 'jobs' como un array de strings o el tipo adecuado
    jobs?: string[];  // Aquí definimos el campo jobs como un array de strings

    // Método para encriptar la contraseña con Argon2
    async hashPassword() {
        this.password = await argon2.hash(this.password);
    }

    // Método para verificar la contraseña
    async validatePassword(unencryptedPassword: string) {
        return await argon2.verify(this.password, unencryptedPassword);
    }
}