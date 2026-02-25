# Rutas API – Solo Administrador

Documento para el equipo de frontend. Todas las rutas requieren **JWT** en header: `Authorization: Bearer <access_token>`.

---

## 1. Auth

### POST `/auth/registro-admin`
Registrar nuevo administrador (máx. 5).

| Cómo lo mando | Valor |
|---------------|-------|
| Método | `POST` |
| Headers | `Authorization: Bearer <token>`, `Content-Type: application/json` |
| Body | JSON (ver abajo) |

**Body:**
```json
{
  "nombre": "Juan",
  "apellidoPaterno": "Pérez",
  "apellidoMaterno": "García",
  "email": "admin@example.com",
  "password": "password123",
  "telefono": "1234567890",
  "fechaNacimiento": "1990-01-01",
  "nivel": "super"
}
```

| Campo | Tipo | Obligatorio |
|-------|------|-------------|
| nombre | string | Sí |
| apellidoPaterno | string | Sí |
| apellidoMaterno | string | Sí |
| email | string | Sí |
| password | string | Sí (mín. 6) |
| telefono | string | No |
| fechaNacimiento | string | No (YYYY-MM-DD) |
| nivel | string | No |

**Recibo (201):**
```json
{
  "message": "Administrador registrado exitosamente",
  "description": "El administrador ha sido creado correctamente. Total de administradores: 4/5",
  "data": {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "correo": "admin@example.com",
    "tipoPersona": "administrador"
  },
  "administrador": {
    "id": 1,
    "fechaAlta": "2025-02-06T12:00:00.000Z"
  }
}
```

**Errores:** 401, 403 (autenticacion), 409 (email duplicado o límite de 5 admins).

---






















## 2. Personas

### GET `/personas/admins`
Listar todos los administradores.

| Cómo lo mando | Valor |
|---------------|-------|
| Método | `GET` |
| Headers | `Authorization: Bearer <token>` |

**Recibo (200):**
```json
{
  "message": "Administradores obtenidos exitosamente",
  "description": "Se encontraron 3 administrador(es) en el sistema",
  "total": 3,
  "data": [
    {
      "idPersona": 1,
      "nombre": "Admin",
      "email": "admin@example.com",
      "tipoPersona": "administrador"
    }
  ]
}
```

---

### GET `/personas/admins/cantidad`
Cantidad de admins y cupo restante.

| Cómo lo mando | Valor |
|---------------|-------|
| Método | `GET` |
| Headers | `Authorization: Bearer <token>` |

**Recibo (200):**
```json
{
  "cantidad": 3,
  "maxAdmins": 5,
  "mensaje": "Puedes registrar 2 administrador(es) más"
}
```

 












### POST `/personas/registro-padre`
Registrar padre/tutor.

| Cómo lo mando | Valor |
|---------------|-------|
| Método | `POST` |
| Headers | `Authorization: Bearer <token>`, `Content-Type: application/json` |
| Body | JSON |

**Body:**
```json
{
  "nombre": "María",
  "apellidoPaterno": "López",
  "apellidoMaterno": "Martínez",
  "email": "padre@example.com",
  "password": "password123",
  "telefono": "0987654321",
  "fechaNacimiento": "1985-05-15",
  "alumnoId": 1
}
```

| Campo | Tipo | Obligatorio |
|-------|------|-------------|
| nombre | string | Sí |
| apellidoPaterno | string | Sí |
| apellidoMaterno | string | Sí |
| email | string | Sí |
| password | string | Sí (mín. 6) |
| telefono | string | No |
| fechaNacimiento | string | No (YYYY-MM-DD) |
| alumnoId | number | No (vincula padre con alumno) |

**Recibo (201):**
```json
{
  "message": "Padre registrado exitosamente",
  "description": "El padre/tutor ha sido creado correctamente.",
  "data": {
    "idPersona": 1,
    "nombre": "María",
    "email": "padre@example.com",
    "tipoPersona": "padre"
  }
}
```

---





















### POST `/personas/registro-director`
Registrar director de escuela.

