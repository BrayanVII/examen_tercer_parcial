import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { UsuarioRepository } from '../repositories/usuario.repository';
import { RolRepository } from '../repositories/rol.repository';
import { RolUsuarioRepository } from '../repositories/rolUsuario.repository';
import { CreateUsuarioDto } from '../dto/usuarios/crearUsuario.dto';
import { EmailService } from '../services/email.service';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly rolRepository: RolRepository,
    private readonly rolUsuarioRepository: RolUsuarioRepository,
    private readonly emailService: EmailService, // ya no se usa, pero se mantiene la inyección
  ) {}

  // Obtener todos los usuarios activos
  findAll() {
    return this.usuarioRepository.find({
      where: { activo: true },
      relations: ['roles', 'roles.rol'],
    });
  }

  // Obtener un usuario por ID
  async findOne(id: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id, activo: true },
      relations: ['roles', 'roles.rol'],
    });

    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  // Buscar por correo
  async findByCorreo(correo: string) {
    return this.usuarioRepository.findOne({
      where: { correo, activo: true },
      relations: ['roles', 'roles.rol'],
    });
  }

  // Buscar por token (ya no se usa, pero se deja por compatibilidad)
  

  // Verificar usuario (ya no se usa)
  
  // Verificar si el correo ya existe
  async checkEmailExists(correo: string): Promise<boolean> {
    const usuario = await this.usuarioRepository.findOne({
      where: { correo },
    });
    return !!usuario;
  }

  // Crear usuario (sin verificación de correo)
  async create(data: CreateUsuarioDto) {
    const { rolesIds, ...rest } = data;

    // Validar que no exista un correo duplicado
    const emailExiste = await this.checkEmailExists(data.correo);
    if (emailExiste) {
      throw new ConflictException('El correo ya está registrado');
    }

    const usuario = this.usuarioRepository.create(rest);

    // ⚡ VERIFICACIÓN DESACTIVADA

    await this.usuarioRepository.save(usuario);

    // Asignar roles enviados, o asignar rol "usuario" por defecto
    if (rolesIds && rolesIds.length > 0) {
      for (const rolId of rolesIds) {
        await this.asignarRol(usuario.id, rolId);
      }
    } else {
      const rolUsuario = await this.rolRepository.findOne({
        where: { nombre: 'usuario', activo: true },
      });

      if (rolUsuario) {
        await this.asignarRol(usuario.id, rolUsuario.id);
      }
    }

    // ⚡ ENVÍO DE CORREO DESACTIVADO
    // await this.emailService.sendVerificationCode(usuario.correo, codigo);

    return this.findOne(usuario.id);
  }

  // Actualizar usuario completo
  async update(id: number, data: any) {
    const usuario = await this.findOne(id);

    const { rolesAgregarIds, rolesQuitarIds, ...rest } = data;

    Object.assign(usuario, rest);
    await this.usuarioRepository.save(usuario);

    if (rolesAgregarIds && rolesAgregarIds.length > 0) {
      for (const rolId of rolesAgregarIds) {
        await this.asignarRol(usuario.id, rolId);
      }
    }

    if (rolesQuitarIds && rolesQuitarIds.length > 0) {
      for (const rolId of rolesQuitarIds) {
        await this.quitarRol(usuario.id, rolId);
      }
    }

    return this.findOne(usuario.id);
  }

  // Actualización parcial
  async partialUpdate(id: number, data: any) {
    return this.update(id, data);
  }

  // Desactivar usuario
  async desactivar(id: number) {
    const usuario = await this.findOne(id);
    usuario.activo = false;
    return this.usuarioRepository.save(usuario);
  }

  // Asignar rol
  async asignarRol(usuarioId: number, rolId: number) {
    const usuario = await this.findOne(usuarioId);

    const rol = await this.rolRepository.findOne({
      where: { id: rolId, activo: true },
    });
    if (!rol) throw new NotFoundException('Rol no encontrado');

    const existe = await this.rolUsuarioRepository.findOne({
      where: { usuario: { id: usuarioId }, rol: { id: rolId }, activo: true },
    });

    if (existe)
      throw new BadRequestException('El usuario ya tiene este rol asignado');

    const rolUsuario = this.rolUsuarioRepository.create({
      usuario,
      rol,
      activo: true,
    });

    return this.rolUsuarioRepository.save(rolUsuario);
  }

  // Quitar rol
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
