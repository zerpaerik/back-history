# 📚 Ejemplos de API - Suscripciones, Empresas y Usuarios

## 🔐 Autenticación

Todos los endpoints requieren autenticación JWT. Incluye el token en el header:
```
Authorization: Bearer <tu_token>
```

## 📦 Subscriptions (Suscripciones)

### Crear Suscripción
```bash
POST /subscriptions
Content-Type: application/json

{
  "name": "Plan Básico",
  "description": "Plan básico para pequeñas clínicas",
  "price": 99.00,
  "durationDays": 30,
  "features": [
    "Hasta 50 pacientes",
    "1 usuario",
    "Soporte por email"
  ],
  "isActive": true
}
```

### Listar Suscripciones
```bash
GET /subscriptions
GET /subscriptions?includeInactive=true
```

### Ver Suscripción
```bash
GET /subscriptions/:id
```

### Actualizar Suscripción
```bash
PATCH /subscriptions/:id
Content-Type: application/json

{
  "price": 129.00,
  "features": [
    "Hasta 100 pacientes",
    "2 usuarios",
    "Soporte prioritario"
  ]
}
```

### Desactivar Suscripción
```bash
DELETE /subscriptions/:id
```

### Activar Suscripción
```bash
PATCH /subscriptions/:id/activate
```

## 🏢 Companies (Empresas)

### Crear Empresa
```bash
POST /companies
Content-Type: application/json

{
  "name": "Clínica San José",
  "ruc": "20123456789",
  "address": "Av. Principal 123, Lima",
  "phone": "987654321",
  "email": "contacto@clinicasanjose.com",
  "contactPerson": "Dr. Juan Pérez",
  "subscriptionId": "uuid-de-suscripcion",
  "subscriptionStartDate": "2025-01-01",
  "subscriptionEndDate": "2025-01-31",
  "status": "Activo"
}
```

### Listar Empresas (con días restantes)
```bash
GET /companies
GET /companies?includeInactive=true
```

**Respuesta incluye**:
- `daysRemaining`: Días restantes de suscripción
- `nextRenewalDate`: Fecha de próxima renovación
- `subscriptionStatus`: "Activa", "Por vencer", "Próxima a vencer", "Vencida"
- `isSubscriptionActive`: true/false

### Buscar Empresas
```bash
GET /companies/search?term=clinica
GET /companies/search?term=20123456789
```

### Ver Empresa
```bash
GET /companies/:id
```

### Actualizar Empresa
```bash
PATCH /companies/:id
Content-Type: application/json

{
  "phone": "999888777",
  "subscriptionEndDate": "2025-02-28"
}
```

### Desactivar Empresa
```bash
DELETE /companies/:id
```

### Activar Empresa
```bash
PATCH /companies/:id/activate
```

## 👥 Users (Usuarios)

### Crear Usuario
```bash
POST /users
Content-Type: application/json

{
  "username": "doctor.perez",
  "email": "perez@clinica.com",
  "password": "password123",
  "role": "doctor",
  "companyId": "uuid-de-empresa"
}
```

**Roles disponibles**: `admin`, `doctor`, `nurse`, `receptionist`

### Listar Usuarios
```bash
GET /users
GET /users?includeInactive=true
```

### Buscar Usuarios
```bash
GET /users/search?term=perez
GET /users/search?term=doctor
```

### Ver Usuario
```bash
GET /users/:id
```

### Actualizar Usuario
```bash
PATCH /users/:id
Content-Type: application/json

{
  "role": "admin",
  "companyId": "otro-uuid-de-empresa"
}
```

### Desactivar Usuario
```bash
DELETE /users/:id
```

### Activar Usuario
```bash
PATCH /users/:id/activate
```

## 📊 Ejemplos de Respuestas

### Company Response (con cálculos automáticos)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Clínica San José",
  "ruc": "20123456789",
  "address": "Av. Principal 123, Lima",
  "phone": "987654321",
  "email": "contacto@clinicasanjose.com",
  "contactPerson": "Dr. Juan Pérez",
  "subscription": {
    "id": "...",
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
  "isActive": true,
  "fullInfo": "Clínica San José - RUC: 20123456789"
}
```

### User Response (con empresa)
```json
{
  "id": "...",
  "username": "doctor.perez",
  "email": "perez@clinica.com",
  "role": "doctor",
  "companyId": "...",
  "company": {
    "id": "...",
    "name": "Clínica San José",
    "ruc": "20123456789",
    "daysRemaining": 15,
    "subscriptionStatus": "Activa"
  },
  "isActive": true,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

## 🔄 Flujo Típico de Uso

### 1. Crear Suscripciones
```bash
POST /subscriptions (Plan Básico, Premium, Enterprise)
```

### 2. Crear Empresa con Suscripción
```bash
POST /companies
{
  "name": "Mi Clínica",
  "ruc": "...",
  "subscriptionId": "uuid-plan-premium",
  "subscriptionStartDate": "2025-01-01",
  "subscriptionEndDate": "2025-12-31"
}
```

### 3. Crear Usuarios de la Empresa
```bash
POST /users
{
  "username": "admin.clinica",
  "email": "admin@miclinica.com",
  "password": "...",
  "role": "admin",
  "companyId": "uuid-de-mi-clinica"
}
```

### 4. Monitorear Estado de Suscripciones
```bash
GET /companies
# Ver daysRemaining y subscriptionStatus de cada empresa
```

### 5. Renovar Suscripción
```bash
PATCH /companies/:id
{
  "subscriptionEndDate": "2026-12-31"
}
```

## ⚠️ Notas Importantes

- **Solo ADMIN** puede acceder a estos endpoints
- Los **días restantes** se calculan automáticamente
- El **estado de suscripción** se actualiza en tiempo real
- Las empresas con suscripción vencida (`daysRemaining: 0`) deben renovarse
- Los usuarios están vinculados a empresas (opcional)
