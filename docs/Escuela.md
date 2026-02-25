# Rutas de Escuela — Rol Director

Todas las rutas que puede usar un usuario con rol **director**. El director solo accede a **su escuela** (la del token); no puede ver ni modificar otras escuelas.

**Auth:** `Authorization: Bearer <token>` (usuario con tipoPersona = director).

**Base:** `{API}` (ej. `http://localhost:3000`).

---

## Resumen: rutas del director

Todas bajo **`/director`**. **No se envía ID de escuela**: el backend lo obtiene del token del director.

| Método | Ruta | Uso |
|--------|------|-----|
| GET | `/director/dashboard` | Dashboard de mi escuela (estadísticas) |
| GET | `/director/escuela` | Datos de mi escuela |
| GET | `/director/maestros` | Maestros de mi escuela |
| GET | `/director/alumnos` | Alumnos de mi escuela |
| GET | `/director/directores` | Directores de mi escuela |
| GET | `/director/libros` | Libros activos de mi escuela |
| GET | `/director/libros/pendientes` | Libros pendientes de canjear (otorgados por admin) |
| POST | `/director/canjear-libro` | Canjear libro con el código que dio el admin |

Además, el director puede **gestionar alumnos de su escuela** usando las rutas de personas (mismo token). **En ninguna de estas rutas el director envía `idEscuela`**: la escuela se toma siempre del token.

| Método | Ruta | Uso |
|--------|------|-----|
| POST | `/personas/registro-alumno` | Registrar alumno en su escuela |
| GET | `/personas/alumnos` | Listar alumnos de su escuela |
| GET | `/personas/alumnos/:id` | Ver un alumno por ID |
| PATCH | `/personas/alumnos/:id` | Editar alumno (solo de su escuela) |
| DELETE | `/personas/alumnos/:id` | Eliminar alumno (solo de su escuela) |

En PATCH y DELETE, el `:id` es el **ID del alumno** (registro en tabla alumno), no el ID de la persona.

---

## Rutas bajo `/director`

La escuela se toma del token; no se envía ningún ID de escuela.

---

### GET `/director/dashboard`

**Request**
- **Headers:** `Authorization: Bearer <token>`
- **Body:** ninguno
- **Query:** ninguno

**Respuesta 200**
```json
{
  "message": "Dashboard obtenido correctamente",
  "data": {
    "escuela": {
      "id": 1,
      "nombre": "Escuela Primaria Ejemplo",
      "nivel": "primaria",
      "clave": "EP001",
      "direccion": "Calle Principal 123",
      "telefono": "5550000"
    },
    "totalEstudiantes": 120,
    "totalProfesores": 15,
    "librosDisponibles": 8
  }
}
```

---

### GET `/director/escuela`

**Request**
- **Headers:** `Authorization: Bearer <token>`
- **Body:** ninguno
- **Query:** ninguno

**Respuesta 200**
```json
{
  "message": "Escuela obtenida exitosamente",
  "description": "La escuela fue encontrada en el sistema",
  "data": {
    "id": 1,
    "nombre": "Escuela Primaria Ejemplo",
    "nivel": "primaria",
    "clave": "EP001",
    "direccion": "Calle Principal 123",
    "telefono": "5550000",
    "estado": "activa",
    "ciudad": "Ciudad",
    "estadoRegion": "Estado",
    "directores": [
      {
        "id": 1,
        "personaId": 5,
        "persona": {
          "id": 5,
          "nombre": "Juan",
          "apellido": "Director",
          "correo": "director@escuela.com",
          "telefono": "5551111"
        }
      }
    ],
    "estadisticas": {
      "alumnos": 120,
      "profesores": 15,
      "grupos": 12
    }
  }
}
```

---

### GET `/director/maestros`

**Request**
- **Headers:** `Authorization: Bearer <token>`
- **Body:** ninguno
- **Query:** ninguno

