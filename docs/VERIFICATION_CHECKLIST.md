# ✅ Checklist de Verificación - Gestión de Libros

## Antes de pasar a producción

### 1. Archivos Creados ✓

- [x] `src/service/libros.service.ts` - Service con 9 métodos
- [x] `src/types/libros/libro.ts` - 15+ interfaces
- [x] `src/components/admin/libros/LibroForm.tsx` - Formulario
- [x] `src/components/admin/libros/AddLibroModal.tsx` - Modal cargar
- [x] `src/components/admin/libros/ViewLibroModal.tsx` - Modal ver
- [x] `src/components/admin/libros/AdminLibroTable.tsx` - Tabla
- [x] `src/components/admin/libros/AsignLibroModal.tsx` - Modal asignar
- [x] `src/components/admin/libros/CanjeLibroModal.tsx` - Modal canjear
- [x] `src/components/admin/libros/DeleteLibroModal.tsx` - Modal eliminar
- [x] `src/components/admin/libros/index.ts` - Índice exporta
- [x] `src/app/admin/libros/page.tsx` - Página principal

### 2. Menú Lateral ✓

- [x] Menu item en `/admin/libros` ya existe en `SidebarAdmin.tsx`
- [x] Icono: `library` (usa mismo icono que escuelas)

### 3. API Endpoints ✓

Verifica que tu backend implementa:

- [ ] `POST /libros/cargar` (multipart, 201)
- [ ] `GET /libros` (200)
- [ ] `GET /libros/:id` (200)
- [ ] `GET /libros/:id/pdf` (200, binary)
- [ ] `DELETE /libros/:id` (200)
- [ ] `POST /escuelas/:id/libros` (201)
- [ ] `POST /escuelas/:id/libros/canjear` (201)
- [ ] `GET /escuelas/:id/libros` (200, opcional)
- [ ] `GET /escuelas/:id/libros/pendientes` (200, opcional)

### 4. Configuración

- [x] Base URL en `src/utils/api.ts` - Verificar `NEXT_PUBLIC_API_URL`
- [x] JWT en header - Automático con interceptor axios
- [x] Rol admin - Verificar en backend que requiere `tipoPersona: 'administrador'`

### 5. Componentes UI Base

Verifica que existan:

- [x] `src/components/ui/Modal.tsx` - Modal base
- [x] `src/components/ui/Button.tsx` - Botones (no usado directamente, estilos inline)
- [x] `src/components/ui/Input.tsx` - Inputs (no usado directamente, estilos inline)

### 6. Tipos Globales

- [x] Axios (`axios` package)
- [x] React 18+
- [x] Next.js 13+ (con app router)
- [x] Tailwind CSS

### 7. Validaciones

**Frontend:**
- [x] Título: 1-150 caracteres
- [x] Grado: 1-6
- [x] PDF: .pdf, <50MB
- [x] Código: único, opcional
- [x] Descripción: <255 caracteres
- [x] Materia: ID válido (opcional)

**Backend debe validar:**
- [ ] Duplicidad de código
- [ ] Existencia de materia
- [ ] PDF válido y procesable

### 8. Errores Esperados

**El sistema maneja:**
- [x] 400 - Datos inválidos
- [x] 401 - No autenticado
- [x] 403 - No es admin
- [x] 404 - Recurso no encontrado
- [x] 409 - Conflicto (código duplicado)

### 9. Mensajes y UX

- [x] Loading spinners en operaciones
- [x] Error messages claros
- [x] Confirmación antes de eliminar
- [x] Estados visuales (Listo, Procesando, Error)
- [x] Mensajes de éxito
- [x] Responsive en mobile

### 10. Testing Manual

**Pasos a probar:**

1. Cargar un libro
   - [ ] Completa formulario
   - [ ] Selecciona PDF válido
   - [ ] Verifica que aparece en tabla (estado "procesando")
   - [ ] Verifica que cambia a "listo" después

2. Ver detalle
   - [ ] Click en ojo
   - [ ] Modal se abre
   - [ ] Información visible
   - [ ] Unidades expandibles

3. Descargar PDF
   - [ ] Click descarga (solo si estado "listo")
   - [ ] PDF se descarga

4. Asignar
   - [ ] Click asignar
   - [ ] Modal confirma
   - [ ] Libro se asigna sin error

5. Canjear
   - [ ] Click canjear
   - [ ] Modal confirma
   - [ ] Libro se canjea sin error

6. Eliminar
   - [ ] Click papelera
   - [ ] Modal de confirmación
   - [ ] Click "Eliminar"
   - [ ] Libro desaparece de tabla

7. Búsqueda
   - [ ] Escribe en barra de búsqueda
   - [ ] Tabla filtra resultados

8. Filtro grado
   - [ ] Cambia dropdown
   - [ ] Tabla filtra por grado

### 11. Performance

- [ ] Tabla carga rápidamente (<2s)
- [ ] Upload de PDF no bloquea UI
- [ ] Modales abren/cierran sin lag
- [ ] No hay memory leaks

### 12. Documentación

- [x] `docs/LIBROS_ADMIN_IMPLEMENTATION.md` - Técnica
- [x] `docs/LIBROS_ADMIN_QUICK_START.md` - Usuario
- [x] `docs/LIBROS_ADMIN_SUMMARY.md` - Resumen general

---

## ⚠️ Notas Important

### Si algo no funciona:

1. **Página no carga**
   ```bash
   # Verifica que el archivo existe
   ls -la src/app/admin/libros/page.tsx
   
   # Revisa console del navegador (F12)
   # Revisa terminal de Next.js por errores
   ```

2. **Upload de PDF falla**
   - Verifica tamaño (<50MB)
   - Verifica que es PDF válido
   - Revisa respuesta 400 en Network tab
   - Verifica header `Content-Type: multipart/form-data`

3. **Tabla vacía**
   - Abre DevTools → Network
   - Verifica que `GET /libros` retorna 200
   - Revisa archivo en `docs/` para response esperada

4. **JWT expira**
   - Sistema intenta redirigir a login (ver en `api.ts`)
   - Token se renueva en cada request automático

### Environment Variables

Verificar en `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url
```

---

## 📦 Dependencias Requeridas

```json
{
  "axios": "^1.x",
  "next": "^13 or ^14",
  "react": "^18",
  "typescript": "^5"
}
```

Verificar con:
```bash
npm list axios next react typescript
```

---

## 🎯 Resumen Rápido

✅ **Frontend:** Completamente implementado  
✅ **Componentes:** Listos para usar  
✅ **Service:** Todos los métodos  
✅ **Tipos:** TypeScript completo  
✅ **Menú:** Ya integrado  
⏳ **Backend:** Debe tener los endpoints (checklist arriba)

---

**Status:** Ready for integration  
**Last Updated:** 11 de febrero de 2026