| Cómo lo mando | Valor |
|---------------|-------|
| Método | `POST` |
| Headers | `Authorization: Bearer <token>`, `Content-Type: application/json` |
| Body | JSON |

**Body:**
```json
{
  "nombre": "Juan",
  "apellidoPaterno": "Pérez",
  "apellidoMaterno": "García",
  "email": "director@example.com",
  "password": "password123",
  "idEscuela": 1,
  "telefono": "5551234567",
  "fechaNacimiento": "1975-05-15",
  "fechaNombramiento": "2020-01-15"
}
```

| Campo | Tipo | Obligatorio |
|-------|------|-------------|
| nombre | string | Sí |
| apellidoPaterno | string | Sí |
| apellidoMaterno | string | Sí |
| email | string | Sí |
| password | string | Sí (mín. 6) |
| idEscuela | number | Sí |
| telefono | string | No |
| fechaNacimiento | string | No (YYYY-MM-DD) |
| fechaNombramiento | string | No (YYYY-MM-DD) |

**Recibo (201):**
```json
{
  "message": "Director registrado exitosamente",
  "description": "El director ha sido creado correctamente.",
  "data": {
    "idPersona": 1,
    "nombre": "Juan",
    "email": "director@example.com",
    "tipoPersona": "director"
  }
}
```

---






























### GET `/personas/padres`
Listar todos los padres. Paginación opcional.

| Cómo lo mando | Valor |
|---------------|-------|
| Método | `GET` |
| Headers | `Authorization: Bearer <token>` |
| Query | `?page=1&limit=20` (opcional) |

**Recibo (200):** Lista de padres con sus alumnos.

---

### GET `/personas/padres/:id`
Obtener padre por ID con sus hijos.

| Cómo lo mando | Valor |
|---------------|-------|
| Método | `GET` |
| Headers | `Authorization: Bearer <token>` |
| Params | `id` = ID del padre |

**Recibo (200):** Padre con sus alumnos.

---


### GET `/personas/padres/:id/alumnos`
Listar alumnos (hijos) de un padre.

| Cómo lo mando | Valor |
|---------------|-------|
| Método | `GET` |
| Headers | `Authorization: Bearer <token>` |
| Params | `id` = ID del padre |

**Recibo (200):** Lista de alumnos del padre.

---
























## 3. Escuelas

### POST `/escuelas`
Crear escuela.

| Cómo lo mando | Valor |
|---------------|-------|
| Método | `POST` |
| Headers | `Authorization: Bearer <token>`, `Content-Type: application/json` |
| Body | JSON |

**Body:**
```json
{
  "nombre": "Escuela Primaria Benito Juárez",
  "nivel": "Primaria",
  "clave": "29DPR0123X",
  "direccion": "Calle Principal #123",
  "telefono": "5551234567"
}
```

| Campo | Tipo | Obligatorio | Límite |
|-------|------|-------------|--------|
| nombre | string | Sí | 150 |
| nivel | string | Sí | 50 |
| clave | string | No | 50 |
| direccion | string | No | 200 |
| telefono | string | No | 20 |

**Recibo (201):**
```json
{
  "message": "Escuela creada exitosamente",
  "description": "La escuela ha sido registrada correctamente en el sistema.",
  "data": {
    "id": 1,
    "nombre": "Escuela Primaria Benito Juárez",
    "nivel": "Primaria",
    "clave": "29DPR0123X",
    "direccion": "Calle Principal #123",
    "telefono": "5551234567"
  }
}
```

---


























### GET `/escuelas`
Listar todas las escuelas.

| Cómo lo mando | Valor |
|---------------|-------|
| Método | `GET` |
| Headers | `Authorization: Bearer <token>` |
| Query | `?page=1&limit=20` (opcional) |