**Respuesta 200**
```json
{
  "message": "Maestros de la escuela obtenidos correctamente.",
  "description": "La escuela tiene 15 maestro(s).",
  "total": 15,
  "data": [
    {
      "id": 1,
      "personaId": 10,
      "escuelaId": 1,
      "especialidad": "Matemáticas",
      "fechaContratacion": "2020-08-01",
      "persona": {
        "id": 10,
        "nombre": "Ana",
        "apellido": "Maestra",
        "correo": "ana@escuela.com",
        "telefono": "5552222"
      }
    }
  ]
}
```

---

### GET `/director/alumnos`

**Request**
- **Headers:** `Authorization: Bearer <token>`
- **Body:** ninguno
- **Query:** ninguno

**Respuesta 200**
```json
{
  "message": "Alumnos de la escuela obtenidos correctamente.",
  "description": "La escuela tiene 120 alumno(s).",
  "total": 120,
  "data": [
    {
      "id": 1,
      "personaId": 20,
      "escuelaId": 1,
      "padreId": null,
      "grado": 5,
      "grupo": "A",
      "cicloEscolar": "2024-2025",
      "persona": {
        "id": 20,
        "nombre": "Carlos",
        "apellido": "González",
        "correo": "carlos@mail.com",
        "telefono": null
      },
      "padre": {
        "id": 1,
        "parentesco": "padre",
        "persona": {
          "id": 30,
          "nombre": "Roberto",
          "apellido": "González",
          "correo": "roberto@mail.com",
          "telefono": "5553333"
        }
      }
    }
  ]
}
```

---

### GET `/director/directores`

**Request**
- **Headers:** `Authorization: Bearer <token>`
- **Body:** ninguno
- **Query:** ninguno

**Respuesta 200**
```json
{
  "message": "Directores de la escuela obtenidos correctamente.",
  "description": "La escuela tiene 2 director(es).",
  "total": 2,
  "data": [
    {
      "id": 1,
      "personaId": 5,
      "escuelaId": 1,
      "fechaNombramiento": "2022-01-15",
      "persona": {
        "id": 5,
        "nombre": "Juan",
        "apellido": "Director",
        "correo": "director@escuela.com",
        "telefono": "5551111"
      }
    }
  ]
}
```

---

### GET `/director/libros`

**Request**
- **Headers:** `Authorization: Bearer <token>`
- **Body:** ninguno
- **Query:** ninguno

**Respuesta 200**
```json
{
  "message": "Libros de la escuela obtenidos correctamente.",
  "description": "La escuela tiene 8 libro(s) asignado(s).",
  "total": 8,
  "data": [
    {
      "id": 1,
      "titulo": "Matemáticas 5º",
      "codigo": "LIB-1735123456-abc12345",
      "grado": 5,
      "activo": true,
      "fechaInicio": "2024-08-01",
      "fechaFin": null,
      "escuelaLibroId": 3,
      "materia": { "id": 1, "nombre": "Matemáticas" }
    }
  ]
}
```

---

### GET `/director/libros/pendientes`

**Request**
- **Headers:** `Authorization: Bearer <token>`
- **Body:** ninguno
- **Query:** ninguno

**Respuesta 200**
```json
{
  "message": "Libros pendientes de canjear obtenidos correctamente.",
  "description": "Hay 2 libro(s) pendientes de canjear. Solicita el código al administrador para activarlos.",
  "total": 2,
  "data": [
    {
      "titulo": "Español 4º",
      "grado": 4,
      "fechaOtorgado": "2024-08-15T10:00:00.000Z"
    }
  ]
}
```
*Nota:* El director no recibe el código en la respuesta; el admin se lo entrega aparte para canjear.

---

### POST `/director/canjear-libro`

**Request**
- **Headers:** `Authorization: Bearer <token>`
- **Body (JSON):**
```json
{
  "codigo": "LIB-1735123456-abc12345"
}
```
- **Query:** ninguno

