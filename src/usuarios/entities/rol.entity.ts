import { Entity, Column, OneToMany } from 'typeorm';
import { Auditoria } from '../../comun/auditoria.entity';
import { RolUsuario } from '../entities/rolUsuario.entity';

@Entity()
export class Rol extends Auditoria {
  @Column({ length: 50, unique: true })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @OneToMany(() => RolUsuario, (usuarioRol) => usuarioRol.rol)
  usuarios: RolUsuario[];
}