**Recibo (200):**
```json
{
  "message": "Escuelas obtenidas exitosamente",
  "description": "Se encontraron 5 escuela(s) en el sistema",
  "total": 5,
  "data": [
    {
      "id": 1,
      "nombre": "Escuela Primaria Benito Juárez",
      "nivel": "Primaria",
      "clave": "29DPR0123X",
      "direccion": "Calle Principal #123",
      "telefono": "5551234567"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 5, "totalPages": 1 }
}
```

---













### PUT `/escuelas/:id`
Actualizar escuela.

| Cómo lo mando | Valor |
|---------------|-------|
| Método | `PUT` |
| Headers | `Authorization: Bearer <token>`, `Content-Type: application/json` |
| Params | `id` = ID de la escuela |
| Body | JSON (solo campos a actualizar) |

**Body (todos opcionales):**
```json
{
  "nombre": "Nuevo nombre",
  "nivel": "Primaria",
  "clave": "29DPR0123X",
  "direccion": "Nueva dirección",
  "telefono": "5551234567"
}
```

**Recibo (200):** Escuela actualizada.

---


















### DELETE `/escuelas/:id`
Eliminar escuela.

| Cómo lo mando | Valor |
|---------------|-------|
| Método | `DELETE` |
| Headers | `Authorization: Bearer <token>` |
| Params | `id` = ID de la escuela |

**Recibo (200):**
```json
{
  "message": "Escuela eliminada exitosamente",
  "description": "La escuela ha sido eliminada del sistema."
}
```

**Errores:** 400 si tiene alumnos o maestros asociados.

---
















### POST `/escuelas/:id/libros`
Otorgar libro a la escuela (Paso 1). La escuela debe canjear después.

| Cómo lo mando | Valor |
|---------------|-------|
| Método | `POST` |
| Headers | `Authorization: Bearer <token>`, `Content-Type: application/json` |
| Params | `id` = ID de la escuela |
| Body | JSON |

**Body:**
```json
{
  "codigo": "LIB-1735123456-abc12345"
}
```

| Campo | Tipo | Obligatorio |
|-------|------|-------------|
| codigo | string | Sí (código del libro) |

**Recibo (201):** Libro otorgado; la escuela debe canjear el código.

**Errores:** 404 (escuela o libro no encontrado), 409 (ya otorgado o canjeado).

--






### GET `/personas/alumnos`
Listar alumnos. Admin ve todos; se puede filtrar por escuela. Incluye persona, escuela y padre (si tiene).

| Cómo lo mando | Valor |
|---------------|-------|
| Método | `GET` |
| Headers | `Authorization: Bearer <token>` |
| Query | `escuelaId`, `page`, `limit` (todos opcionales) |

| Query | Tipo | Descripción |
|-------|------|-------------|
| escuelaId | number | Filtrar por ID de escuela |
| page | number | Página (paginación) |
| limit | number | Cantidad por página |

**Recibo (200):**
```json
{
  "message": "Alumnos obtenidos exitosamente",
  "description": "Se encontraron 2 alumno(s)",
  "total": 2,
  "meta": { "page": 1, "limit": 10, "total": 2, "totalPages": 1 },
  "data": [
    {
      "id": 1,
      "personaId": 5,
      "escuelaId": 1,
      "padreId": null,
      "grado": "3",
      "grupo": "A",
      "cicloEscolar": "2024-2025",
      "persona": { "id": 5, "nombre": "Ana", "apellido": "López", "correo": "ana@example.com", "telefono": "5551234" },
      "escuela": { "id": 1, "nombre": "Escuela Primaria", "nivel": "primaria" },
      "padre": null
    }
  ]
}
```

Sin `page` y `limit` se devuelven todos (sin objeto `meta`).

**Errores:** 401, 403.

























---

### GET `/personas/alumnos/:id`
Obtener un alumno por ID (con persona, escuela y padre si tiene).

| Cómo lo mando | Valor |
|---------------|-------|
| Método | `GET` |
| Headers | `Authorization: Bearer <token>` |
| Params | `id` = ID del alumno |

