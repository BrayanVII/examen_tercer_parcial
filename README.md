# 🔄 TRUEQUES BOLIVIA - BACKEND

##  Descripción

Backend de la plataforma **Trueques Bolivia**, una API RESTful robusta desarrollada con NestJS que gestiona toda la lógica de negocio, autenticación, base de datos y servicios del sistema de trueques.

## Tecnologías Principales

- **NestJS** - Framework progresivo de Node.js
- **TypeScript** - Lenguaje de programación tipado
- **TypeORM** - ORM para gestión de base de datos
- **MySQL** - Sistema de gestión de base de datos
- **JWT** - Autenticación basada en tokens
- **Bcrypt** - Encriptación de contraseñas
- **Jest** - Framework de testing

##  Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** 
- **PNPM** 
- **MySQL** 
- **Git** 

## Instalación y Configuración

### 1. Clonar el repositorio

git clone https://github.com/tu-usuario/trueques-bolivia-backend.git
cd trueques-bolivia-backend

### 2. Instalar dependencias

pnpm install

### 3. Configurar la base de datos MySQL

#### Crear la base de datos

Abre MySQL y ejecuta:

CREATE DATABASE proyecto_trueque;

#### Verificar la conexión

Asegúrate de que MySQL esté corriendo en el puerto **3306** puerto por defecto.

### 4. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:
env
# Configuración de Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_contraseña
DB_DATABASE=proyecto_trueque

# Configuración del Servidor
PORT=3000
NODE_ENV=development

**Nota de Seguridad**: El valor `NODE_TLS_REJECT_UNAUTHORIZED=0` deshabilita la verificación de certificados SSL. Solo usar en desarrollo local.

## Dependencias del Proyecto

### Dependencias Principales

#### NestJS Core
pnpm install @nestjs/common @nestjs/core @nestjs/platform-express

- **@nestjs/comun**: Decoradores y utilidades comunes
- **@nestjs/core**: Núcleo del framework
- **@nestjs/platform-express**: Adaptador para Express

#### TypeORM y Base de Datos
pnpm install @nestjs/typeorm typeorm mysql2

- **@nestjs/typeorm**: Integración de TypeORM con NestJS
- **typeorm**: ORM para gestión de base de datos
- **mysql2**: Driver de MySQL

#### Autenticación y Seguridad
pnpm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
pnpm install -D @types/bcrypt @types/passport-jwt

- **@nestjs/jwt**: Manejo de tokens JWT
- **bcrypt**: Encriptación de contraseñas
- **passport**: Framework de autenticación

#### Configuración

pnpm install @nestjs/config dotenv

- **@nestjs/config**: Gestión de variables de entorno
- **dotenv**: Carga de archivos .env

#### Validación

pnpm install class-validator class-transformer

- **class-validator**: Validación de DTOs
- **class-transformer**: Transformación de objetos

### Dependencias de Desarrollo

pnpm install -D @nestjs/cli @nestjs/schematics @nestjs/testing
pnpm install -D typescript @types/node @types/express
pnpm install -D jest @types/jest ts-jest
pnpm install -D eslint prettier

## Comandos Disponibles

### Iniciar el Servidor

#### Modo Desarrollo

pnpm run setup

El servidor se iniciará en `http://localhost:3000`


## Estructura del Proyecto

trueque_backend/
├── src/
│   ├── comun/                    # Elementos compartidos
│   │   └── auditoria.entity.ts   # Entidad base con auditoría
│   ├── usuarios/                 # Módulo de usuarios
│   │   ├── controllers/          # Controladores
│   │   │   ├── auth.controller.ts
│   │   │   ├── usuario.controller.ts
│   │   │   ├── rol.controller.ts
│   │   │   └── rolUsuario.controller.ts
│   │   ├── dto/                  # DTOs de usuarios y roles
│   │   ├── entities/             # Entidades de BD
│   │   ├── repositories/         # Repositorios
│   │   ├── services/             # Servicios
│   │   │   ├── auth.service.ts
│   │   │   ├── usuario.service.ts
│   │   │   ├── email.service.ts
│   │   │   ├── rol.service.ts
│   │   │   └── rolUsuario.service.ts
│   │   ├── auth.module.ts
│   │   └── usuarios.module.ts
│   ├── app.module.ts             # Módulo raíz
│   └── main.ts                   # Punto de entrada
├── test/                         # Tests e2e
├── conexionBaseDeDatos.ts        # Configuración TypeORM
├── .env.example                  # Ejemplo de variables de entorno
├── .env                          # Variables de entorno (no subir a git)
├── nest-cli.json                 # Configuración NestJS CLI
├── package.json                  # Dependencias
├── pnpm-lock.yaml               # Lock file de PNPM
└── tsconfig.json                # Configuración TypeScript


## Configuración de la Base de Datos

