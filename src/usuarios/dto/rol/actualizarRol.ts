import { PartialType } from '@nestjs/mapped-types';
import { CrearRolDto } from '../../dto/rol/crearRol.dto';
export class ActualizarRol extends PartialType(CrearRolDto) {}
