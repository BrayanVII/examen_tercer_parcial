import { Module, forwardRef } from '@nestjs/common'; // 👈 AGREGADO forwardRef
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsuariosModule } from './usuarios.module'; // 👈 Importar de vuelta

import { Usuario } from './entities/usuario.entity';
import { RolUsuario } from './entities/rolUsuario.entity';
import { Rol } from './entities/rol.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, RolUsuario, Rol]),
    forwardRef(() => UsuariosModule), // 👈 USAR forwardRef para evitar dependencia circular
    
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'JWT_SECRETO',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}