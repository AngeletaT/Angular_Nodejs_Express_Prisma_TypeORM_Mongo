import { NextFunction, Request, Response } from 'express';
import { validate } from 'class-validator';
import { UserService } from './recruiter.service';
import { AuthService } from '../utils/auth.service';
import { CreateUserDto } from './dto/create-recruiter.dto';
import { LoginUserDto } from './dto/login-recruiter.dto';
import axios from 'axios';
import { UpdateRecruiterDto } from './dto/update-recruiter.dto';

export class UserController {
    private userService: UserService;
    private authService: AuthService;

    constructor() {
        this.userService = new UserService();
        this.authService = new AuthService();
    }

    // Registro de usuarios
    async register(req: Request, res: Response) {
        const createUserDto = new CreateUserDto();
        Object.assign(createUserDto, req.body);

        // Asignar la URL de la imagen antes de la validación
        createUserDto.image = `https://i.pravatar.cc/150?u=${createUserDto.username}`;

        const errors = await validate(createUserDto);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        try {
            const user = await this.userService.createUser({
                email: createUserDto.email,
                username: createUserDto.username,
                password: createUserDto.password,
                image: createUserDto.image,
                roles: ['recruiter'],
                busy: false,
                jobs: []
            });
            return res.status(201).json({
                message: 'User registered successfully'
            });

        } catch (error) {
            return res.status(400).json({ message: (error as Error).message });
        }
    }

    // Inicio de sesión (login)
    async login(req: Request, res: Response) {
        const loginUserDto = new LoginUserDto();
        Object.assign(loginUserDto, req.body);

        const errors = await validate(loginUserDto);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        try {
            const user = await this.userService.findUserByEmail(loginUserDto.email);
            if (!user) {
                return res.status(400).json({ message: 'Reclutador no encontrado' });
            }

            const isValidPassword = await this.userService.validatePassword(user, loginUserDto.password);
            if (!isValidPassword) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            const token = this.authService.generateAccessToken(user);
            return res.status(200).json({ token });

        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getCurrentRecruiter(req: Request, res: Response, next: NextFunction) {
        const email = (req as Request & { email: string }).email;

        if (!email) {
            return res.status(400).json({ message: 'Email not found in token' });
        }

        try {
            const user = await this.userService.findUserByEmail(email);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // console.log('datos de user:', {user});
            return res.status(200).json({ user });
        } catch (error) {
            return res.status(500).json({ message: 'Error retrieving user profile' });
        }
    }
    async getJobs(req: Request, res: Response, next: NextFunction) {
        const email = (req as Request & { email: string }).email;

        if (!email) {
            return res.status(400).json({ message: 'Email not found in token' });
        }

        try {
            // Verificar si el usuario existe y es un recruiter con trabajos asociados
            const user = await this.userService.findUserByEmail(email);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Asegurarse de que el usuario tiene el campo `jobs` con al menos un trabajo
            if (!user.jobs || user.jobs.length === 0) {
                return res.status(404).json({ message: 'No jobs found for this recruiter' });
            }

            // Llamar al servidor Mongoose para obtener detalles de cada trabajo en `user.jobs`
            const jobDetails = await Promise.all(
                user.jobs.map(async (jobId: string) => {
                    try {
                        const mongooseUrl = `http://localhost:3000/job/${jobId}`;
                        const response = await axios.get(mongooseUrl);
                        return response.data; // Devuelve los datos del trabajo
                    } catch (error) {
                        console.error(`Error fetching job ${jobId}:`, (error as any).message);
                        return null; // Manejo de errores para trabajos que no se pudieron obtener
                    }
                })
            );

            // Filtrar trabajos nulos (si alguno falló en obtenerse)
            const validJobs = jobDetails.filter(job => job !== null);

            return res.status(200).json({ jobs: validJobs });
        } catch (error) {
            console.error("Error retrieving jobs for recruiter:", error);
            return res.status(500).json({ message: 'Error retrieving job details', error: (error as Error).message });
        }
    }
    async updateRecruiter(req: Request, res: Response, next: NextFunction) {
        Object.assign(UpdateRecruiterDto, req.body);
        const email = (req as Request & { email: string }).email;
        let { busy, image } = req.body;
    
        if (!email) {
            return res.status(400).json({ message: 'Email not found in token' });
        }
    
        try {
            const user = await this.userService.findUserByEmail(email);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            // Convertir el valor de busy a booleano si es una cadena
            if (typeof busy === 'string') {
                busy = busy.toLowerCase() === 'true';
            }
    
            user.busy = busy !== undefined ? busy : user.busy;
            user.image = image || user.image;
    
            await this.userService.updateUser(user);
            return res.status(200).json({ message: 'User updated successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error updating user', error: (error as Error).message });
        }
    }
}