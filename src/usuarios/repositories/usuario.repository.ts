import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class UsuarioRepository extends Repository<Usuario> {
  constructor(private dataSource: DataSource) {
    super(Usuario, dataSource.createEntityManager());
  }

  async findByEmail(correo: string) {
    return this.findOne({ where: { correo } });
  }
}
