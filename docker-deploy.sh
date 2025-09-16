#!/bin/bash

# Script para desplegar en servidor Debian
# Autor: Sistema de Historias Clínicas
# Uso: ./docker-deploy.sh [servidor] [usuario]

SERVER=$1
USER=$2

if [ -z "$SERVER" ] || [ -z "$USER" ]; then
    echo "❌ Uso: ./docker-deploy.sh [servidor] [usuario]"
    echo "   Ejemplo: ./docker-deploy.sh 192.168.1.100 root"
    exit 1
fi

echo "🚀 Desplegando Sistema de Historias Clínicas en servidor Debian..."
echo "🎯 Servidor: $SERVER"
echo "👤 Usuario: $USER"

# Crear directorio temporal para el despliegue
TEMP_DIR="sysmedic-deploy-$(date +%Y%m%d-%H%M%S)"
mkdir -p $TEMP_DIR

# Copiar archivos necesarios
echo "📦 Preparando archivos para despliegue..."
cp -r src $TEMP_DIR/
cp -r init-db $TEMP_DIR/
cp package*.json $TEMP_DIR/
cp tsconfig*.json $TEMP_DIR/
cp nest-cli.json $TEMP_DIR/
cp Dockerfile $TEMP_DIR/
cp Dockerfile.prod $TEMP_DIR/
cp docker-compose.yml $TEMP_DIR/
cp docker-compose.prod.yml $TEMP_DIR/
cp .dockerignore $TEMP_DIR/
cp .env.docker $TEMP_DIR/
cp .env.production $TEMP_DIR/
cp docker-start.sh $TEMP_DIR/
cp README.md $TEMP_DIR/
cp README-DOCKER.md $TEMP_DIR/

# Crear script de instalación para el servidor
cat > $TEMP_DIR/install-server.sh << 'EOF'
#!/bin/bash

echo "🐧 Configurando servidor Debian para Sistema de Historias Clínicas..."

# Actualizar sistema
echo "📦 Actualizando sistema..."
apt update && apt upgrade -y

# Instalar Docker
echo "🐳 Instalando Docker..."
apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install -y docker-ce docker-ce-cli containerd.io

# Instalar Docker Compose
echo "🔧 Instalando Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Iniciar y habilitar Docker
systemctl start docker
systemctl enable docker

# Crear usuario para la aplicación
useradd -m -s /bin/bash sysmedic || true
usermod -aG docker sysmedic

# Crear directorio de la aplicación
mkdir -p /opt/sysmedic
chown sysmedic:sysmedic /opt/sysmedic

echo "✅ Servidor configurado correctamente!"
EOF

chmod +x $TEMP_DIR/install-server.sh
chmod +x $TEMP_DIR/docker-start.sh

# Comprimir archivos
echo "🗜️  Comprimiendo archivos..."
tar -czf sysmedic-backend.tar.gz $TEMP_DIR

# Copiar al servidor
echo "📤 Copiando archivos al servidor..."
scp sysmedic-backend.tar.gz $USER@$SERVER:/tmp/

# Ejecutar instalación en el servidor
echo "🔧 Ejecutando instalación en el servidor..."
ssh $USER@$SERVER << 'ENDSSH'
cd /tmp
tar -xzf sysmedic-backend.tar.gz
cd sysmedic-deploy-*

# Ejecutar script de instalación del servidor
chmod +x install-server.sh
./install-server.sh

# Mover archivos a directorio final
cp -r * /opt/sysmedic/
chown -R sysmedic:sysmedic /opt/sysmedic

# Configurar variables de entorno
cd /opt/sysmedic
cp .env.production .env

# Crear directorios necesarios
mkdir -p logs backups uploads
chown -R sysmedic:sysmedic logs backups uploads

echo ""
echo "🎉 ¡Instalación completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Editar /opt/sysmedic/.env con tu OPENAI_API_KEY y contraseñas seguras"
echo "2. Para desarrollo: sudo -u sysmedic docker-compose up -d"
echo "3. Para producción: sudo -u sysmedic docker-compose -f docker-compose.prod.yml up -d"
echo ""
echo "🗄️  La base de datos se inicializará automáticamente con:"
echo "   - Especialidades médicas predefinidas"
echo "   - Usuario admin por defecto (admin/admin123)"
echo "   - Índices optimizados"
echo ""
echo "🌐 El sistema estará disponible en: http://$(hostname -I | awk '{print $1}'):3000"
echo ""
ENDSSH

# Limpiar archivos temporales
rm -rf $TEMP_DIR sysmedic-backend.tar.gz

echo ""
echo "✅ ¡Despliegue completado!"
echo "🔗 Conéctate al servidor y sigue las instrucciones mostradas."
echo ""