### Archivo: `conexionBaseDeDatos.ts`
```typescript
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true, 
  logging: false,
};

```
**Importante**: `synchronize: true` solo debe usarse en desarrollo. En producción usar migraciones.

## Sistema de Autenticación

### Flujo de Autenticación

1. **Registro de Usuario** → `POST /usuarios`
   - Validación de datos con DTOs
   - Encriptación de contraseña con bcrypt
   - Generación de token de verificación
   - Almacenamiento en base de datos

2. **Inicio de Sesión** → `POST /auth/login`
   - Validación de credenciales
   - Verificación de contraseña
   - Generación de token JWT
   - Retorno de token al cliente

3. **Verificación de Token**
   - Middleware valida token en cada petición protegida
   - Extrae información del usuario
   - Verifica permisos según roles


## Endpoints Disponibles

### Autenticación

POST   /auth/login              - Iniciar sesión

### Usuarios
GET    /usuarios                - Listar todos los usuarios
GET    /usuarios/:id            - Obtener usuario por ID
POST   /usuarios                - Crear nuevo usuario
PUT    /usuarios/:id            - Actualizar usuario completo
PATCH  /usuarios/:id            - Actualizar usuario parcial
GET    /usuarios/check-email    - Verificar email disponible

### Roles

GET    /roles                   - Listar roles
GET    /roles/:id               - Obtener rol por ID
POST   /roles                   - Crear nuevo rol
PUT    /roles/:id               - Actualizar rol


### Asignación de Roles

GET    /roles-usuarios          - Listar asignaciones
POST   /usuarios/:id/roles/:rolId        - Asignar rol a usuario
PATCH  /usuarios/:id/roles/:rolId/quitar - Quitar rol de usuario


## Manejo de Errores Comunes

### Error: "Unknown database 'proyecto_trueque'"

**Solución**:

CREATE DATABASE proyecto_trueque;

### Error: "Duplicate entry for key 'usuario.IDX_...'"

**Causa**: Intentar registrar un email que ya existe

**Solución**: El sistema ya valida emails duplicados. Si ocurre, verificar la lógica de validación en `usuario.service.ts`

### Error: "self-signed certificate in certificate chain"

**Solución**: Agregar a `.env`:

NODE_TLS_REJECT_UNAUTHORIZED=0

**Nota**: Solo usar en desarrollo local

### Error: "Cannot find module @nest/common"

**Corrección**: El paquete correcto es `@nestjs/common` (con "js")

pnpm install @nestjs/common

## Arquitectura en Capas

  Cliente 
        ↓
   CONTROLLER -> Recibe petición HTTP
        ↓
   DTO -> Valida y transforma datos
        ↓
   SERVICE -> lógica de negocio
        ↓
   REPOSITORY -> Consultas a base de datos
        ↓
   ENTITY -> Modelo de datos
        ↓
   Base de Datos MySQL


## Verificación de Instalación Exitosa

Cuando el servidor inicie correctamente, verás:

[Nest] LOG [NestFactory] Starting Nest application...
[Nest] LOG [InstanceLoader] AppModule dependencies initialized
[Nest] LOG [InstanceLoader] TypeOrmCoreModule dependencies initialized
[Nest] LOG [InstanceLoader] AuthModule dependencies initialized
[Nest] LOG [InstanceLoader] UsuariosModule dependencies initialized
[Nest] LOG [RoutesResolver] UsuarioController {/usuarios}
[Nest] LOG [RouterExplorer] Mapped {/usuarios, GET} route
[Nest] LOG [RoutesResolver] AuthController {/auth}
[Nest] LOG [RouterExplorer] Mapped {/auth/login, POST} route
[Nest] LOG [NestApplication] Nest application successfully started
Servidor corriendo en http://localhost:3000

## Seguridad

### Prácticas Implementadas

-  Contraseñas encriptadas con bcrypt
-  Autenticación JWT con tokens firmados
-  Validación de datos con class-validator
-  Sanitización de inputs
-  Índices únicos en base de datos 
-  Campos de auditoría, fechaCreacion, fechaActualizacion.

##  Debugging

### Ver logs detallados de TypeORM

En `conexionBaseDeDatos.ts`:
logging: true,

### Ver todas las consultas SQL

logging: ['query', 'error', 'schema'],

##  Monitoreo

El servidor registra:
- Todas las rutas mapeadas al iniciar
- Conexión exitosa a base de datos
- Errores de autenticación
- Intentos de operaciones duplicadas

## Licencia

Este proyecto es parte de un trabajo académico de desarrollo de software.

## Contacto

Para dudas o sugerencias sobre el backend:
- **Proyecto**: Trueques Bolivia
- **Repositorio**: [GitHub](https://github.com/tu-usuario/trueques-bolivia-backend)

##  Agradecimientos

- Comunidad de NestJS
- Documentación de TypeORM
- Equipo de desarrollo de MySQL
- Contributors de PNPM

**Desarrollado en Bolivia**