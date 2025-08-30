# 📋 Informe: Traslado del Diseño a Código
**Sistema de Autenticación con Arquitectura Monolítica**

---

## 1. Resumen 

Este informe documenta el proceso de implementación del sistema de autenticación, describiendo cómo se trasladaron los requerimientos de diseño a código funcional, aplicando el patrón Singleton y siguiendo una arquitectura monolítica.

(Aclaro que este informe o documentacion fue creado con IA por la facilidad que tiene para leer el repositorio)

## 2. Análisis de Requerimientos vs Implementación

### 2.1 Requerimientos Originales
| Requerimiento | Estado | Implementación |
|---------------|---------|----------------|
| ✅ Registro de usuarios | **Completado** | API `/api/register` + formulario HTML |
| ✅ Inicio de sesión | **Completado** | API `/api/login` + formulario HTML |
| ✅ Arquitectura monolítica | **Completado** | Servidor Express unificado |
| ✅ Patrón Singleton | **Completado** | `DatabaseSingleton` class |
| ✅ Base de datos JSON | **Completado** | `db/users.json` |
| ✅ Frontend HTML/CSS/JS | **Completado** | Páginas con TailwindCSS |

### 2.2 Funcionalidades Adicionales Implementadas
- **Validaciones robustas** - Frontend y backend
- **Manejo de errores** - Respuestas HTTP apropiadas
- **Interfaz moderna** - TailwindCSS para UI/UX

## 3. Arquitectura del Sistema

### 3.1 Decisiones Arquitectónicas

**🏛️ Arquitectura Monolítica Elegida**
```
┌─────────────────────────────┐
│      Aplicación Express     │
├─────────────────────────────┤
│  Frontend (Static Files)    │
│  • HTML Pages               │
│  • CSS (TailwindCSS)        │
│  • JavaScript               │
├─────────────────────────────┤
│  Backend (Node.js/Express)  │
│  • API Routes               │
│  • Business Logic           │
├─────────────────────────────┤
│  Data Storage (JSON)        │
│  • users.json file          │
└─────────────────────────────┘
```

**Justificación**: Se eligió arquitectura monolítica por:
- ✅ **Simplicidad** de desarrollo y despliegue
- ✅ **Comunicación interna** eficiente
- ✅ **Menor complejidad** operacional
- ✅ **Ideal para proyectos pequeños**

### 3.2 Estructura de Carpetas Implementada

```
proyecto/
├── backend/           # Lógica de negocio
│   ├── database.js    # Singleton para DB
│   ├── user.js        # Modelo Usuario
│   └── auth.js        # Servicio Auth
├── db/                # Almacenamiento
│   └── users.json     # Base de datos
├── pages/             # Vistas HTML
├── public/js/         # JavaScript cliente
└── index.js           # Servidor principal
```

## 4. Implementación del Patrón Singleton

### 4.1 Diseño Original
```
Database
├── - instance: Database
├── + getInstance(): Database
├── + getUsers()
├── + getUser()
└── + saveUsers()
└── + addUser()
```

### 4.2 Implementación en Código

```javascript
export class DatabaseSingleton {
  constructor() {
    // ✅ Verificar instancia única
    if (DatabaseSingleton.instance) {
      return DatabaseSingleton.instance;
    }
    
    // ✅ Configurar ruta de archivo
    this.filePath = path.join(__dirname, "../db/users.json");
    
    // ✅ Asignar instancia única
    DatabaseSingleton.instance = this;
    
    console.log("Nueva instancia de Database creada (Singleton)");
  }

  // ✅ Métodos asíncronos para manejo de archivos
  async getUsers() { ... }
  async saveUsers(users) { ... }
  async addUser(userData) { ... }
}
```

### 4.3 Ventajas del Singleton Implementado

