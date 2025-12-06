import { Controller, Get } from '@nestjs/common';
import { RolUsuarioService } from '../services/rolUsuario.service';

@Controller('roles-usuarios')
export class RolUsuarioController {
  constructor(private readonly service: RolUsuarioService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