**Respuesta 201**
```json
{
  "message": "Libro canjeado correctamente.",
  "description": "El libro \"Matemáticas 5º\" ya está activo en tu escuela.",
  "data": {
    "escuelaLibroId": 3,
    "escuelaId": 1,
    "libroId": 1,
    "codigo": "LIB-1735123456-abc12345",
    "titulo": "Matemáticas 5º",
    "fechaInicio": "2024-08-01T00:00:00.000Z"
  }
}
```

**Errores**
- **400:** El código no fue otorgado a tu escuela por el admin.
- **404:** No existe un libro con ese código.

---

## Gestión de alumnos (rutas bajo `/personas`)

El director usa las mismas rutas con su token. **No se envía `idEscuela`** en ningún caso; la escuela se toma del token.

---

### POST `/personas/registro-alumno` — Registrar alumno

**Request**
- **Headers:** `Authorization: Bearer <token>`
- **Body (JSON):**

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| nombre | string | sí | Nombre |
| apellidoPaterno | string | sí | Apellido paterno |
| apellidoMaterno | string | sí | Apellido materno |
| email | string | sí | Correo (único en el sistema) |
| password | string | sí | Mínimo 6 caracteres |
| telefono | string | no | Teléfono |
| fechaNacimiento | string | no | YYYY-MM-DD |
| idEscuela | number | no (director) | Director: no enviar; se usa la del token |
| grado | number | no | Grado escolar (ej. 1-6) |
| grupo | string | no | Grupo o sección (ej. "A") |
| cicloEscolar | string | no | Ej. "2024-2025" |

Ejemplo:
```json
{
  "nombre": "Carlos",
  "apellidoPaterno": "González",
  "apellidoMaterno": "Sánchez",
  "email": "carlos@mail.com",
  "password": "password123",
  "telefono": "5555555555",
  "fechaNacimiento": "2010-03-20",
  "grado": 5,
  "grupo": "A",
  "cicloEscolar": "2024-2025"
}
```

**Respuesta 201**
```json
{
  "message": "Alumno registrado exitosamente",
  "description": "El alumno ha sido creado correctamente. Puede iniciar sesión con su email y contraseña.",
  "data": {
    "id": 20,
    "nombre": "Carlos",
    "apellido": "González",
    "correo": "carlos@mail.com",
    "telefono": "5555555555",
    "fechaNacimiento": "2010-03-20T00:00:00.000Z",
    "genero": null,
    "alumno": {
      "id": 1,
      "personaId": 20,
      "escuelaId": 1,
      "grado": 5,
      "grupo": "A",
      "cicloEscolar": "2024-2025",
      "escuela": { "id": 1, "nombre": "Escuela Ejemplo", "nivel": "primaria" }
    }
  }
}
```

**Errores**
- **403:** Director envió `idEscuela` de otra escuela.
- **409:** El email ya está registrado.

---

### GET `/personas/alumnos` — Listar alumnos

**Request**
- **Headers:** `Authorization: Bearer <token>`
- **Body:** ninguno
- **Query (opcionales):**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| page | number | Página (1-based). Si se usa, también enviar `limit`. |
| limit | number | Cantidad por página (ej. 50). |
| escuelaId | number | Solo admin; director ignora (se usa la del token). |

**Respuesta 200**
```json
{
  "message": "Alumnos obtenidos exitosamente",
  "description": "Se encontraron 120 alumno(s).",
  "total": 120,
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 120,
    "totalPages": 3
  },
  "data": [
    {
      "id": 1,
      "personaId": 20,
      "escuelaId": 1,
      "padreId": 1,
      "grado": 5,
      "grupo": "A",
      "cicloEscolar": "2024-2025",
      "persona": {
        "id": 20,
        "nombre": "Carlos",
        "apellido": "González",
        "correo": "carlos@mail.com",
        "telefono": null
      },
      "escuela": { "id": 1, "nombre": "Escuela Ejemplo", "nivel": "primaria" },
      "padre": {
        "id": 1,
        "parentesco": "padre",
        "persona": {
          "id": 30,
          "nombre": "Roberto",
          "apellido": "González",
          "correo": "roberto@mail.com",
          "telefono": "5553333"
        }
      }
    }
  ]
}
```
*Nota:* `meta` solo viene si se enviaron `page` y `limit`.

