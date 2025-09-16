# Usar Node.js 18 Alpine como imagen base
FROM node:18-alpine

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache python3 make g++

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production && npm cache clean --force

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Cambiar permisos del directorio
RUN chown -R nestjs:nodejs /app
USER nestjs

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]
