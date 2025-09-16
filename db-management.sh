#!/bin/bash

# Script de gestión de base de datos para Sistema de Historias Clínicas
# Uso: ./db-management.sh [comando]

COMMAND=$1

show_help() {
    echo "🗄️  Gestión de Base de Datos - Sistema de Historias Clínicas"
    echo ""
    echo "Uso: ./db-management.sh [comando]"
    echo ""
    echo "Comandos disponibles:"
    echo "  backup          - Crear backup de la base de datos"
    echo "  restore [file]  - Restaurar backup desde archivo"
    echo "  reset           - Reinicializar base de datos (⚠️ ELIMINA TODOS LOS DATOS)"
    echo "  status          - Ver estado de la base de datos"
    echo "  logs            - Ver logs de PostgreSQL"
    echo "  connect         - Conectar a la base de datos"
    echo "  init            - Ejecutar scripts de inicialización manualmente"
    echo ""
}

backup_database() {
    echo "📦 Creando backup de la base de datos..."
    BACKUP_FILE="backup_sysmedic_$(date +%Y%m%d_%H%M%S).sql"
    
    if docker-compose ps postgres | grep -q "Up"; then
        docker-compose exec postgres pg_dump -U sysmedic_user sysmedic > "backups/$BACKUP_FILE"
        echo "✅ Backup creado: backups/$BACKUP_FILE"
    else
        echo "❌ El contenedor de PostgreSQL no está corriendo"
        exit 1
    fi
}

restore_database() {
    BACKUP_FILE=$2
    
    if [ -z "$BACKUP_FILE" ]; then
        echo "❌ Especifica el archivo de backup"
        echo "Uso: ./db-management.sh restore backup_file.sql"
        exit 1
    fi
    
    if [ ! -f "backups/$BACKUP_FILE" ]; then
        echo "❌ Archivo de backup no encontrado: backups/$BACKUP_FILE"
        exit 1
    fi
    
    echo "🔄 Restaurando base de datos desde: $BACKUP_FILE"
    echo "⚠️  Esto eliminará todos los datos actuales. ¿Continuar? (y/N)"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        docker-compose exec -T postgres psql -U sysmedic_user sysmedic < "backups/$BACKUP_FILE"
        echo "✅ Base de datos restaurada"
    else
        echo "❌ Operación cancelada"
    fi
}

reset_database() {
    echo "⚠️  ADVERTENCIA: Esto eliminará TODOS los datos de la base de datos"
    echo "¿Estás seguro de que quieres continuar? (y/N)"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "🗑️  Eliminando contenedores y volúmenes..."
        docker-compose down -v
        
        echo "🚀 Reiniciando servicios..."
        docker-compose up -d
        
        echo "⏳ Esperando que la base de datos esté lista..."
        sleep 15
        
        echo "✅ Base de datos reinicializada"
    else
        echo "❌ Operación cancelada"
    fi
}

database_status() {
    echo "📊 Estado de la base de datos:"
    echo ""
    
    if docker-compose ps postgres | grep -q "Up"; then
        echo "✅ PostgreSQL: Corriendo"
        
        # Información de la base de datos
        echo ""
        echo "📈 Estadísticas:"
        docker-compose exec postgres psql -U sysmedic_user sysmedic -c "
        SELECT 
            schemaname,
            tablename,
            n_tup_ins as inserts,
            n_tup_upd as updates,
            n_tup_del as deletes
        FROM pg_stat_user_tables 
        ORDER BY tablename;
        "
        
        echo ""
        echo "📋 Tablas y registros:"
        docker-compose exec postgres psql -U sysmedic_user sysmedic -c "
        SELECT 
            table_name,
            (xpath('/row/count/text()', xml_count))[1]::text::int as row_count
        FROM (
            SELECT 
                table_name, 
                query_to_xml(format('select count(*) from %I.%I', table_schema, table_name), false, true, '') as xml_count
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        ) t
        ORDER BY table_name;
        "
    else
        echo "❌ PostgreSQL: No está corriendo"
    fi
}

show_logs() {
    echo "📋 Logs de PostgreSQL (últimas 50 líneas):"
    docker-compose logs --tail=50 postgres
}

connect_database() {
    echo "🔗 Conectando a la base de datos..."
    echo "Para salir, escribe: \\q"
    docker-compose exec postgres psql -U sysmedic_user sysmedic
}

init_database() {
    echo "🔧 Ejecutando scripts de inicialización..."
    
    if [ -d "init-db" ]; then
        for sql_file in init-db/*.sql; do
            if [ -f "$sql_file" ]; then
                echo "📄 Ejecutando: $(basename "$sql_file")"
                docker-compose exec -T postgres psql -U sysmedic_user sysmedic < "$sql_file"
            fi
        done
        echo "✅ Scripts de inicialización ejecutados"
    else
        echo "❌ Directorio init-db no encontrado"
    fi
}

# Crear directorio de backups si no existe
mkdir -p backups

case $COMMAND in
    "backup")
        backup_database
        ;;
    "restore")
        restore_database "$@"
        ;;
    "reset")
        reset_database
        ;;
    "status")
        database_status
        ;;
    "logs")
        show_logs
        ;;
    "connect")
        connect_database
        ;;
    "init")
        init_database
        ;;
    *)
        show_help
        ;;
esac
