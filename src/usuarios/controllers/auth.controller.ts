import { 
  Controller, 
  Post, 
  Get,
  Body, 
  Query,
  UnauthorizedException 
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UsuarioService } from '../services/usuario.service'; // 👈 AGREGADO
import { LoginDto } from '../dto/usuarios/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService, // 👈 AGREGADO
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const usuario = await this.authService.validateUser(
      loginDto.correo,
      loginDto.contrasena,
    );

    if (!usuario) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    return this.authService.login(usuario);
  }

  // 👇 NUEVO: Endpoint para verificar si un correo ya existe
  @Get('check-email')
  async checkEmail(@Query('correo') correo: string) {
    const exists = await this.usuarioService.checkEmailExists(correo);
    return { exists };
  }
}