**Recibo (200):**
```json
{
  "message": "Alumno obtenido exitosamente",
  "description": "Alumno encontrado en el sistema",
  "data": {
    "id": 1,
    "personaId": 5,
    "escuelaId": 1,
    "padreId": 2,
    "grado": "3",
    "grupo": "A",
    "cicloEscolar": "2024-2025",
    "persona": { "id": 5, "nombre": "Ana", "apellido": "López", "correo": "ana@example.com", "telefono": "5551234" },
    "escuela": { "id": 1, "nombre": "Escuela Primaria", "nivel": "primaria" },
    "padre": {
      "id": 2,
      "parentesco": "madre",
      "persona": { "id": 8, "nombre": "María", "apellido": "López", "correo": "maria@example.com", "telefono": "5555678" }
    }
  }
}
```

**Errores:** 401, 403, 404 (alumno no encontrado).

---
-




















## 4. Libros

### POST `/libros/cargar`
Cargar libro (PDF + metadatos).

| Cómo lo mando | Valor |
|---------------|-------|
| Método | `POST` |
| Headers | `Authorization: Bearer <token>` (sin Content-Type; se usa multipart) |
| Body | `multipart/form-data` |

**FormData:**
| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| pdf | File | Sí | Archivo PDF (máx. 50 MB) |
| titulo | string | Sí | Título (máx. 150) |
| grado | number | Sí | Grado escolar |
| descripcion | string | No | Máx. 255 |
| codigo | string | No | Si no se envía, se genera |
| materiaId | number | No | Opcional |

**Ejemplo (fetch):**
```js
const form = new FormData();
form.append('pdf', fileInput.files[0]);
form.append('titulo', 'El principito');
form.append('grado', 5);
form.append('descripcion', 'Libro de lectura');

await fetch(`${BASE_URL}/libros/cargar`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: form,
});
```

**Recibo (201):**
```json
{
  "message": "Libro cargado exitosamente",
  "data": {
    "id": 1,
    "titulo": "El principito",
    "codigo": "LIB-1735123456-abc12345",
    "grado": 5,
    "descripcion": "Libro de lectura",
    "estado": "listo",
    "numPaginas": 15,
    "unidades": []
  }
}
```

---























### GET `/libros`
Listar todos los libros.

| Cómo lo mando | Valor |
|---------------|-------|
| Método | `GET` |
| Headers | `Authorization: Bearer <token>` |

**Recibo (200):**
```json
{
  "message": "Libros obtenidos correctamente.",
  "total": 2,
  "data": [
    {
      "id": 1,
      "titulo": "El principito",
      "materiaId": null,
      "codigo": "LIB-1735123456-abc12345",
      "grado": 5,
      "descripcion": "Libro de lectura",
      "estado": "listo",
      "numPaginas": 15,
      "materia": null
    }
  ]
}
```

---












### DELETE `/libros/:id`
Eliminar libro por completo.

| Cómo lo mando | Valor |
|---------------|-------|
| Método | `DELETE` |
| Headers | `Authorization: Bearer <token>` |
| Params | `id` = ID del libro |

**Recibo (200):** Libro eliminado.

---

## 5. Auditoría

### GET `/audit`
Listar logs de auditoría.

| Cómo lo mando | Valor |
|---------------|-------|
| Método | `GET` |
| Headers | `Authorization: Bearer <token>` |
| Query | `?page=1&limit=20` (opcional) |

**Recibo (200):**
```json
{
  "message": "Logs de auditoría obtenidos correctamente",
  "total": 50,
  "meta": { "page": 1, "limit": 20, "total": 50, "totalPages": 3 },
  "data": [
    {
      "id": 1,
      "accion": "login",
      "usuarioId": 1,
      "ip": "192.168.1.1",
      "detalles": "admin@example.com",
      "fecha": "2025-02-04T12:00:00.000Z"
    }
  ]
}
```

---



















## Resumen tabla