---

### GET `/personas/alumnos/:id` — Ver un alumno

**Request**
- **Headers:** `Authorization: Bearer <token>`
- **Params:** `id` = ID del alumno (registro en tabla alumno, no el ID de persona).
- **Body:** ninguno
- **Query:** ninguno

**Respuesta 200**
```json
{
  "message": "Alumno obtenido exitosamente",
  "description": "Alumno encontrado en el sistema",
  "data": {
    "id": 1,
    "personaId": 20,
    "escuelaId": 1,
    "padreId": 1,
    "grado": 5,
    "grupo": "A",
    "cicloEscolar": "2024-2025",
    "persona": {
      "id": 20,
      "nombre": "Carlos",
      "apellido": "González",
      "correo": "carlos@mail.com",
      "telefono": null
    },
    "escuela": { "id": 1, "nombre": "Escuela Ejemplo", "nivel": "primaria" },
    "padre": {
      "id": 1,
      "parentesco": "padre",
      "persona": {
        "id": 30,
        "nombre": "Roberto",
        "apellido": "González",
        "correo": "roberto@mail.com",
        "telefono": "5553333"
      }
    }
  }
}
```

**Errores**
- **404:** Alumno no encontrado o no pertenece a la escuela del director.

---

### PATCH `/personas/alumnos/:id` — Editar alumno

**Request**
- **Headers:** `Authorization: Bearer <token>`
- **Params:** `id` = ID del alumno (registro alumno).
- **Body (JSON):** todos los campos opcionales; solo se envían los que se quieren cambiar.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| nombre | string | Nombre |
| apellido | string | Apellido |
| correo | string | Correo (debe ser único) |
| telefono | string | Teléfono |
| fechaNacimiento | string | YYYY-MM-DD |
| genero | string | Género |
| password | string | Nueva contraseña (mín. 6) |
| activo | boolean | Usuario activo/inactivo |

Ejemplo:
```json
{
  "nombre": "Carlos",
  "apellido": "González López",
  "correo": "carlos.nuevo@mail.com",
  "telefono": "5559999999"
}
```

**Respuesta 200**
```json
{
  "message": "Usuario actualizado correctamente",
  "data": {
    "id": 20,
    "nombre": "Carlos",
    "apellido": "González López",
    "correo": "carlos.nuevo@mail.com",
    "telefono": "5559999999",
    "fechaNacimiento": "2010-03-20T00:00:00.000Z",
    "genero": null,
    "tipoPersona": "alumno",
    "activo": true,
    "administrador": null,
    "director": null,
    "maestro": null,
    "alumno": { "id": 1, "personaId": 20, "escuelaId": 1, "grado": 5, "grupo": "A" },
    "padre": null
  }
}
```

**Errores**
- **404:** Alumno no encontrado o no de su escuela.
- **409:** El correo ya está en uso por otro usuario.

---

### DELETE `/personas/alumnos/:id` — Eliminar alumno

**Request**
- **Headers:** `Authorization: Bearer <token>`
- **Params:** `id` = ID del alumno (registro alumno).
- **Body:** ninguno
- **Query:** ninguno

**Respuesta 200**
```json
{
  "message": "Usuario eliminado correctamente",
  "description": "Se eliminó el usuario con ID 20 (alumno)."
}
```

**Errores**
- **404:** Alumno no encontrado o no pertenece a la escuela del director.

---

## Flujo típico del director

1. **Entrar al panel:** GET `/director/dashboard`.
2. **Ver datos de mi escuela:** GET `/director/escuela`.
3. **Ver maestros:** GET `/director/maestros`.
4. **Ver alumnos:** GET `/director/alumnos` o GET `/personas/alumnos` (con paginación opcional).
5. **Registrar alumno:** POST `/personas/registro-alumno` (sin `idEscuela`).
6. **Ver/editar/eliminar alumno:** GET/PATCH/DELETE `/personas/alumnos/:id` (el `:id` es el ID del alumno).
7. **Ver libros:** GET `/director/libros`; pendientes: GET `/director/libros/pendientes`; canjear: POST `/director/canjear-libro` con `{ "codigo": "..." }`.

