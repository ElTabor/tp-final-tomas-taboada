# Veterinary Clinic Management System

Este proyecto es un sistema integral de gestión para una clínica veterinaria, que permite administrar Dueños, Mascotas, Profesionales (Veterinarios) e Historiales Médicos (Citas). Desarrollado como Trabajo Práctico Final.

## 🚀 Tecnologías Utilizadas

### Backend
- **Node.js** & **Express**
- **TypeScript** (Tipado estático para mayor robustez)
- **MongoDB** & **Mongoose** (Base de datos NoSQL y ODM)
- **JWT (JSON Web Tokens)** (Autenticación y protección de rutas)
- **Bcrypt** (Encriptación de contraseñas)
- **Express-Validator** (Validación de datos de entrada)
- **Express-Rate-Limit** (Seguridad contra ataques de fuerza bruta)

### Frontend
- **React** (v18+) con **Vite**
- **TypeScript**
- **Modern CSS** (Diseño premium, Dark Mode, Micro-animaciones)
- **Material Icons** (Iconografía)

---

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/ElTabor/tp-final-tomas-taboada.git
cd tp-final-tomas-taboada
```

### 2. Configuración del Backend
Instale las dependencias en la raíz del proyecto:
```bash
npm install
```
Cree un archivo `.env` en la raíz basándose en `.env.example`:
```env
    PORT=3000
    MONGO_URI=tu_conexion_mongodb
    JWT_ACCESS_SECRET=tu_secreto_access
    JWT_REFRESH_SECRET=tu_secreto_refresh
```

### 3. Configuración del Frontend
Navegue a la carpeta frontend e instale las dependencias:
```bash
cd frontend
npm install
```

---

## 🏃 Ejecución

### Modo Desarrollo
Para ejecutar ambos simultáneamente (en terminales separadas):

**Backend:**
```bash
# En la raíz
npm run dev
```

**Frontend:**
```bash
# En /frontend
npm run dev
```

### Seed de Datos (Opcional)
Para poblar la base de datos con datos de prueba iniciales:
```bash
# En la raíz
npx ts-node src/scripts/seed.ts
```

---

## 🔑 Variables de Entorno Requeridas

Para que el backend funcione correctamente, es necesario configurar un archivo `.env` en la raíz del proyecto con las siguientes variables:

*   **PORT**: Puerto en el que correrá el servidor backend (ej: `3000`).
*   **MONGO_URI**: URL de conexión a tu clúster de MongoDB (Local o MongoDB Atlas).
*   **JWT_ACCESS_SECRET**: Clave secreta aleatoria para firmar los JSON Web Tokens de acceso.
*   **JWT_REFRESH_SECRET**: Clave secreta aleatoria para firmar los tokens de refresco.
*   **JWT_EXPIRES_IN**: Tiempo de validez previsto para los tokens (ej: `1d`, `24h`).

---

## 📡 Endpoints Principales (API)

### Autenticación
- `POST /api/auth/register` - Registrar un nuevo administrador.
- `POST /api/auth/login` - Iniciar sesión y obtener tokens.

### Mascotas (Pets) - CRUD Completo
- `GET /api/pets` - Listar todas las mascotas.
- `GET /api/pets/:id` - Obtener detalle de una mascota.
- `POST /api/pets` - Crear nueva mascota.
- `PUT /api/pets/:id` - Actualizar mascota.
- `DELETE /api/pets/:id` - Eliminar mascota.

### Dueños (Owners)
- `GET /api/owners` - Listar dueños.
- `POST /api/owners` - Crear dueño.
- `PUT /api/owners/:id` - Actualizar dueño.
- `DELETE /api/owners/:id` - Eliminar dueño.

### Veterinarios (Veterinarians)
- `GET /api/veterinarians` - Listar profesionales.
- `POST /api/veterinarians` - Agregar profesional.
- `PUT /api/veterinarians/:id` - Editar profesional.
- `DELETE /api/veterinarians/:id` - Eliminar profesional.

### Historial Médico / Citas (Medical Records)
- `GET /api/medical-records` - Listar registros.
- `POST /api/medical-records` - Crear nueva cita.
- `PUT /api/medical-records/:id` - Editar registro.
- `DELETE /api/medical-records/:id` - Eliminar registro.

---

## 🎨 Frontend Utilizado
El frontend fue desarrollado íntegramente en **React** utilizando el bundle tool **Vite**. Se optó por una estructura de **SPA (Single Page Application)** consumiendo la API REST del backend mediante `fetch`. 

**Características destacadas del Frontend:**
- **Dashboard Interactivo**: Con métricas en tiempo real y log de actividad.
- **Búsqueda y Filtrado**: En todas las tablas de datos.
- **Modales de Confirmación**: Para todas las acciones destructivas (Eliminar).
- **Responsive Design**: Adaptado para móviles y desktop.
- **Dark/Light Mode**: Soporte nativo para temas de color.

---

## 📂 Estructura del Proyecto

Aquí se detalla la estructura de carpetas del repositorio:

```text
.
├── .env.example
├── package.json
├── README.md
├── tsconfig.json
├── src/
│   ├── app.ts
│   ├── config/
│   ├── controllers/
│   ├── dtos/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── services/
│   └── validators/
└── frontend/
    ├── index.html
    ├── vite.config.ts
    └── src/
        ├── components/
        ├── views/
        ├── App.tsx
        ├── main.tsx
        └── index.css
```

