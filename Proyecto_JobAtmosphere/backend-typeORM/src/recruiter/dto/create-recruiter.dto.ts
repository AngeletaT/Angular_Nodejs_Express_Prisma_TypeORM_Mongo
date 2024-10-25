import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email!: string;  // Añadimos el operador !

    @IsString()
    @IsNotEmpty()
    username!: string;  // Añadimos el operador !

    @IsString()
    @MinLength(6)
    password!: string;  // Añadimos el operador !
}