No hace falta enviar ni guardar el ID de la escuela; todo se resuelve con el **Bearer token** del director.
































### Registro de maestro (profesor) para escuela

Permite dar de alta a un profesor/maestro vinculado a una escuela. Quien registra puede ser **Administrador** o **Director**.

| Aspecto | Detalle |
|--------|---------|
| **Endpoint** | `POST /personas/registro-maestro` |
| **Autenticación** | JWT obligatorio (`Authorization: Bearer <token>`) |
| **Roles** | Administrador o Director (`AdminOrDirectorGuard`) |

#### Quién puede registrar y uso de `idEscuela`

- **Administrador:** puede registrar maestros en **cualquier** escuela. Debe enviar siempre `idEscuela` en el body. Si omite `idEscuela` → **400** "Debe indicar el ID de la escuela (idEscuela)".
- **Director:** solo puede registrar maestros en **su propia escuela**. Puede omitir `idEscuela` (se usa automáticamente la escuela del token). Si envía un `idEscuela` distinto al de su escuela → **403** "Los directores solo pueden registrar maestros en su propia escuela".

#### Body (JSON)

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `nombre` | string | Sí | Nombre (máx. según `NAME_MAX_LENGTH`) |
| `apellidoPaterno` | string | Sí | Apellido paterno |
| `apellidoMaterno` | string | Sí | Apellido materno |
| `email` | string | Sí | Correo único en el sistema (formato válido) |
| `password` | string | Sí | Contraseña (mín. 6 caracteres) |
| `idEscuela` | number | Admin: sí / Director: no | ID de la escuela. Director puede omitirlo. |
| `telefono` | string | No | Teléfono (máx. según `PHONE_MAX_LENGTH`) |
| `fechaNacimiento` | string | No | Fecha en formato `YYYY-MM-DD` |
| `especialidad` | string | No | Especialidad o materia (máx. 100 caracteres) |
| `fechaIngreso` | string | No | Fecha de ingreso en la escuela, `YYYY-MM-DD` |

#### Ejemplo de petición (admin)

```http
POST /personas/registro-maestro
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "nombre": "Ana",
  "apellidoPaterno": "Rodríguez",
  "apellidoMaterno": "Fernández",
  "email": "maestro@example.com",
  "password": "password123",
  "idEscuela": 1,
  "especialidad": "Matemáticas",
  "fechaIngreso": "2020-08-01",
  "telefono": "5551234567"
}
```

#### Ejemplo de petición (director, sin idEscuela)

El director no envía `idEscuela`; el backend usa la escuela asociada a su token.

```json
{
  "nombre": "Luis",
  "apellidoPaterno": "García",
  "apellidoMaterno": "López",
  "email": "luis.garcia@escuela.edu",
  "password": "claveSegura1"
}
```

#### Respuesta exitosa (201)

El servicio devuelve el objeto de la persona creada y la relación con la escuela (maestro). En caso de éxito no se devuelve la contraseña.

#### Errores posibles

| Código | Situación |
|--------|-----------|
| **400** | Falta `idEscuela` (solo cuando quien llama es admin). Body inválido o campos obligatorios faltantes. |
| **403** | Director intenta registrar en una escuela que no es la suya. |
| **409** | El email ya está registrado ("El email ya está registrado"). |
| **404** | La escuela indicada no existe ("No se encontró la escuela con ID X"). |

#### Auditoría

La acción se registra en el log de auditoría como `registro_maestro` (ver sección [Auditoría](#7-auditoría)).

#### Listar maestros de una escuela

Para ver los maestros ya registrados en una escuela:

- **GET /escuelas/:id/maestros** — Requiere permisos (admin o director de esa escuela). Devuelve la lista de maestros de la escuela.