| Ventaja | Implementación |
|---------|----------------|
| **Una sola instancia** | Constructor verifica `DatabaseSingleton.instance` |
| **Acceso global** | Importable desde cualquier módulo |
| **Gestión de estado** | Mantiene conexión única al archivo JSON |
| **Previene conflictos** | Evita múltiples escrituras simultáneas |

## 5. Traslado de Componentes del Diseño

### 5.1 Clase User

**Diseño Conceptual:**
```
User
├── + name: string
├── + email: string  
├── + password: string
├── + validateEmail(): boolean
└── + validatePassword(): boolean
```

**Implementación:**
```javascript
export class User {
  constructor(name, email, password) {
    this.id = Date.now().toString();        // ✅ ID único
    this.name = name;
    this.email = email;
    this.password = password;
    this.createdAt = new Date().toISOString(); // ✅ Timestamp
  }

  // ✅ Métodos estáticos de validación
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password) {
    return password && password.length >= 6;
  }

  // ✅ Serialización para JSON
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      createdAt: this.createdAt
    };
  }
}
```

**Mejoras Implementadas:**
- ✅ **ID único automático** con timestamp
- ✅ **Fecha de creación** para auditoría
- ✅ **Validaciones estáticas** reutilizables
- ✅ **Método toJSON()** para serialización

### 5.2 Servicio de Autenticación

**Diseño Conceptual:**
```
AuthService
├── + login(email, password): boolean
└── + register(name, email, password): boolean
```

**Implementación Mejorada:**
```javascript
export class AuthService {
  constructor() {
    this.db = new DatabaseSingleton(); // ✅ Usa Singleton
  }

  async login(email, password) {
    // ✅ Validaciones de entrada
    if (!email || !password) {
      throw new Error("Email y contraseña son requeridos");
    }

    // ✅ Búsqueda en base de datos
    const user = await this.db.getUser(email);
    
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    if (user.password !== password) {
      throw new Error("Contraseña incorrecta");
    }

    // ✅ Respuesta estructurada
    return {
      success: true,
      message: "Login exitoso",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  }

  async register(name, email, password) {
    // ✅ Validaciones múltiples
    if (!User.validateName(name)) {
      throw new Error("El nombre debe tener al menos 2 caracteres");
    }

    if (!User.validateEmail(email)) {
      throw new Error("Email inválido");
    }

    if (!User.validatePassword(password)) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    // ✅ Verificar usuario único
    const existingUser = await this.db.getUser(email);
    if (existingUser) {
      throw new Error("Ya existe un usuario con ese email");
    }

    // ✅ Crear y guardar usuario
    const newUser = new User(name.trim(), email.toLowerCase(), password);
    await this.db.addUser(newUser.toJSON());

    return {
      success: true,
      message: "Usuario registrado exitosamente",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    };
  }
}
```

## 6. API REST y Comunicación

### 6.1 Diseño de Endpoints

| Endpoint | Método | Propósito | Input | Output |
|----------|--------|-----------|-------|--------|
| `/api/login` | POST | Autenticación | `{email, password}` | `{success, user}` |
| `/api/register` | POST | Registro | `{name, email, password}` | `{success, user}` |

### 6.2 Implementación del Servidor

```javascript
// ✅ Middleware para JSON
app.use(express.json());

// ✅ Servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// ✅ Rutas de páginas
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "landing.html"));
});

// ✅ API con manejo de errores
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
});
```

## 7. Frontend y Experiencia de Usuario

### 7.1 Arquitectura del Frontend

```
Frontend
├── HTML Pages (Structure)
│   ├── landing.html
│   ├── login.html
│   ├── register.html
├── CSS (TailwindCSS)
│   └── Styling via CDN
└── JavaScript (Logic)
    ├── login.js
    └── register.js
```

### 7.2 Comunicación Frontend-Backend

