import { IsBoolean, IsString } from 'class-validator';

export class UpdateRecruiterDto {

    @IsString()
    image?: string;

    @IsBoolean()
    busy!: boolean;
}