import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private dataSource: DataSource,
    private jwtService: JwtService,
  ) {}

  async validateUser(correo: string, contrasena: string): Promise<Usuario> {
    const usuarioRepo = this.dataSource.getRepository(Usuario);

    const usuario = await usuarioRepo.findOne({
      where: { correo },
      relations: ['roles', 'roles.rol'],
    });

    if (!usuario) {
      throw new UnauthorizedException('Correo no encontrado');
    }

    const passwordMatch = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!passwordMatch) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    return usuario;
  }

  async login(user: any) {
    const roles = user.roles?.map((r) => r.rol.nombre) || [];

    const payload = {
      id: user.id,
      correo: user.correo,
      roles,
    };

    return {
      token: this.jwtService.sign(payload),
      usuario: {
        id: user.id,
        correo: user.correo,
        nombre: user.nombre,
        apellidoPaterno: user.apellidoPaterno,
        apellidoMaterno: user.apellidoMaterno,
        roles,
      },
    };
  }
}