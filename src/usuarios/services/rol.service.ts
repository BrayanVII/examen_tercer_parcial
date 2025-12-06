import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from '../entities/rol.entity';
import { RolRepository } from '../repositories/rol.repository';

@Injectable()
export class RolService {
  constructor(private readonly rolRepository: RolRepository) {}

  findAll() {
    return this.rolRepository.find({ where: { activo: true } });
  }

  async findOne(id: number) {
    const rol = await this.rolRepository.findOne({
      where: { id, activo: true },
    });
    if (!rol) throw new NotFoundException('Rol no encontrado');
    return rol;
  }

  create(data: any) {
    const rol = this.rolRepository.create(data);
    return this.rolRepository.save(rol);
  }

  async update(id: number, data: any) {
    const rol = await this.findOne(id);
    Object.assign(rol, data);
    return this.rolRepository.save(rol);
  }

  async desactivar(id: number) {
    const rol = await this.findOne(id);
    rol.activo = false;
    return this.rolRepository.save(rol);
  }
}
