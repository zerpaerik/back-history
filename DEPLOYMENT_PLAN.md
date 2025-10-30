# 📋 PLAN DE DESPLIEGUE - Sistema de Suscripciones y Empresas

## ✅ IMPLEMENTACIÓN COMPLETA - 100% LISTA

### Entidades
- ✅ `src/subscriptions/entities/subscription.entity.ts`
- ✅ `src/companies/entities/company.entity.ts`
- ✅ `src/users/entities/user.entity.ts` (actualizado con companyId y relación Company)

### DTOs
- ✅ Subscriptions: create, update, response
- ✅ Companies: create, update, response (con días restantes y estado)
- ✅ Users: create, update, response (con relación Company)

### Servicios y Controladores
- ✅ `src/subscriptions/subscriptions.service.ts` (CRUD completo)
- ✅ `src/subscriptions/subscriptions.controller.ts` (todos los endpoints)
- ✅ `src/subscriptions/subscriptions.module.ts`
- ✅ `src/companies/companies.service.ts` (CRUD + búsqueda)
- ✅ `src/companies/companies.controller.ts` (todos los endpoints)
- ✅ `src/companies/companies.module.ts`
- ✅ `src/users/users.controller.ts` (CRUD completo + búsqueda)
- ✅ `src/users/users.service.ts` (actualizado con activate y search)
- ✅ `src/users/users.module.ts` (actualizado)
- ✅ `src/app.module.ts` (importa todos los nuevos módulos y entidades)

## 📊 Cambios en Base de Datos (TypeORM Sync)

TypeORM creará automáticamente:

### Tabla: `subscriptions`
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration_days INT NOT NULL,
  features TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_subscriptions_name ON subscriptions(name);
CREATE INDEX idx_subscriptions_is_active ON subscriptions(is_active);
```

### Tabla: `companies`
```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  ruc VARCHAR(20) UNIQUE NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(100),
  contact_person VARCHAR(100),
  subscription_id UUID REFERENCES subscriptions(id),
  subscription_start_date DATE,
  subscription_end_date DATE,
  status VARCHAR(20) DEFAULT 'Prueba',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_companies_ruc ON companies(ruc);
CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_companies_is_active ON companies(is_active);
```

### Tabla: `users` (ALTER)
```sql
ALTER TABLE users 
ADD COLUMN company_id UUID REFERENCES companies(id);
```

## 🔗 Endpoints Disponibles

### Subscriptions (`/subscriptions`)
- `POST /subscriptions` - Crear suscripción (ADMIN)
- `GET /subscriptions` - Listar suscripciones (ADMIN)
- `GET /subscriptions/:id` - Ver suscripción (ADMIN)
- `PATCH /subscriptions/:id` - Actualizar suscripción (ADMIN)
- `DELETE /subscriptions/:id` - Desactivar suscripción (ADMIN)
- `PATCH /subscriptions/:id/activate` - Activar suscripción (ADMIN)

### Companies (`/companies`)
- `POST /companies` - Crear empresa (ADMIN)
- `GET /companies` - Listar empresas con días restantes (ADMIN)
- `GET /companies/:id` - Ver empresa (ADMIN)
- `PATCH /companies/:id` - Actualizar empresa (ADMIN)
- `DELETE /companies/:id` - Desactivar empresa (ADMIN)
- `PATCH /companies/:id/activate` - Activar empresa (ADMIN)
- `GET /companies/search?term=xxx` - Buscar empresas (ADMIN)

### Users (`/users`)
- `POST /users` - Crear usuario (ADMIN)
- `GET /users` - Listar usuarios (ADMIN)
- `GET /users/:id` - Ver usuario (ADMIN)
- `PATCH /users/:id` - Actualizar usuario (ADMIN)
- `DELETE /users/:id` - Desactivar usuario (ADMIN)

## 📦 Respuesta de Company (con días restantes)

```json
{
  "id": "uuid",
  "name": "Empresa XYZ",
  "ruc": "20123456789",
  "address": "Av. Principal 123",
  "phone": "987654321",
  "email": "contacto@empresa.com",
  "contactPerson": "Juan Pérez",
  "subscription": {
    "id": "uuid",
    "name": "Plan Premium",
    "price": 299.00,
    "formattedPrice": "S/ 299.00",
    "durationDays": 30,
    "durationDescription": "1 mes",
    "features": ["Feature 1", "Feature 2"]
  },
  "subscriptionStartDate": "2025-01-01",
  "subscriptionEndDate": "2025-01-31",
  "daysRemaining": 15,
  "nextRenewalDate": "2025-01-31",
  "subscriptionStatus": "Activa",
  "isSubscriptionActive": true,
  "status": "Activo",
  "isActive": true
}
```

## 🚀 Pasos para Desplegar

### 1. ✅ Archivos completados
- ✅ Todos los archivos están creados y listos
- ✅ AppModule actualizado con nuevos módulos
- ✅ Relaciones configuradas correctamente

### 2. Commit y Push
```bash
git add .
git commit -m "feat: add subscriptions, companies and users CRUD with relationships"
git push
```

### 3. Railway Deploy
- Railway detectará el push
- Build automático
- TypeORM ejecutará `synchronize: true` y creará las tablas
- Verificar logs

### 4. Verificar en Railway
```bash
curl https://back-history-production.up.railway.app/subscriptions
curl https://back-history-production.up.railway.app/companies
curl https://back-history-production.up.railway.app/users
```

### 5. Cambiar DB_SYNCHRONIZE
Después del primer deploy exitoso:
- En Railway: `DB_SYNCHRONIZE=false`
- Redeploy

## ⚠️ Importante
- Mantener `DB_SYNCHRONIZE=true` solo para el primer deploy
- Después cambiar a `false` para evitar cambios automáticos en producción
- Las relaciones se cargan con `eager: true` para simplificar queries
