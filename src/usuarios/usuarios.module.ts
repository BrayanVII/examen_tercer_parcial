import { Module, forwardRef } from '@nestjs/common'; // 👈 AGREGADO forwardRef
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { Usuario } from './entities/usuario.entity';
import { Rol } from './entities/rol.entity';
import { RolUsuario } from './entities/rolUsuario.entity';

import { UsuarioService } from './services/usuario.service';
import { RolService } from './services/rol.service';
import { RolUsuarioService } from './services/rolUsuario.service';
import { EmailService } from './services/email.service';

import { UsuarioController } from './controllers/usuario.controller';
import { RolController } from './controllers/rol.controller';
import { RolUsuarioController } from './controllers/rolUsuario.controller';

import { UsuarioRepository } from './repositories/usuario.repository';
import { RolRepository } from './repositories/rol.repository';
import { RolUsuarioRepository } from './repositories/rolUsuario.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Rol, RolUsuario]),
    ConfigModule,
  ],
  controllers: [UsuarioController, RolController, RolUsuarioController],
  providers: [
    UsuarioService,
    RolService,
    RolUsuarioService,
    UsuarioRepository,
    RolRepository,
    RolUsuarioRepository,
    EmailService,
  ],
  exports: [
    UsuarioService, 
    RolService, 
    RolUsuarioService, 
    EmailService,
    UsuarioRepository,   // 👈 AGREGADO
    RolRepository,       // 👈 AGREGADO
    RolUsuarioRepository, // 👈 AGREGADO
  ],
})
export class UsuariosModule {}