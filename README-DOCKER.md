# 🐳 Guía de Docker - Sistema de Historias Clínicas

Esta guía te ayudará a ejecutar el sistema de historias clínicas usando Docker tanto en local como en un servidor Debian.

## 📋 Requisitos Previos

### Para desarrollo local:
- Docker Desktop instalado
- Docker Compose instalado
- Tu API Key de OpenAI

### Para servidor Debian:
- Servidor Debian 10+ con acceso SSH
- Usuario con permisos sudo
- Conexión a internet

## 🚀 Ejecución en Local

### 1. Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp .env.docker .env

# Editar el archivo .env y agregar tu API Key de OpenAI
nano .env
```

Asegúrate de configurar:
```env
OPENAI_API_KEY=sk-tu-api-key-aqui
```

### 2. Iniciar el Sistema

```bash
# Dar permisos de ejecución al script
chmod +x docker-start.sh

# Ejecutar el sistema
./docker-start.sh
```

### 3. Verificar que Funciona

- **Backend**: http://localhost:3000
- **Base de datos**: localhost:5432
  - Usuario: `sysmedic_user`
  - Contraseña: `sysmedic_password_2025`
  - Base de datos: `sysmedic`

## 🌐 Despliegue en Servidor Debian

### 1. Preparar el Despliegue

```bash
# Dar permisos de ejecución
chmod +x docker-deploy.sh

# Ejecutar despliegue (reemplaza con tu servidor y usuario)
./docker-deploy.sh 192.168.1.100 root
```

### 2. Configurar en el Servidor

Una vez completado el despliegue, conéctate al servidor:

```bash
ssh root@tu-servidor

# Ir al directorio de la aplicación
cd /opt/sysmedic

# Configurar la API Key de OpenAI
nano .env
# Agregar: OPENAI_API_KEY=sk-tu-api-key-aqui

# Iniciar el sistema
sudo -u sysmedic ./docker-start.sh
```

## 🛠️ Comandos Útiles

### Gestión de Servicios

```bash
# Ver estado de los servicios
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs solo del backend
docker-compose logs -f backend

# Ver logs solo de PostgreSQL
docker-compose logs -f postgres

# Reiniciar servicios
docker-compose restart

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (⚠️ elimina datos)
docker-compose down -v
```

### Acceso a la Base de Datos

```bash
# Conectar a PostgreSQL desde el contenedor
docker-compose exec postgres psql -U sysmedic_user -d sysmedic

# Conectar desde herramientas externas
# Host: localhost (o IP del servidor)
# Puerto: 5432
# Usuario: sysmedic_user
# Contraseña: sysmedic_password_2025
# Base de datos: sysmedic
```

### Backup y Restauración

```bash
# Crear backup de la base de datos
docker-compose exec postgres pg_dump -U sysmedic_user sysmedic > backup_$(date +%Y%m%d).sql

# Restaurar backup
docker-compose exec -T postgres psql -U sysmedic_user sysmedic < backup_20250116.sql
```

## 🔧 Configuración Avanzada

### Variables de Entorno Disponibles

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `DB_HOST` | Host de PostgreSQL | `postgres` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_USERNAME` | Usuario de la BD | `sysmedic_user` |
| `DB_PASSWORD` | Contraseña de la BD | `sysmedic_password_2025` |
| `DB_NAME` | Nombre de la BD | `sysmedic` |
| `JWT_SECRET` | Secreto para JWT | `sysmedic_peru_jwt_secret_key_2025` |
| `JWT_EXPIRES_IN` | Expiración del JWT | `24h` |
| `OPENAI_API_KEY` | API Key de OpenAI | *requerido* |
| `PORT` | Puerto del backend | `3000` |

### Personalizar docker-compose.yml

Para cambiar puertos o configuraciones:

```yaml
# Cambiar puerto del backend
services:
  backend:
    ports:
      - "8080:3000"  # Acceder en puerto 8080

# Cambiar puerto de PostgreSQL
services:
  postgres:
    ports:
      - "5433:5432"  # Acceder en puerto 5433
```

## 🔒 Seguridad en Producción

### Recomendaciones:

1. **Cambiar contraseñas por defecto**:
   ```bash
   # En docker-compose.yml cambiar:
   POSTGRES_PASSWORD: tu_contraseña_segura
   DB_PASSWORD: tu_contraseña_segura
   JWT_SECRET: tu_secreto_jwt_seguro
   ```

2. **Usar HTTPS con reverse proxy**:
   ```bash
   # Instalar nginx
   apt install nginx

   # Configurar SSL con Let's Encrypt
   apt install certbot python3-certbot-nginx
   ```

3. **Configurar firewall**:
   ```bash
   # Permitir solo puertos necesarios
   ufw allow 22    # SSH
   ufw allow 80    # HTTP
   ufw allow 443   # HTTPS
   ufw enable
   ```

## 🐛 Solución de Problemas

### El backend no se conecta a la base de datos

```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps postgres

# Ver logs de PostgreSQL
docker-compose logs postgres

# Reiniciar servicios
docker-compose restart
```

### Error de permisos

```bash
# Dar permisos correctos
sudo chown -R sysmedic:sysmedic /opt/sysmedic
```

### Puerto ya en uso

```bash
# Ver qué proceso usa el puerto
sudo netstat -tulpn | grep :3000

# Cambiar puerto en docker-compose.yml
ports:
  - "3001:3000"
```

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs: `docker-compose logs -f`
2. Verifica la configuración en `.env`
3. Asegúrate de que Docker esté corriendo
4. Verifica que los puertos no estén en uso

---

¡El sistema de historias clínicas está listo para usar! 🏥✨
