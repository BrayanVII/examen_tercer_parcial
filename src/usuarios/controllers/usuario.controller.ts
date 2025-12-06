import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query, // 👈 AGREGADO
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsuarioService } from '../services/usuario.service';
import { CreateUsuarioDto } from '../dto/usuarios/crearUsuario.dto';
import { ActualizarUsuarioDto } from '../dto/usuarios/actualizarUsuario.dto';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  
  // 👇 NUEVO: Endpoint para verificar si un correo ya existe
  @Get('check-email')
  async checkEmail(@Query('correo') correo: string) {
    if (!correo) {
      throw new BadRequestException('El correo es requerido');
    }
    
    const exists = await this.usuarioService.checkEmailExists(correo);
    return { exists };
  }

  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usuarioService.findOne(id);
  }

  @Post()
  create(@Body() crearUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(crearUsuarioDto);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() actualizarUsuarioAllDto: ActualizarUsuarioDto,
  ) {
    return this.usuarioService.update(id, actualizarUsuarioAllDto);
  }

  @Patch(':id')
  partialUpdate(
    @Param('id') id: number,
    @Body() actualizarUsuarioOneDto: ActualizarUsuarioDto,
  ) {
    return this.usuarioService.partialUpdate(id, actualizarUsuarioOneDto);
  }

  @Post(':id/roles/:rolId')
  asignarRol(@Param('id') usuarioId: number, @Param('rolId') rolId: number) {
    return this.usuarioService.asignarRol(usuarioId, rolId);
  }

  @Patch(':id/roles/:rolId/quitar')
  quitarRol(@Param('id') usuarioId: number, @Param('rolId') rolId: number) {
    return this.usuarioService.quitarRol(usuarioId, rolId);
  }
}