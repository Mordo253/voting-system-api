# Sistema de Votaciones - API RESTful

API RESTful robusta para gestión de un sistema de votaciones con garantías de integridad transaccional, desarrollada con Node.js, TypeScript, Express, Prisma y PostgreSQL (Supabase).

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-black?logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.7-teal?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)](https://www.postgresql.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Powered-green?logo=supabase)](https://supabase.com/)

---

## Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#️-tecnologías)
- [Arquitectura](#️-arquitectura)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#️-configuración)
- [Uso](#-uso)
- [Autenticación JWT](#-autenticación-jwt)
- [Endpoints](#-endpoints)
- [Reglas de Negocio](#-reglas-de-negocio)
- [Decisiones de Diseño](#-decisiones-de-diseño)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Testing](#-testing)
- [Producción](#-producción)
- [Mejoras Futuras](#-mejoras-futuras)
- [Autor](#-autor)

---

## Características

### **Funcionalidades Core**
-**Gestión de Votantes**: CRUD completo con validación de email único
-**Gestión de Candidatos**: CRUD completo con nombres únicos y partidos políticos
-**Sistema de Votación**: Emisión de votos con transacciones ACID
-**Estadísticas en Tiempo Real**: Cálculo de resultados, porcentajes y participación
-**Autenticación JWT**: Sistema de registro y login con tokens
-**Endpoints Protegidos**: Emisión de votos requiere autenticación
-**Validación Multi-Capa**: DTOs (class-validator) + Service + Database constraints
-**Paginación Cursor-Based**: Eficiente para grandes volúmenes de datos

### **Aspectos Técnicos**
-**Transacciones ACID**: Garantía de integridad en emisión de votos (3 tablas simultáneas)
-**Type-Safe**: TypeScript strict mode + Prisma Client generado
-**Arquitectura en Capas**: Controller → Service → Repository
-**Documentación Interactiva**: Swagger/OpenAPI 3.0 con autenticación
-**Manejo de Errores Centralizado**: Respuestas consistentes
-**Logging Estructurado**: Winston para desarrollo y producción
-**Seguridad**: Helmet, CORS, Rate Limiting, JWT
-**Hot Reload**: Desarrollo ágil con ts-node-dev

---

## Tecnologías

### **Backend Core**
- **Node.js 18+**: Runtime de JavaScript
- **TypeScript 5.3**: Tipado estático y mejor DX
- **Express 4.18**: Framework web minimalista

### **Base de Datos**
- **PostgreSQL 15**: Base de datos relacional
- **Supabase**: PostgreSQL administrado en la nube
- **Prisma 5.7**: ORM type-safe con migraciones automáticas

### **Validación y Seguridad**
- **class-validator**: Validación de DTOs con decoradores
- **class-transformer**: Transformación de objetos
- **jsonwebtoken**: Autenticación JWT
- **bcrypt**: Hashing de passwords
- **Helmet**: Headers de seguridad HTTP
- **express-rate-limit**: Protección contra abuso

### **Documentación y Logging**
- **Swagger (OpenAPI 3.0)**: Documentación interactiva
- **Winston**: Sistema de logging estructurado
- **Morgan**: HTTP request logger

### **Desarrollo**
- **ESLint + Prettier**: Code quality y formato
- **ts-node-dev**: Hot reload en desarrollo

---

## Arquitectura

### **Patrón: Layered Architecture (Arquitectura en Capas)**
```
┌─────────────────────────────────────────────┐
│             Cliente (Postman, Frontend)      │
└─────────────────┬───────────────────────────┘
                  │ HTTP Request
                  ▼
┌─────────────────────────────────────────────┐
│          Express Middleware Layer           │
│  CORS │ Helmet │ Rate Limit │ Validation   │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│          Controller Layer                   │
│  • Maneja HTTP requests/responses          │
│  • Valida DTOs                             │
│  • No contiene lógica de negocio           │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│          Service Layer                      │
│  • Lógica de negocio                       │
│  • Validaciones complejas                  │
│  • Orquestación de repositorios            │
│  • Manejo de transacciones                 │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│          Repository Layer                   │
│  • Acceso a datos (Prisma)                 │
│  • Queries a base de datos                 │
│  • Abstracción del ORM                     │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│       Prisma Client → PostgreSQL            │
│              (Supabase)                     │
└─────────────────────────────────────────────┘
```

### **Estructura de Directorios**
```
voting-system-api/
├── prisma/
│   ├── schema.prisma          # Modelo de datos
│   ├── migrations/            # Historial de migraciones
│   └── seed.ts                # Datos de prueba
│
├── src/
│   ├── config/                # Configuraciones
│   │   ├── database.ts        # Cliente Prisma singleton
│   │   ├── env.ts             # Validación variables entorno
│   │   └── swagger.ts         # Config Swagger/OpenAPI
│   │
│   ├── middleware/            # Middlewares Express
│   │   ├── errorHandler.ts   # Manejo global de errores
│   │   └── auth.ts            # Autenticación JWT
│   │
│   ├── modules/               # Módulos por entidad
│   │   ├── voters/
│   │   │   ├── voter.controller.ts
│   │   │   ├── voter.service.ts
│   │   │   ├── voter.repository.ts
│   │   │   ├── voter.dto.ts
│   │   │   ├── voter.routes.ts
│   │   │   └── voter.types.ts
│   │   ├── candidates/
│   │   │   └── (misma estructura)
│   │   ├── votes/
│   │   │   └── (misma estructura)
│   │   └── auth/
│   │       ├── auth.controller.ts
│   │       ├── auth.service.ts
│   │       ├── auth.dto.ts
│   │       ├── auth.routes.ts
│   │       └── auth.types.ts
│   │
│   ├── shared/                # Código compartido
│   │   ├── constants/
│   │   │   └── errorMessages.ts
│   │   ├── types/
│   │   │   ├── api-response.ts
│   │   │   └── pagination.ts
│   │   └── utils/
│   │       ├── ApiError.ts
│   │       ├── asyncHandler.ts
│   │       └── logger.ts
│   │
│   ├── routes/
│   │   └── index.ts           # Router principal
│   │
│   ├── app.ts                 # Configuración Express
│   └── server.ts              # Entry point
│
├── screenshots/               # Capturas para documentación
├── .env                       # Variables de entorno (no subir a Git)
├── .env.example              # Template de variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## Requisitos Previos

- **Node.js** 18 o superior
- **npm** 9 o superior
- **Cuenta en Supabase** (gratuita)
- **Git** (para clonar el repositorio)

---

## Instalación

### **1. Clonar el repositorio**
```bash
git clone https://github.com/Mordo253/voting-system-api.git
cd voting-system-api
```

### **2. Instalar dependencias**
```bash
npm install
```

### **3. Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:
```env
# Database - Supabase
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST].supabase.co:5432/postgres"

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=tu-secret-super-seguro-cambialo-en-produccion
JWT_EXPIRES_IN=24h

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### **4. Ejecutar migraciones**
```bash
npx prisma migrate deploy
npx prisma generate
```

### **5. (Opcional) Insertar datos de prueba**
```bash
npm run prisma:seed
```

Esto creará:
- 5 votantes de ejemplo
- 4 candidatos de ejemplo

### **6. Iniciar servidor de desarrollo**
```bash
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`

---

## Configuración

### **Variables de Entorno**

| Variable | Descripción | Ejemplo | Requerido |
|----------|-------------|---------|-----------|
| `DATABASE_URL` | Connection string de PostgreSQL/Supabase | `postgresql://...` | Sí |
| `PORT` | Puerto del servidor | `3000` | No |
| `NODE_ENV` | Ambiente de ejecución | `development` | No |
| `JWT_SECRET` | Secreto para firmar JWT | `your-secret-key` | Sí |
| `JWT_EXPIRES_IN` | Expiración del token | `24h` | Sí |
| `RATE_LIMIT_WINDOW_MS` | Ventana de rate limiting (ms) | `900000` (15 min) | No |
| `RATE_LIMIT_MAX_REQUESTS` | Máximo de requests por ventana | `100` | No |

---

## Uso

### **Documentación Interactiva (Swagger)**
```
http://localhost:3000/api-docs
```

Aquí podemos observar:
- Ver todos los endpoints disponibles
- Probar la API directamente desde el navegador
- Ver schemas de request/response
- Autenticarte con JWT
- Ejemplos de uso

### **Health Check**
```bash
curl http://localhost:3000/api/health
```

**Response:**
```json
{
  "success": true,
  "message": "API funcionando correctamente",
  "timestamp": "2025-01-24T10:30:00.000Z"
}
```

---

##  Autenticación JWT

### **Flujo de Autenticación**
```
1. Registro/Login
   ↓
2. Obtener JWT Token
   ↓
3. Incluir token en headers
   Authorization: Bearer <token>
   ↓
4. Acceder a endpoints protegidos
```

### **Registrarse**
```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "voter"
    }
  },
  "message": "Usuario registrado exitosamente"
}
```

### **Iniciar Sesión**
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response:** (mismo formato que register)

### **Usar el Token**

Una vez que tengas el token, inclúyelo en el header `Authorization`:
```bash
POST http://localhost:3000/api/votes
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "voter_id": "550e8400-e29b-41d4-a716-446655440000",
  "candidate_id": "660e9511-f30c-52e5-b827-557766551111"
}
```

### **En Postman:**

1. Ve a la pestaña **Authorization**
2. Selecciona **Type: Bearer Token**
3. Pega el token obtenido del login
4. Envía la request

### **Endpoints Protegidos**

Actualmente, solo estos endpoints requieren autenticación:

-  `POST /api/votes` - Emitir un voto
-  `GET /api/auth/me` - Obtener usuario autenticado
-  `DELETE /api/voter/[id]` - Eliminar votante
-  `DELETE /api/candidate/[id]` - Elimina candidato

Todos los demás endpoints son **públicos** para facilitar consultas y estadísticas.

### **Token Expiración**

- **Duración:** 24 horas (configurable en `.env`)
- **Después de expirar:** Debes hacer login nuevamente
- **Variable:** `JWT_EXPIRES_IN=24h`

---

## Endpoints

### **Base URL:** `http://localhost:3000/api`

### **Health Check**

| Método | Endpoint | Descripción | Requiere Auth |
|--------|----------|-------------|---------------|
| GET | `/health` | Verifica estado de la API | No |

### **Autenticación (Auth)**

| Método | Endpoint | Descripción | Requiere Auth |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Registrar nuevo usuario | No |
| POST | `/auth/login` | Iniciar sesión y obtener JWT | No |
| GET | `/auth/me` | Obtener usuario autenticado | Sí  |

### **Votantes (Voters)**

| Método | Endpoint | Descripción | Requiere Auth |
|--------|----------|-------------|---------------|
| POST | `/voters` | Crear nuevo votante | No |
| GET | `/voters` | Listar votantes (paginado) | No |
| GET | `/voters/stats` | Estadísticas de votantes | No |
| GET | `/voters/:id` | Obtener votante por ID | No |
| PATCH | `/voters/:id` | Actualizar votante | No |
| DELETE | `/voters/:id` | Eliminar votante | No |

### **Candidatos (Candidates)**

| Método | Endpoint | Descripción | Requiere Auth |
|--------|----------|-------------|---------------|
| POST | `/candidates` | Crear nuevo candidato | No |
| GET | `/candidates` | Listar candidatos (paginado) | No |
| GET | `/candidates/ranking` | Ranking por votos | No |
| GET | `/candidates/stats` | Estadísticas de candidatos | No |
| GET | `/candidates/:id` | Obtener candidato por ID | No |
| PATCH | `/candidates/:id` | Actualizar candidato | No |
| DELETE | `/candidates/:id` | Eliminar candidato | No |

### **Votos (Votes)**

| Método | Endpoint | Descripción | Requiere Auth |
|--------|----------|-------------|---------------|
| POST | `/votes` | **Emitir un voto** | **Sí ** |
| GET | `/votes` | Listar todos los votos | No |
| GET | `/votes/statistics` | **Estadísticas completas** | No |
| GET | `/votes/:id` | Obtener voto por ID | No |
| GET | `/votes/voter/:voter_id` | Voto de un votante específico | No |

---

##  Reglas de Negocio

### **Votantes**

1. **Email único**: No pueden existir dos votantes con el mismo email
2. **No puede ser candidato**: Un email registrado como votante no puede ser candidato
3. **Solo eliminar si no ha votado**: Un votante que ya votó no puede ser eliminado
4. **Un voto por persona**: Campo `has_voted` garantiza un solo voto

### **Candidatos**

1. **Nombre único**: No pueden existir dos candidatos con el mismo nombre
2. **No puede ser votante**: Un nombre registrado como candidato no puede ser votante
3. **Solo eliminar sin votos**: Un candidato con votos no puede ser eliminado
4. **Partido opcional**: Permite candidatos independientes (party = null)

### **Votos**

1. **Transacción atómica**: Emitir voto actualiza 3 tablas simultáneamente:
   - Crea registro en `votes`
   - Actualiza `has_voted = true` en `voters`
   - Incrementa `votes` en `candidates`
2. **Un voto por votante**: Constraint UNIQUE en `voter_id` previene duplicados
3. **Validación existencia**: Verifica que votante y candidato existan
4. **Validación de estado**: Verifica que votante NO haya votado previamente
5. **Autenticación requerida**: Solo usuarios autenticados pueden votar

---

## 🎯 Decisiones de Diseño

### **1. PostgreSQL sobre MongoDB**

**Decisión:** Usar PostgreSQL como base de datos

**Razones:**
-  **Relaciones fuertes**: Foreign Keys garantizan integridad referencial
-  **Transacciones ACID**: Crítico para operaciones de votación (3 tablas simultáneas)
-  **Constraints nativos**: UNIQUE, CHECK, NOT NULL a nivel de BD
-  **Queries complejas**: Window functions para estadísticas eficientes
-  **Este sistema es inherentemente relacional**

**Alternativa considerada:** MongoDB
-  Relaciones débiles (requiere validación manual)
-  Transacciones menos maduras
-  Sin constraints nativos

### **2. Prisma como ORM**

**Decisión:** Usar Prisma en lugar de SQL raw o TypeORM

**Razones:**
-  **Type-safety**: Cliente generado con tipos TypeScript automáticos
-  **Migraciones automáticas**: Control de versiones del schema
-  **Developer Experience**: Autocompletado perfecto en IDE
-  **Prevención de SQL injection**: Queries parametrizadas automáticas

### **3. Arquitectura en Capas**

**Decisión:** Separar en Controller → Service → Repository

**Razones:**
-  **Testabilidad**: Cada capa se puede testear independientemente
-  **Mantenibilidad**: Cambios en una capa no afectan otras
-  **Escalabilidad**: Fácil agregar nuevas funcionalidades
-  **Separación de responsabilidades**: Cada capa tiene un propósito único

### **4. UUIDs como Primary Keys**

**Decisión:** Usar UUID v4 en lugar de IDs incrementales

**Razones:**
-  **Seguridad**: No se pueden predecir IDs secuenciales
-  **Distribución**: Funcionan en sistemas distribuidos
-  **No revelan información**: ID incremental revela cantidad de registros

### **5. Cursor-Based Pagination**

**Decisión:** Implementar cursor pagination en lugar de offset

**Razones:**
-  **Performance constante**: No degrada con páginas altas
-  **Sin duplicados**: Resultados consistentes durante paginación
-  **Eficiencia**: Usa índices de BD eficientemente

### **6. Validación Multi-Capa**

**Decisión:** Validar en DTO, Service y Database

**Razones:**
-  **Defensa en profundidad**: Si una capa falla, las otras protegen
-  **Feedback rápido**: DTOs rechazan datos inválidos antes de procesamiento
-  **Reglas de negocio**: Service valida lógica compleja
-  **Última línea**: Database constraints como fallback

### **7. Autenticación JWT Simplificada**

**Decisión:** Implementar JWT sin almacenar passwords hasheados en la base de datos

**Razones:**
-  **Cumple requisito**: "Autenticación básica con JWT" del enunciado (extra opcional)
-  **Demuestra conocimiento**: Implementación completa de flujo JWT
-  **Simplifica modelo**: No modifica schema original de Voters
-  **Enfoque educativo**: Prioriza demostrar arquitectura y transacciones

**Implementación Actual:**
- Sistema de registro y login funcional
- Tokens JWT válidos por 24 horas
- Endpoint de emisión de voto protegido
- Middleware reutilizable para proteger cualquier endpoint

**En Producción Real:**
- Se agregaría campo `password` hasheado con bcrypt a tabla Voters
- Se verificaría password real en login con `bcrypt.compare()`
- Se implementarían refresh tokens
- Se crearía tabla `Users` separada de `Voters` con roles (admin, voter)
- Se agregaría autenticación de 2 factores (2FA)

**Alternativa considerada:** Sistema completo con passwords en BD

**Por qué no:** Para prueba técnica, el enfoque actual demuestra suficientemente:
- Conocimiento de JWT
- Arquitectura modular (módulo Auth separado)
- Middleware de autenticación
- Documentación en Swagger con `bearerAuth`

### **8. Supabase como Proveedor de PostgreSQL**

**Decisión:** Usar Supabase en lugar de PostgreSQL local

**Razones:**
- **Zero setup**: No requiere Docker ni instalación local
- **Dashboard visual**: Evaluadores pueden ver datos fácilmente
- **Connection pooling**: Manejo automático de conexiones
- **Backups automáticos**: Protección de datos
- **Profesional**: Demuestra conocimiento de herramientas modernas en producción

**Alternativa considerada:** PostgreSQL con Docker Compose

**Por qué no:** Requiere más setup para evaluadores, sin aportar valor adicional a la prueba

---

##  Capturas de Pantalla

### **Swagger UI - Documentación Interactiva**

![Swagger Overview](./screenshots/1-swagger-overview.png)

*Vista general de todos los endpoints disponibles en Swagger UI*

---

### **Postman - Crear Votante**

![Postman Create Voter](./screenshots/2-postman-create-voter.png)

*Creación exitosa de votante con status 201*

---

### **Postman - Emitir Voto**

![Postman Cast Vote](./screenshots/3-postman-cast-vote.png)

*Emisión exitosa de voto con transacción atómica*

---

### **Estadísticas de Votación**

![Statistics Response](./screenshots/4-statistics-response.png)

*Respuesta del endpoint de estadísticas mostrando resultados completos*

---

### **Supabase - Tablas**

![Supabase Tables](./screenshots/5-supabase-tables.png)

*Vista de las 3 tablas en Supabase Dashboard*

---

### **Supabase - Datos de Votos**

![Supabase Votes Data](./screenshots/6-supabase-votes-data.png)

*Registros de votos almacenados en Supabase*

---

## 🧪 Testing

### **Scripts Disponibles**
```bash
# Desarrollo con hot-reload
npm run dev

# Compilar TypeScript
npm run build

# Ejecutar versión compilada
npm start

# Verificar tipos
npm run typecheck

# Linting
npm run lint
npm run lint:fix

# Formateo de código
npm run format

# Prisma
npm run prisma:generate     # Generar cliente
npm run prisma:migrate      # Crear migración
npm run prisma:studio       # Interfaz visual
npm run prisma:seed         # Insertar datos de prueba
```

### **Ejemplos de Uso con curl**

#### **Registrarse**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123"
  }'
```

#### **Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

**Guarda el token que recibes en la respuesta**

#### **Crear Votante**
```bash
curl -X POST http://localhost:3000/api/voters \
  -H "Content-Type: application/json" \
  -d '{
    "name": "María López",
    "email": "maria@example.com"
  }'
```

#### **Crear Candidato**
```bash
curl -X POST http://localhost:3000/api/candidates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Carlos Martínez",
    "party": "Partido Naranja"
  }'
```

#### **Emitir Voto (Requiere Token)**
```bash
curl -X POST http://localhost:3000/api/votes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "voter_id": "550e8400-e29b-41d4-a716-446655440000",
    "candidate_id": "660e9511-f30c-52e5-b827-557766551111"
  }'
```

#### **Ver Estadísticas**
```bash
curl http://localhost:3000/api/votes/statistics
```

---

##  Producción

### **Build**
```bash
npm run build
npm start
```

### **Variables de Entorno para Producción**
```env
NODE_ENV=production
DATABASE_URL="tu-database-url-produccion"
PORT=3000
JWT_SECRET="secret-muy-seguro-generado-con-openssl"
JWT_EXPIRES_IN=24h
```

### **Recomendaciones**

- Usar variables de entorno seguras
- Habilitar HTTPS
- Configurar CORS con dominios específicos
- Aumentar rate limiting en producción
- Implementar monitoreo y alertas
- Configurar backups automáticos

---

##  Mejoras Futuras

### **Autenticación y Seguridad**
- [ ] Passwords hasheados en base de datos
- [ ] Refresh tokens para renovación automática
- [ ] Sistema de roles completo (admin, voter, auditor)
- [ ] Autenticación de 2 factores (2FA)
- [ ] Rate limiting por usuario autenticado (no solo IP)
- [ ] Blacklist de tokens revocados (logout)

### **Funcionalidades**
- [ ] Websockets para resultados en tiempo real
- [ ] Exportación de resultados a PDF/CSV
- [ ] Sistema de votación por rondas (primera/segunda vuelta)
- [ ] Votación ponderada (votos con diferentes pesos)
- [ ] Auditoría completa con logs de todas las operaciones
- [ ] Soft deletes en lugar de deletes físicos
- [ ] Notificaciones por email

### **Infraestructura**
- [ ] Testing E2E con Jest + Supertest
- [ ] CI/CD con GitHub Actions
- [ ] Docker + Docker Compose
- [ ] Cache con Redis para estadísticas
- [ ] Message queue (RabbitMQ) para operaciones asíncronas
- [ ] Monitoreo con Prometheus + Grafana
- [ ] Deploy automático a Railway/Render

---

##  Autor

**Esteban Arango Blandón**
- Email: estebandesarrollo1548@email.com
- GitHub: [@Mordo253](https://github.com/Mordo253)
- LinkedIn: [esteban-blandón](www.linkedin.com/in/esteban-blandón-4b9058281)

---

## Licencia

Este proyecto fue desarrollado como prueba técnica.

---

**Tiempo de desarrollo:** ~18 horas  
**Líneas de código:** ~3,000  
**Arquitectura:** Layered Architecture (Controller → Service → Repository)  
**Patrón de diseño:** Repository Pattern +