| Método | Ruta | Body / Params |
|--------|------|---------------|
| POST | `/auth/registro-admin` | `{ nombre, apellidoPaterno, apellidoMaterno, email, password, telefono?, fechaNacimiento?, nivel? }` |
| GET | `/personas/admins` | — |
| GET | `/personas/admins/cantidad` | — |
| POST | `/personas/registro-padre` | `{ nombre, apellidoPaterno, apellidoMaterno, email, password, telefono?, fechaNacimiento?, alumnoId? }` |
| POST | `/personas/registro-director` | `{ nombre, apellidoPaterno, apellidoMaterno, email, password, idEscuela, telefono?, fechaNacimiento?, fechaNombramiento? }` |
| GET | `/personas/padres` | Query: `?page=&limit=` |
| GET | `/personas/padres/:id` | Params: `id` |
| GET | `/personas/padres/:id/alumnos` | Params: `id` |
| POST | `/escuelas` | `{ nombre, nivel, clave?, direccion?, telefono? }` |
| GET | `/escuelas` | Query: `?page=&limit=` |
| PUT | `/escuelas/:id` | `{ nombre?, nivel?, clave?, direccion?, telefono? }` |
| DELETE | `/escuelas/:id` | Params: `id` |
| POST | `/escuelas/:id/libros` | `{ codigo }` |
| POST | `/libros/cargar` | FormData: `pdf`, `titulo`, `grado`, `descripcion?`, `codigo?`, `materiaId?` |
| GET | `/libros` | — |
| DELETE | `/libros/:id` | Params: `id` |
| GET | `/audit` | Query: `?page=&limit=` |

---

















### GET `/personas/alumnos/buscar`
Buscar alumnos por **un solo campo**: tú eliges el campo y el valor. Los textos se buscan con “contiene” (parcial); grado y escuelaId son exactos.

| Cómo lo mando | Valor |
|---------------|-------|
| Método | `GET` |
| Headers | `Authorization: Bearer <token>` |
| Query | **Obligatorios:** `campo`, `valor`. **Opcionales:** `escuelaId`, `page`, `limit` |

| Query | Tipo | Descripción |
|-------|------|-------------|
| campo | string | Uno de: `nombre`, `apellido`, `correo`, `telefono`, `grado`, `grupo`, `cicloEscolar`, `escuelaId` |
| valor | string | Valor a buscar (texto parcial o número para grado/escuelaId) |
| escuelaId | number | Filtrar por escuela (admin) |
| page | number | Página |
| limit | number | Cantidad por página |

**Ejemplos:**
- Por nombre: `GET /personas/alumnos/buscar?campo=nombre&valor=Ana`
- Por correo: `GET /personas/alumnos/buscar?campo=correo&valor=@escuela`
- Por grado: `GET /personas/alumnos/buscar?campo=grado&valor=3`
- Por escuela: `GET /personas/alumnos/buscar?campo=escuelaId&valor=1`

**Recibo (200):** Mismo formato que `GET /personas/alumnos` (lista en `data`, `total`, `meta` si hay paginación).

**Errores:** 400 (campo no permitido, valor vacío o falta campo/valor), 401, 403.















---

### GET `/personas/alumnos/:id`
Obtener un alumno por ID (con persona, escuela y padre si tiene).

| Cómo lo mando | Valor |
|---------------|-------|
| Método | `GET` |
| Headers | `Authorization: Bearer <token>` |
| Params | `id` = ID del alumno |

**Recibo (200):**
```json
{
  "message": "Alumno obtenido exitosamente",
  "description": "Alumno encontrado en el sistema",
  "data": {
    "id": 1,
    "personaId": 5,
    "escuelaId": 1,
    "padreId": 2,
    "grado": "3",
    "grupo": "A",
    "cicloEscolar": "2024-2025",
    "persona": { "id": 5, "nombre": "Ana", "apellido": "López", "correo": "ana@example.com", "telefono": "5551234" },
    "escuela": { "id": 1, "nombre": "Escuela Primaria", "nivel": "primaria" },
    "padre": {
      "id": 2,
      "parentesco": "madre",
      "persona": { "id": 8, "nombre": "María", "apellido": "López", "correo": "maria@example.com", "telefono": "5555678" }
    }
  }
}
```

