# Estructura del Proyecto "Proyecto Lector"

Este documento proporciona una descripción detallada de la estructura de directorios y archivos del proyecto. El objetivo es facilitar la navegación y comprensión del código para los desarrolladores.

## Raíz del Proyecto

Archivos y carpetas en el nivel principal:

*   **`.env.local`**: Variables de entorno locales (probablemente claves de API o configuraciones secretas que no se deben subir al repositorio).
*   **`.git/`**: Directorio de control de versiones de Git.
*   **`.gitignore`**: Especifica qué archivos y carpetas deben ser ignorados por Git (ej. `node_modules`, `.env.local`).
*   **`.next/`**: Directorio generado automáticamente por Next.js durante el desarrollo y la compilación.
*   **`.vscode/`**: Configuraciones específicas del editor VS Code para este proyecto.
*   **`docs/`**: Documentación técnica adicional del sistema.
    *   `API_DOCUMENTACION_FRONTEND.md`: Documentación de la API utilizada por el frontend.
    *   `FLUJO_SISTEMA.md`: Descripción de los flujos de usuario y lógica del sistema.
*   **`node_modules/`**: Dependencias del proyecto instaladas por `npm`.
*   **`public/`**: Archivos estáticos accesibles públicamente desde la URL base (ej. `/favicon.ico`).
    *   Contiene imágenes vectoriales SVG (`file.svg`, `globe.svg`, etc.) usadas probablemente como iconos o ilustraciones de ejemplo.
*   **`src/`**: Código fuente principal de la aplicación. (Ver detalle más abajo).
*   **`package.json`**: Manifiesto del proyecto. Define scripts (`dev`, `build`, `start`), dependencias (`next`, `react`, `tailwindcss`) y metadatos.
*   **`package-lock.json`**: Árbol de dependencias exacto para asegurar instalaciones consistentes.
*   **`tsconfig.json`**: Configuración de TypeScript para el proyecto.
*   **`next.config.ts`**: Archivo de configuración de Next.js.
*   **`eslint.config.mjs`**: Configuración de ESLint para el análisis de código estático.

---

## `src/` (Source Code)

El núcleo de la aplicación.

### `src/app/` (Next.js App Router)
Contiene las páginas y rutas de la aplicación. Cada carpeta representa un segmento de la URL.

*   **`layout.tsx`**: Layout raíz que envuelve a toda la aplicación.
*   **`page.tsx`**: Página de inicio (`/`).
*   **`globals.css`**: Estilos globales CSS.
*   **`admin/`**: Rutas para el panel de administrador.
*   **`alumno/`**: Rutas para el panel de alumno.
*   **`escuela/`**: Rutas para el panel de escuela.
*   **`profesor/`**: Rutas para el panel de profesor.
*   **`tutor/`**: Rutas para el panel de tutor.
*   **`login/`**: Página de inicio de sesión.
*   **`registro/`**: Página de registro de usuarios.

### `src/components/`
Componentes de React reutilizables. Esta carpeta está altamente organizada por módulos o roles.

#### `src/components/admin/`
Componentes específicos para el panel de administración.
*   **`escuelas/`**: Gestión de escuelas.
    *   `AddEscuelaModal.tsx`: Modal para agregar una nueva escuela.
    *   `EscuelaForm.tsx`: Formulario para crear o editar datos de una escuela.
    *   `EscuelaTable.tsx`: Tabla que lista las escuelas registradas.
*   **`usuarios/`**: Directorio para gestión de usuarios (actualmente vacío).

#### `src/components/alumno/`
Componentes específicos para el panel del alumno.
*   **`CanjeCodigo/`**: Módulo para canjear códigos de libros.
    *   `index.tsx`: Componente principal del canje.
    *   `styles.module.css`: Estilos específicos para este módulo.
*   **`DetalleProducto/`**: Vista detallada de un libro o producto en la tienda.
    *   `index.tsx`: Lógica y renderizado del detalle.
    *   `styles.module.css`: Estilos específicos.
*   **`TarjetaEstadistica/`**: Cards que muestran estadísticas (ej. libros leídos, horas).
    *   `index.tsx`: Componente visual de la tarjeta.
*   **`TarjetaLibro/`**: Componente para mostrar un libro individual (portada, título).
    *   `index.tsx`: Componente visual.
    *   `styles.module.css`: Estilos de la tarjeta de libro.
*   **`Tienda/`**: Interfaz de la tienda de libros.
    *   `index.tsx`: Componente principal de la tienda.

#### `src/components/escuela/`
Componentes específicos para el panel de usuarios tipo "Escuela".
*   **`alumnos/`**: Gestión de alumnos por parte de la escuela.
    *   `AddAlumnoModal.tsx`: Modal para registrar un nuevo alumno.
    *   `AlumnoForm.tsx`: Formulario de datos del alumno.
    *   `AlumnoTable.tsx`: Tabla para listar alumnos gestionados por la escuela.

#### `src/components/LoginBook/`
Efecto visual y formulario de login con animación de libro.
*   `index.tsx`: Componente principal que contiene la lógica y animación.
*   `styles.module.css`: Estilos CSS para lograr el efecto 3D del libro.

#### `src/components/MenuLateral/`
Sistema de navegación (Sidebar). Utiliza un componente base y wrappers específicos por rol.
*   `index.tsx`: Punto de entrada o exportación del sidebar.
*   `MenuBase.tsx`: Estructura común del menú lateral (estilos, contenedores).
*   `SidebarAdmin.tsx`: Menú configurado para Administradores.
*   `SidebarAlumno.tsx`: Menú configurado para Alumnos.
*   `SidebarEscuela.tsx`: Menú configurado para Escuelas.
*   `SidebarProfesor.tsx`: Menú configurado para Profesores.
*   `SidebarTutor.tsx`: Menú configurado para Tutores.

#### `src/components/libros/`
Componentes generales relacionados con libros.
*   `LibroTable.tsx`: Tabla genérica o específica para listar libros.

#### `src/components/ui/`
Componentes de interfaz de usuario genéricos y reutilizables en toda la app.
*   `Button.tsx`: Botón estandarizado.
*   `Input.tsx`: Campo de entrada de texto estandarizado.
*   `Modal.tsx`: Componente base para ventanas modales (popups).

#### Archivos sueltos en `src/components/`
*   `ContinuarLectura.tsx`: Componente (probablemente un carrusel o card) para que el usuario retome su lectura reciente.

### `src/service/`
Capa de comunicación con el Backend o lógica de negocio.

*   **`alumno.service.ts`**: Funciones para peticiones relacionadas con alumnos.
*   **`escuela.service.ts`**: Funciones para peticiones relacionadas con escuelas.

### `src/types/`
Definiciones de tipos de TypeScript e interfaces.

*   **`escuela.ts`**: Interfaces que definen la estructura de datos de una "Escuela".

### `src/data/`
Datos estáticos o "mock data" para desarrollo o constantes.

*   **`libros.ts`**: Probablemente contiene una lista de libros "quemada" en código para pruebas o uso inicial.

### `src/utils/`
Funciones de utilidad y helpers generales.

*   **`api.ts`**: Configuración de la instancia de Axios o cliente HTTP base.

### `src/assets/`
Recursos estáticos importados desde el código (imágenes, fuentes, etc.).

*   **`react.svg`**: Logo de React.

---

## Resumen de Tecnologías

*   **Framework**: Next.js 15 (App Router)
*   **Lenguaje**: TypeScript
*   **Estilos**: Tailwind CSS 4
*   **UI Library**: React 19
