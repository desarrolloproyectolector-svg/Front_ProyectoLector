# Backend — Sesiones de Lectura

## 1. Tabla SQL

```sql
CREATE TABLE sesion_lectura (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    alumno_id           BIGINT UNSIGNED NOT NULL,
    libro_id            BIGINT UNSIGNED NOT NULL,
    duracion_segundos   INT UNSIGNED NOT NULL DEFAULT 0,
    segmento_inicio     INT UNSIGNED NULL,  -- índice del segmento donde comenzó
    segmento_fin        INT UNSIGNED NULL,  -- índice del segmento al salir
    fecha_inicio        DATETIME NOT NULL,
    fecha_fin           DATETIME NOT NULL,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (alumno_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (libro_id)  REFERENCES libros(id)   ON DELETE CASCADE,

    INDEX idx_alumno_libro  (alumno_id, libro_id),
    INDEX idx_alumno_fecha  (alumno_id, fecha_inicio)
);
```

---

## 2. Endpoints

### `POST /escuelas/mis-libros/:libroId/sesion`
Registra una sesión al salir del lector. El `alumno_id` se extrae del JWT.

**Body:**
```json
{
  "duracionSegundos": 847,
  "segmentoInicio": 3,
  "segmentoFin": 7,
  "fechaInicio": "2026-03-25T23:45:00.000Z",
  "fechaFin": "2026-03-25T23:59:07.000Z"
}
```

**Respuesta 201:**
```json
{
  "id": 42,
  "alumnoId": 10,
  "libroId": 5,
  "duracionSegundos": 847,
  "segmentoInicio": 3,
  "segmentoFin": 7,
  "fechaInicio": "2026-03-25T23:45:00.000Z",
  "fechaFin": "2026-03-25T23:59:07.000Z"
}
```

---

### `GET /escuelas/mis-libros/:libroId/sesiones`
Historial de todas las sesiones del alumno autenticado en ese libro.

**Respuesta 200:**
```json
[
  {
    "id": 42,
    "duracionSegundos": 847,
    "segmentoInicio": 3,
    "segmentoFin": 7,
    "fechaInicio": "2026-03-25T23:45:00.000Z",
    "fechaFin": "2026-03-25T23:59:07.000Z"
  }
]
```

---

### `GET /escuelas/mis-libros/:libroId/sesiones/resumen`
Estadística agregada del alumno en ese libro.

**Respuesta 200:**
```json
{
  "totalSegundos": 5420,
  "totalSesiones": 8,
  "promedioSegundosPorSesion": 677,
  "ultimaSesion": "2026-03-25T23:59:07.000Z"
}
```

**Query SQL equivalente:**
```sql
SELECT
    COUNT(*)                          AS totalSesiones,
    SUM(duracion_segundos)            AS totalSegundos,
    AVG(duracion_segundos)            AS promedioSegundosPorSesion,
    MAX(fecha_fin)                    AS ultimaSesion
FROM sesion_lectura
WHERE alumno_id = :alumnoId
  AND libro_id  = :libroId;
```

---

### `GET /admin/alumnos/:alumnoId/sesiones`
Todas las sesiones de un alumno, de todos sus libros. Solo accesible por admin/director.

**Query params opcionales:**
| Param | Tipo | Descripción |
|---|---|---|
| `libroId` | number | Filtrar por libro |
| `desde` | ISO date | Fecha de inicio del rango |
| `hasta` | ISO date | Fecha fin del rango |

**Respuesta 200:**
```json
[
  {
    "id": 42,
    "libroId": 5,
    "libroTitulo": "Don Quijote",
    "duracionSegundos": 1203,
    "segmentoInicio": 1,
    "segmentoFin": 4,
    "fechaInicio": "2026-03-25T20:00:00.000Z",
    "fechaFin": "2026-03-25T20:20:03.000Z"
  }
]
```

**Query SQL equivalente:**
```sql
SELECT
    sl.id,
    sl.libro_id         AS libroId,
    l.titulo            AS libroTitulo,
    sl.duracion_segundos,
    sl.segmento_inicio,
    sl.segmento_fin,
    sl.fecha_inicio,
    sl.fecha_fin
FROM sesion_lectura sl
JOIN libros l ON l.id = sl.libro_id
WHERE sl.alumno_id = :alumnoId
  AND (:libroId IS NULL OR sl.libro_id = :libroId)
  AND (:desde   IS NULL OR sl.fecha_inicio >= :desde)
  AND (:hasta   IS NULL OR sl.fecha_fin   <= :hasta)
ORDER BY sl.fecha_inicio DESC;
```

---

## 3. DTO de validación (NestJS)

```ts
// registrar-sesion.dto.ts
import { IsInt, IsDateString, Min } from 'class-validator';

export class RegistrarSesionDto {
    @IsInt() @Min(0)
    duracionSegundos: number;

    @IsInt() @Min(0)
    segmentoInicio: number;

    @IsInt() @Min(0)
    segmentoFin: number;

    @IsDateString()
    fechaInicio: string;

    @IsDateString()
    fechaFin: string;
}
```