**Errores:** 401, 403, 404 (alumno no encontrado).

---













Todas las rutas requieren JWT de administrador en el header:
Authorization: Bearer <token>
1. Actualizar usuario (cualquier rol)
Actualiza datos de un usuario por ID. No se puede cambiar el rol del usuario.
Método	PATCH
Ruta	/admin/usuarios/:id
Auth	Bearer JWT (rol administrador)
Content-Type	application/json
Parámetros de ruta
Parámetro	Tipo	Descripción
id	number	ID de la persona (usuario). Es el mismo id que devuelve GET /admin/usuarios en cada elemento de data.
Body (todos los campos opcionales)
Campo	Tipo	Descripción
nombre	string	Max 100 caracteres.
apellido	string	Max 100 caracteres.
correo	string	Email. Debe ser único en el sistema.
telefono	string	Max 20 caracteres.
fechaNacimiento	string	Fecha en formato YYYY-MM-DD.
genero	string	Max 30 caracteres.
password	string	Mínimo 6 caracteres. Si no se envía, se mantiene la contraseña actual.
activo	boolean	true = activo, false = inactivo.
No existe campo para cambiar el rol; el rol del usuario no se modifica.
Respuestas
200 OK – Usuario actualizado. El body incluye message y data (objeto usuario actualizado, sin password).
400 – Datos inválidos o correo ya en uso por otro usuario.
401 – No autenticado o token inválido.
403 – No es administrador.
404 – No existe usuario con ese id.
Ejemplo de request
PATCH /admin/usuarios/42Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...Content-Type: application/json{  "nombre": "María",  "apellido": "García López",  "correo": "maria.garcia@ejemplo.com",  "telefono": "5551234567",  "activo": true}
Ejemplo de response 200
{  "message": "Usuario actualizado correctamente",  "data": {    "id": 42,    "nombre": "María",    "apellido": "García López",    "correo": "maria.garcia@ejemplo.com",    "telefono": "5551234567",    "fechaNacimiento": null,    "genero": null,    "tipoPersona": "maestro",    "activo": true  }}
2. Eliminar usuario (cualquier rol)
Elimina un usuario del sistema (administrador, director, maestro, alumno o padre).
Método	DELETE
Ruta	/admin/usuarios/:id
Auth	Bearer JWT (rol administrador)
Parámetros de ruta
Parámetro	Tipo	Descripción
id	number	ID de la persona (usuario). Mismo id que en GET /admin/usuarios.
No hay body.
Respuestas
200 OK – Usuario eliminado. Body con message y description.
401 – No autenticado o token inválido.
403 – No es administrador.
404 – No existe usuario con ese id.
Ejemplo de request
DELETE /admin/usuarios/42Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Ejemplo de response 200
{  "message": "Usuario eliminado correctamente",  "description": "Se eliminó el usuario con ID 42 (maestro)."}




**Base URL:** `http://localhost:3000` (o la URL del backend en tu entorno)






# API Gestión de Escuelas — Solo Administrador

Documentación para el equipo frontend: endpoints que usa **solo el administrador** en el panel de gestión de instituciones educativas.

**Autenticación:** Todas las rutas requieren `Authorization: Bearer <token>` (JWT de usuario con rol administrador).

**Base URL:** `{API_BASE}/escuelas` (ej. `http://localhost:3000/escuelas`)

---

## 1. Estadísticas del panel (tarjetas superiores)

**GET** `/escuelas/stats`

Sin query params. Devuelve los totales para las tarjetas: Total escuelas, Activas, Total alumnos, Profesores, Licencias.

**Respuesta 200:**
```json
{
  "message": "Estadísticas del panel de escuelas obtenidas correctamente",
  "data": {
    "totalEscuelas": 5,
    "escuelasActivas": 4,
    "totalAlumnos": 1840,
    "totalProfesores": 134,
    "licencias": 2000
  }
}
```

**Uso en UI:** Llenar las tarjetas “TOTAL ESCUELAS”, “ACTIVAS”, “TOTAL ALUMNOS”, “PROFESORES”, “LICENCIAS”.

