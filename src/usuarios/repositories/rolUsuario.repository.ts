import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RolUsuario } from '../entities/rolUsuario.entity';

@Injectable()
export class RolUsuarioRepository extends Repository<RolUsuario> {
  constructor(private dataSource: DataSource) {
    super(RolUsuario, dataSource.createEntityManager());
  }
}
