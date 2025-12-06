import { Entity, ManyToOne, Unique } from 'typeorm';
import { Auditoria } from '../../comun/auditoria.entity';
import { Usuario } from '../entities/usuario.entity';
import { Rol } from '../entities/rol.entity';

@Entity()
@Unique(['usuario', 'rol'])
export class RolUsuario extends Auditoria {
  @ManyToOne(() => Usuario, (usuario) => usuario.roles, { onDelete: 'CASCADE' })
  usuario: Usuario;

  @ManyToOne(() => Rol, (rol) => rol.usuarios, { onDelete: 'CASCADE' })
  rol: Rol;
}