**Implementación con Fetch API:**
```javascript
// ✅ Petición asíncrona al backend
const response = await fetch('/api/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, password })
});

const result = await response.json();

// ✅ Manejo de respuestas
if (result.success) {
  window.currentUser = result.user; // ✅ Estado global temporal
  window.location.href = '/'; // cuando inicia sesion lo redirije al login
} else {
  alert('Error: ' + result.message);
}
```

## 8. Validaciones y Manejo de Errores

### 8.1 Estrategia de Validación en Capas

```
┌─────────────────┐
│   Frontend      │ ← Validación básica (UX)
├─────────────────┤
│   API Layer     │ ← Validación de entrada
├─────────────────┤  
│ Business Logic  │ ← Validación de negocio
├─────────────────┤
│   Data Layer    │ ← Validación de integridad
└─────────────────┘
```

### 8.2 Implementación de Validaciones

**Frontend (Inmediata):**
```javascript
if (!email || !password) {
  alert('Por favor completa todos los campos');
  return;
}

if (password !== confirmPassword) {
  alert('Las contraseñas no coinciden');
  return;
}
```

**Backend (Robusta):**
```javascript
// ✅ Validación con regex
static validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ✅ Validación de longitud
static validatePassword(password) {
  return password && password.length >= 6;
}

9. 🚀 Guía de Ejecución del Proyecto
9.1 Requisitos Previos
Herramientas Necesarias:

✅ Node.js (versión 18 o superior)
✅ npm (incluido con Node.js)
✅ Editor de código (VS Code recomendado)
✅ Navegador web moderno
✅ Terminal/Línea de comandos

Verificar Instalación:
bash# Verificar Node.js
node --version
# Salida esperada: v18.x.x o superior

# Verificar npm
npm --version  
# Salida esperada: 8.x.x o superior
9.2 Proceso de Instalación Paso a Paso
Paso 1: Obtener el Código
bash# Si tienes Git configurado
git clone <url-del-repositorio>
cd practica_1_abdul

# O descargar ZIP y extraer
# cd ruta/donde/extrajiste/el-proyecto
Paso 2: Verificar Estructura de Archivos
bash# Listar contenido del proyecto
ls -la

# Estructura esperada:
practica_1_abdul/
├── backend/
├── db/
├── pages/
├── public/
├── index.js
├── package.json
└── README.md
Paso 3: Instalar Dependencias
bash# Instalar todas las dependencias
npm install

# Salida esperada:
# added X packages in Xs
# found 0 vulnerabilities
Paso 4: Verificar Base de Datos
bash# Verificar que existe el archivo JSON
cat db/users.json

# Si no existe, crearlo:
echo '[{"name":"Admin","email":"admin@test.com","password":"123456"}]' > db/users.json
Paso 5: Ejecutar el Servidor
bash# Iniciar el servidor
npm start

# Salida esperada:
# Servidor corriendo en http://localhost:3000
# Nueva instancia de Database creada (Singleton)
9.3 Verificación de Funcionamiento
Prueba 1: Acceso a la Aplicación

Abrir navegador y ir a http://localhost:3000
Verificar carga de la landing page
Confirmar enlaces a login y registro funcionan

Prueba 2: Funcionalidad de Login
bash# En el navegador:
# 1. Ir a http://localhost:3000/login
# 2. Usar credenciales de prueba:
#    Email: owenunda@example.com
#    Password: 123456789
# 3. Verificar redirección a dashboard
Prueba 3: Funcionalidad de Registro
bash# En el navegador:
# 1. Ir a http://localhost:3000/register  
# 2. Completar formulario con datos nuevos
# 3. Verificar mensaje de éxito
# 4. Comprobar nuevo usuario en db/users.json


10 Flujo de Trabajo Recomendado
Para Desarrollo:
bash# 1. Clonar/descargar proyecto
git clone <repo>

# 2. Instalar dependencias  
npm install

# 3. Iniciar servidor en modo desarrollo
npm run start

# 4. Abrir navegador en http://localhost:3000

# 5. Hacer