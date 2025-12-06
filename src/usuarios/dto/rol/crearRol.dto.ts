import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CrearRolDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}
