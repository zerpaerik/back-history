#!/bin/bash

# Script para iniciar el proyecto con Docker
# Autor: Sistema de Historias Clínicas
# Fecha: $(date)

echo "🏥 Iniciando Sistema de Historias Clínicas con Docker..."

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

# Verificar si Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi

# Crear directorio de logs si no existe
mkdir -p logs

# Verificar si existe el archivo .env con la API key de OpenAI
if [ ! -f .env ]; then
    echo "⚠️  Archivo .env no encontrado. Creando uno basado en .env.docker..."
    cp .env.docker .env
    echo "📝 Por favor edita el archivo .env y agrega tu OPENAI_API_KEY"
    echo "   Luego ejecuta este script nuevamente."
    exit 1
fi

# Verificar si la API key está configurada
if ! grep -q "OPENAI_API_KEY=sk-" .env; then
    echo "⚠️  Por favor configura tu OPENAI_API_KEY en el archivo .env"
    echo "   Formato: OPENAI_API_KEY=sk-tu-api-key-aqui"
    exit 1
fi

echo "🔧 Construyendo imágenes Docker..."
docker-compose build

echo "🚀 Iniciando servicios..."
docker-compose up -d

echo "⏳ Esperando que los servicios estén listos..."
sleep 10

# Verificar el estado de los servicios
echo "📊 Estado de los servicios:"
docker-compose ps

echo ""
echo "✅ Sistema iniciado correctamente!"
echo "🌐 Backend disponible en: http://localhost:3000"
echo "🗄️  PostgreSQL disponible en: localhost:5432"
echo ""
echo "📋 Comandos útiles:"
echo "   Ver logs:           docker-compose logs -f"
echo "   Ver logs backend:   docker-compose logs -f backend"
echo "   Ver logs postgres:  docker-compose logs -f postgres"
echo "   Detener servicios:  docker-compose down"
echo "   Reiniciar:          docker-compose restart"
echo ""
