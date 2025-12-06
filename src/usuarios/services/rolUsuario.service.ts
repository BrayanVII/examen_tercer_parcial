import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { UsuarioRepository } from '../repositories/usuario.repository';
import { RolRepository } from '../repositories/rol.repository';
import { RolUsuarioRepository } from '../repositories/rolUsuario.repository';

@Injectable()
export class RolUsuarioService {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly rolRepository: RolRepository,
    private readonly rolUsuarioRepository: RolUsuarioRepository,
  ) {}

  findAll() {
    return this.rolUsuarioRepository.find({
      where: { activo: true },
      relations: ['usuario', 'rol'],
    });
  }

  async asignarRol(usuarioId: number, rolId: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: usuarioId, activo: true },
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const rol = await this.rolRepository.findOne({
      where: { id: rolId, activo: true },
    });
    if (!rol) throw new NotFoundException('Rol no encontrado');

    const existe = await this.rolUsuarioRepository.findOne({
      where: { usuario: { id: usuarioId }, rol: { id: rolId }, activo: true },
    });
    if (existe)
      throw new BadRequestException('El usuario ya tiene este rol asignado');

    const rolUsuario = this.rolUsuarioRepository.create({ usuario, rol });
    return this.rolUsuarioRepository.save(rolUsuario);
  }

  // Borrado lógico: desactivar la relación
  async quitarRol(usuarioId: number, rolId: number) {
    const registro = await this.rolUsuarioRepository.findOne({
      where: { usuario: { id: usuarioId }, rol: { id: rolId }, activo: true },
    });
    if (!registro)
      throw new NotFoundException('El rol no está asignado al usuario');

    registro.activo = false;
    return this.rolUsuarioRepository.save(registro);
  }
}
