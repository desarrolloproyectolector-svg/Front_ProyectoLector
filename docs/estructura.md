# Estructura del Proyecto — Proyecto Lector

> Plataforma educativa de lectura con Next.js 14 (App Router), TypeScript y autenticación por roles.

---

## Árbol de directorios

```
src/
│
├── middleware.ts                        # 🔐 Protección server-side de rutas.
│                                        #    Lee el JWT de la cookie, verifica el rol
│                                        #    y redirige si no tiene acceso.
│
├── app/                                 # Rutas de la aplicación (Next.js App Router)
│   ├── layout.tsx                       # Layout raíz: envuelve todo con <AuthProvider>
│   ├── page.tsx                         # Landing page pública
│   ├── globals.css                      # Estilos globales
│   │
│   ├── login/
│   │   └── page.tsx                     # Formulario de login animado (LibroBook).
│   │                                    # Redirige a su rol si ya tiene sesión.
│   │
│   ├── registro/
│   │   └── page.tsx                     # Registro de nuevos usuarios
│   │
│   ├── admin/                           # 🔐 Solo rol: administrador
│   │   ├── layout.tsx                   # Sidebar + RouteGuard(['administrador'])
│   │   ├── page.tsx                     # Panel principal de administración
│   │   ├── usuarios/                    # Gestión de todos los usuarios del sistema
│   │   ├── libros/                      # Catálogo y carga de libros (PDF + metadatos)
│   │   ├── escuelas/                    # Gestión de instituciones educativas
│   │   └── licencias/                   # Control de licencias del sistema
│   │
│   ├── escuela/                         # 🔐 Solo rol: director
│   │   ├── layout.tsx                   # Sidebar + RouteGuard(['director'])
│   │   ├── page.tsx                     # Panel del director de escuela
│   │   ├── alumnos/                     # Lista y gestión de alumnos de la escuela
│   │   ├── profesores/                  # Lista y gestión de profesores
│   │   ├── grupos/                      # Grupos académicos y asignación de maestros
│   │   ├── compras/                     # Historial y nuevas compras de licencias
│   │   └── licencias/                   # Licencias activas de la institución
│   │
│   ├── profesor/                        # 🔐 Solo rol: maestro
│   │   ├── layout.tsx                   # Sidebar + RouteGuard(['maestro'])
│   │   └── page.tsx                     # Panel del profesor: grupos y alumnos
│   │
│   ├── alumno/                          # 🔐 Solo rol: alumno
│   │   ├── layout.tsx                   # Sidebar + RouteGuard(['alumno'])
│   │   ├── page.tsx                     # Página index (redirige a /store)
│   │   ├── library/
│   │   │   ├── page.tsx                 # Biblioteca personal: libros asignados y progreso
│   │   │   └── reader/
│   │   │       └── [id]/
│   │   │           └── page.tsx         # ⏱ Lector de libro con cronómetro de lectura.
│   │   │                                #   Notificación al iniciar y al finalizar sesión.
│   │   ├── store/                       # Tienda: explorar y descubrir libros
│   │   ├── redeem/                      # Canjear código de licencia institucional
│   │   ├── stats/                       # Estadísticas de progreso y lectura
│   │   ├── schedule/                    # Horario de clases y lecturas asignadas
│   │   └── settings/                   # Configuración de perfil y preferencias
│   │
│   └── tutor/                           # 🔐 Solo rol: padre/tutor
│       ├── layout.tsx                   # Sidebar + RouteGuard(['padre'])
│       └── page.tsx                     # Panel del tutor: seguimiento de hijos
│
├── components/                          # Componentes reutilizables
│   │
│   ├── auth/
│   │   └── RouteGuard.tsx               # 🔐 Guard client-side: verifica isAuthenticated
│   │                                    #    y tipoPersona. Segunda capa de protección.
│   │
│   ├── MenuLateral/                     # Sidebars por rol
│   │   ├── SidebarAdmin.tsx
│   │   ├── SidebarEscuela.tsx
│   │   ├── SidebarProfesor.tsx
│   │   ├── SidebarAlumno.tsx
│   │   └── SidebarTutor.tsx
│   │
│   ├── LoginBook/                       # Componente del libro animado 3D del login
│   │   ├── index.tsx                    # Lógica de animación + llamada a /auth/login
│   │   └── styles.module.css            # Animaciones CSS del libro
│   │
│   ├── admin/
│   │   └── usuarios/                    # Formularios y campos del CRUD de usuarios
│   │       ├── AlumnoFields.tsx         # Campos específicos para crear/editar alumnos
│   │       ├── TutorFields.tsx          # Campos específicos para tutores
│   │       └── ...
│   │
│   ├── alumno/
│   │   ├── reader/
│   │   │   └── ReadingTimer.tsx         # ⏱ Widget del cronómetro en el header del lector
│   │   │                                #    Punto dorado pulsante + tiempo MM:SS
│   │   ├── libros/
│   │   │   ├── LecturaDestacada.tsx     # Tarjeta de libro en lectura activa / destacado
│   │   │   ├── LibroCard.tsx            # Tarjeta de libro para tienda y biblioteca
│   │   │   └── LibroDetalleModal.tsx    # Modal con detalle completo de un libro
│   │   ├── CanjeCodigo/                 # UI para canjear código de licencia
│   │   ├── DetalleProducto/             # Pantalla de detalle de producto en tienda
│   │   ├── TarjetaEstadistica/          # Tarjeta de estadística individual
│   │   └── Tienda/                      # Componente principal de la tienda
│   │
│   └── ui/
│       └── Modal.tsx                    # Modal genérico reutilizable en toda la app
│
├── context/
│   └── AuthContext.tsx                  # Estado global de autenticación.
│                                        # Expone: user, token, isAuthenticated,
│                                        # isInitialized, login(), logout(), roleLabel
│
├── hooks/
│   └── useReadingTimer.ts               # ⏱ Hook del cronómetro de lectura.
│                                        # Pausa automática al cambiar pestaña.
│                                        # Exporta getFinishMessage() para el toast final.
│
├── service/                             # Capa de acceso a la API (axios)
│   ├── escuela.service.ts               # CRUD general de escuelas
│   ├── libros.service.ts                # Libros: listar, detalle, segmentos
│   ├── licencia.service.ts              # Validación y asignación de licencias
│   ├── vinculacion.service.ts           # Vinculación alumno–tutor
│   ├── admin/
│   │   └── usuarios/
│   │       ├── alumno.service.ts        # CRUD de alumnos (admin)
│   │       ├── director.service.ts      # CRUD de directores (admin)
│   │       ├── profesor.service.ts      # CRUD de profesores (admin)
│   │       ├── tutor.service.ts         # CRUD de tutores (admin)
│   │       ├── escuelas.service.ts      # CRUD de escuelas (admin)
│   │       ├── cargaMasivaAdmin.service.ts  # Carga masiva de usuarios por CSV
│   │       ├── vistausuario.service.ts  # Vista unificada de usuarios
│   │       └── index.ts                 # Re-exporta todos los servicios admin
│   ├── alumno/
│   │   └── libros.service.ts            # Libros del alumno: detalle, progreso
│   └── escuela/
│       ├── director.service.ts          # Operaciones del director
│       ├── maestro.service.ts           # Operaciones del maestro
│       ├── alumnos/
│       │   ├── alumno.service.ts        # Alumnos de la escuela
│       │   └── cargaMasiva.service.ts   # Carga masiva de alumnos (escuela)
│       ├── grupos/
│       │   └── grupo.service.ts         # Grupos: crear, editar, asignar
│       └── profesor/
│           └── profesor.service.ts      # Profesores de la escuela
│
├── types/                               # Definiciones TypeScript (interfaces y tipos)
│   ├── licencias.ts                     # Tipos de licencias
│   ├── admin/
│   │   ├── escuelas/
│   │   │   └── escuela.ts
│   │   └── usuarios/
│   │       ├── alumno.ts
│   │       ├── director.ts
│   │       ├── profesor.ts
│   │       ├── tutor.ts
│   │       ├── usuario.ts               # Tipo base de usuario
│   │       └── vistausuario.ts
│   ├── alumno/
│   │   └── libros.ts                    # LibroDetalle, Segmento, Progreso
│   ├── escuela/
│   │   └── profesor/
│   │       └── profesor.types.ts
│   ├── libros/                          # Tipos globales de libros
│   └── vinculacion/                     # Tipos de vinculación alumno–tutor
│
├── data/                                # Datos estáticos o mocks locales
├── assets/                              # Imágenes, íconos y recursos estáticos
└── utils/                               # Utilidades generales
    ├── api.ts                           # Instancia axios con baseURL y token en headers
    ├── toast.ts                         # Sistema de notificaciones toast personalizado
    └── formValidation.ts                # Helpers de validación de formularios
```

---

## Arquitectura de Seguridad

La protección de rutas está implementada en **dos capas**:

| Capa | Archivo | Cuándo actúa |
|---|---|---|
| **Server-side** | `middleware.ts` | Antes de renderizar cualquier HTML |
| **Client-side** | `RouteGuard.tsx` | En el navegador, al montar el layout |

El flujo de autenticación:
1. Login → el backend retorna `access_token` + `user`
2. `AuthContext` guarda token en `localStorage` y en **cookie** (para el middleware)
3. En cada navegación, el middleware lee la cookie, decodifica el JWT y verifica el rol
4. Si el rol no coincide con la ruta → redirige a la ruta home del rol correspondiente

## Roles del sistema

| `tipoPersona` | Ruta home | Panel |
|---|---|---|
| `administrador` | `/admin` | Gestión global del sistema |
| `director` | `/escuela` | Gestión de su institución |
| `maestro` | `/profesor` | Sus grupos y alumnos |
| `alumno` | `/alumno/store` | Biblioteca, tienda, estadísticas |
| `padre` | `/tutor` | Seguimiento de sus hijos |