---

## 2. Listar escuelas (tabla + búsqueda + filtros)

**GET** `/escuelas`

| Parámetro | Tipo   | Requerido | Descripción |
|----------|--------|-----------|-------------|
| `page`   | number | No        | Página (1-based). Ej: `1` |
| `limit`  | number | No        | Registros por página. Ej: `10` |
| `search` | string | No        | Buscar por nombre de escuela, ciudad o nombre/correo del director |
| `estado` | string | No        | Filtrar por estado: `activa`, `suspendida`, `inactiva` |

**Ejemplos:**
- Todas: `GET /escuelas`
- Paginado: `GET /escuelas?page=1&limit=10`
- Solo activas: `GET /escuelas?estado=activa`
- Búsqueda: `GET /escuelas?search=Central`
- Combinado: `GET /escuelas?estado=activa&search=Prepa&page=1&limit=10`

**Respuesta 200:**
```json
{
  "message": "Escuelas obtenidas exitosamente",
  "description": "Se encontraron 5 escuela(s) en el sistema",
  "total": 5,
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  },
  "data": [
    {
      "id": 1,
      "nombre": "Preparatoria Central",
      "nivel": "Preparatoria",
      "clave": "29DPR0123X",
      "direccion": "Calle Principal 123",
      "telefono": "5551234567",
      "estado": "activa",
      "ciudad": "Ciudad de México",
      "estadoRegion": "CDMX",
      "director": {
        "nombre": "Juan",
        "apellido": "Pérez",
        "correo": "director@escuela.edu"
      },
      "ubicacion": {
        "ciudad": "Ciudad de México",
        "estadoRegion": "CDMX"
      },
      "estadisticas": {
        "alumnos": 450,
        "profesores": 32,
        "grupos": 18
      }
    }
  ]
}
```

`meta` solo viene cuando se envían `page` y `limit`.  
Si no hay director, `director` puede ser `null`.

**Uso en UI:** Tabla de “Gestión de Escuelas”, barra de búsqueda y pestañas Todas / Activas / Suspendidas / Inactivas.

---

## 3. Ver detalle / Cargar formulario de edición

**GET** `/escuelas/:id`

`id`: ID numérico de la escuela.

**Respuesta 200:**
```json
{
  "message": "Escuela obtenida exitosamente",
  "description": "La escuela fue encontrada en el sistema",
  "data": {
    "id": 1,
    "nombre": "Preparatoria Central",
    "nivel": "Preparatoria",
    "clave": "29DPR0123X",
    "direccion": "Calle Principal 123",
    "telefono": "5551234567",
    "estado": "activa",
    "ciudad": "Ciudad de México",
    "estadoRegion": "CDMX",
    "directores": [
      {
        "id": 1,
        "personaId": 10,
        "persona": {
          "id": 10,
          "nombre": "Juan",
          "apellido": "Pérez",
          "correo": "director@escuela.edu",
          "telefono": "5551234567"
        }
      }
    ],
    "estadisticas": {
      "alumnos": 450,
      "profesores": 32,
      "grupos": 18
    }
  }
}
```

**Uso en UI:** Modal o página “Ver” y formulario “Editar” (precargar con `data`).

---

## 4. Crear escuela

**POST** `/escuelas`  
**Content-Type:** `application/json`

**Body (todos los campos opcionales excepto `nombre` y `nivel`):**

| Campo        | Tipo   | Requerido | Límite  | Descripción |
|-------------|--------|-----------|---------|-------------|
| `nombre`    | string | Sí        | 150     | Nombre de la escuela |
| `nivel`     | string | Sí        | 50      | Ej: Primaria, Secundaria, Preparatoria |
| `clave`     | string | No        | 50      | Clave oficial |
| `direccion` | string | No        | 200     | Dirección completa |
| `telefono`  | string | No        | 20      | Teléfono |
| `estado`    | string | No        | 20      | `activa` \| `suspendida` \| `inactiva`. Por defecto `activa` |
| `ciudad`    | string | No        | 100     | Ciudad |
| `estadoRegion` | string | No     | 100     | Estado o región (ej. CDMX, Nuevo León) |

