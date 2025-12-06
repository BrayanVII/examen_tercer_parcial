import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from '../../dto/usuarios/crearUsuario.dto';

export class ActualizarUsuarioDto extends PartialType(CreateUsuarioDto) {}
