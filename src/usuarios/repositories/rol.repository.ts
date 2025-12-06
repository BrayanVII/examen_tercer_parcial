import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Rol } from '../entities/rol.entity';

@Injectable()
export class RolRepository extends Repository<Rol> {
  constructor(private dataSource: DataSource) {
    super(Rol, dataSource.createEntityManager());
  }
}