**Ejemplo body:**
```json
{
  "nombre": "Preparatoria Central",
  "nivel": "Preparatoria",
  "clave": "29DPR0123X",
  "direccion": "Calle Principal 123",
  "telefono": "5551234567",
  "estado": "activa",
  "ciudad": "Ciudad de México",
  "estadoRegion": "CDMX"
}
```

**Respuesta 201:**
```json
{
  "message": "Escuela creada exitosamente",
  "description": "La escuela ha sido registrada correctamente en el sistema.",
  "data": {
    "id": 1,
    "nombre": "Preparatoria Central",
    "nivel": "Preparatoria",
    "clave": "29DPR0123X",
    "direccion": "Calle Principal 123",
    "telefono": "5551234567",
    "estado": "activa",
    "ciudad": "Ciudad de México",
    "estadoRegion": "CDMX"
  }
}
```

**Errores:**  
- **409** — Nombre o clave duplicados.

**Uso en UI:** Botón “+ Nueva Escuela” y formulario de alta.

---

## 5. Actualizar escuela (editar)

**PUT** `/escuelas/:id`  
**Content-Type:** `application/json`

`id`: ID de la escuela.  
Todos los campos del body son opcionales; solo se actualizan los que se envían.

**Body:** Mismos campos que en crear (ver tabla anterior). Ejemplo:

```json
{
  "nombre": "Preparatoria Central Actualizada",
  "estado": "activa",
  "ciudad": "Monterrey",
  "estadoRegion": "Nuevo León"
}
```

**Respuesta 200:**
```json
{
  "message": "Escuela actualizada exitosamente",
  "description": "La información de la escuela ha sido actualizada correctamente.",
  "data": {
    "id": 1,
    "nombre": "Preparatoria Central Actualizada",
    "nivel": "Preparatoria",
    "clave": "29DPR0123X",
    "direccion": "Calle Principal 123",
    "telefono": "5551234567",
    "estado": "activa",
    "ciudad": "Monterrey",
    "estadoRegion": "Nuevo León"
  }
}
```

**Errores:**  
- **404** — Escuela no encontrada.  
- **409** — Nombre o clave duplicados.

**Uso en UI:** Guardar cambios en el formulario de edición.

---

## 6. Eliminar escuela

**DELETE** `/escuelas/:id`

**Respuesta 200:**
```json
{
  "message": "Escuela eliminada exitosamente",
  "description": "La escuela ha sido eliminada del sistema."
}
```

**Errores:**  
- **404** — Escuela no encontrada.  
- **400** — No se puede eliminar porque tiene alumnos o maestros asociados.

**Uso en UI:** Acción “Eliminar” (icono papelera), con confirmación.

---

## Resumen de flujo en el panel (admin)

| Acción en UI                    | Método y ruta              |
|---------------------------------|----------------------------|
| Cargar tarjetas de estadísticas | GET `/escuelas/stats`      |
| Cargar tabla de escuelas       | GET `/escuelas` (+ `?page=&limit=&search=&estado=` si aplica) |
| Ver detalle de una escuela     | GET `/escuelas/:id`        |
| Abrir formulario de edición    | GET `/escuelas/:id` → luego PUT `/escuelas/:id` al guardar |
| Crear nueva escuela            | POST `/escuelas`           |
| Eliminar escuela               | DELETE `/escuelas/:id`    |

---

## Códigos de error comunes

| Código | Significado |
|--------|-------------|
| 401    | No autenticado (falta o token inválido). |
| 403    | No es administrador. |
| 404    | Escuela no encontrada. |
| 409    | Conflicto (nombre o clave duplicados). |
| 400    | En DELETE: escuela con alumnos o maestros. |

Todos los endpoints de este documento requieren **JWT de administrador** en el header `Authorization: Bearer <token>`.