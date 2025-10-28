# Usar Node.js 20 Alpine como imagen base
FROM node:20-alpine

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache python3 make g++

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar TODAS las dependencias para poder compilar
RUN npm ci

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

# Prune de devDependencies y limpiar cache en imagen final
ENV NODE_ENV=production
RUN npm prune --omit=dev && npm cache clean --force

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]
