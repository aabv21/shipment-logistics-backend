# Shipment Logistics Backend

Sistema de gestión de envíos y logística desarrollado con Node.js y Express.

## 🚀 Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **TypeScript** - Superset de JavaScript con tipado estático
- **Supabase** - Base de datos PostgreSQL y autenticación
- **WebSocket** - Comunicación en tiempo real
- **Zod** - Validación de esquemas
- **JWT** - Autenticación de tokens
- **Docker** - Contenedorización
- **Docker Compose** - Orquestación de contenedores
- **pnpm** - Gestor de paquetes rápido y eficiente

## 📁 Estructura del Proyecto

```
src/
├── config/         # Configuraciones del proyecto
├── controllers/    # Controladores de rutas
├── middlewares/    # Middlewares de Express
├── models/         # Modelos de datos
├── routes/         # Definición de rutas
├── services/       # Lógica de negocio
├── types/          # Tipos de TypeScript
└── utils/          # Utilidades generales
```

## 🛣️ Rutas API

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar nuevo usuario

### Envíos

- `GET /api/shipments` - Listar envíos
- `GET /api/shipments/:id` - Obtener envío por ID
- `POST /api/shipments` - Crear nuevo envío
- `PUT /api/shipments/:id` - Actualizar envío
- `DELETE /api/shipments/:id` - Eliminar envío

### Historial de Estados

- `GET /api/shipments/:id/history` - Obtener historial de un envío
- `POST /api/shipments/:id/history` - Agregar nuevo estado al historial

## 📦 Módulos Principales

1. **Autenticación**

   - Manejo de usuarios y roles
   - JWT para tokens de acceso
   - Middleware de autorización

2. **Gestión de Envíos**

   - CRUD de envíos
   - Validación de datos con Zod
   - Integración con Google Maps

3. **Historial de Estados**

   - Seguimiento en tiempo real
   - Notificaciones por WebSocket
   - Geolocalización de estados

4. **WebSocket**
   - Actualizaciones en tiempo real
   - Notificaciones push
   - Estado de conexión

## 📊 Esquema de Base de Datos

Para ver el esquema de la base de datos, accede a:

```
http://localhost:3000/supabase-schema-wxcsooruimmhlbebbkla.svg
```

O abre el archivo directamente en:

```
/public/supabase-schema-wxcsooruimmhlbebbkla.svg
```

## 🔧 Configuración del Proyecto

### Prerequisitos

- Node.js (versión 18 o superior)
- Docker y Docker Compose
- pnpm (Gestor de paquetes)

### Instalación de pnpm

```bash
# Instalar pnpm globalmente
npm install -g pnpm
```

### Pasos de Instalación

1. Clonar el repositorio:

```bash
git clone <repository-url>
cd shipment-logistics-backend
```

2. Configurar variables de entorno:

```bash
cp .env.example .env
```

3. Iniciar los servicios con Docker:

```bash
# Construir e iniciar los contenedores
docker-compose up --build

# Para ejecutar en segundo plano
docker-compose up -d --build
```

4. Para desarrollo local sin Docker:

```bash
# Instalar dependencias
pnpm install

# Iniciar en modo desarrollo
pnpm dev

# Construir para producción
pnpm build

# Iniciar en modo producción
pnpm start
```

### Detener los servicios

```bash
# Detener los contenedores
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

## 🔐 Variables de Entorno Requeridas

```env
PORT=3000
NODE_ENV=development
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret
```

## 📝 Documentación Adicional

- [Documentación de la API](docs/api.md)
- [Guía de Desarrollo](docs/development.md)
- [Guía de Despliegue](docs/deployment.md)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
