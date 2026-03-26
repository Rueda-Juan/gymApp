# GymApp 2.0 — Roadmap de Funcionalidades

---

## 1. Modelo SaaS (Freemium)

Monetización sin anuncios. El usuario free tiene acceso completo al core de entrenamiento; las funcionalidades premium desbloquean inteligencia y personalización avanzada.

### Funcionalidades Free (core)

- Crear y ejecutar rutinas sin límite.
- Historial completo de entrenamientos.
- Estadísticas básicas (volumen, frecuencia, PRs).
- Backup local (JSON / CSV).

### Funcionalidades Premium (pago mensual o anual)

- **Peso recomendado inteligente:** El algoritmo de doble progresión y sugerencia de calentamiento adaptativo.
- **Planes de entrenamiento inteligentes:** Generación automática de rutinas según objetivo (hipertrofia, fuerza, resistencia), días disponibles y equipamiento.
- **Análisis avanzado de progreso:** Gráficos de tendencia de 1RM, predicción de mesetas, análisis de balance muscular con alertas de desproporción.
- **Exportación avanzada:** Reportes PDF personalizados con gráficos y resumen mensual.
- **Temas y personalización visual:** Paletas de colores premium, íconos alternativos de app.

### Implementación técnica

- Sistema de suscripción vía **RevenueCat** (gestiona App Store + Play Store en un solo SDK).
- Feature flags locales que habilitan/deshabilitan funcionalidades según el estado de suscripción.
- Validación de recibos server-side cuando se implemente el backend centralizado.

---

## 2. Compartir Rutinas

Permitir que un usuario comparta una o varias rutinas con otros usuarios.

### Flujo propuesto

1. El usuario selecciona una rutina → **"Compartir"**.
2. Se genera un **link único** o **código QR** que contiene la rutina serializada.
3. El receptor abre el link → la app deserializa la rutina y la guarda como propia.
4. La rutina importada **no contiene datos personales** del creador (pesos, historial, notas privadas). Solo la estructura: ejercicios, series objetivo, rangos de reps y descansos.

### Opciones de compartir

- **Link directo** (deep link vía Expo Router).
- **Código QR** escaneable dentro de la app.
- **Exportar como archivo `.gymroutine`** (JSON firmado) que se puede enviar por cualquier medio.

---

## 3. Sistema Social (Amigos)

Agregar una capa social liviana que fomente la motivación sin convertir la app en una red social.

### Funcionalidades

- **Agregar amigos** mediante código de usuario, link de invitación o búsqueda por nombre de usuario.
- **Perfil público limitado:** Nombre, avatar, racha actual, fecha de último entrenamiento.
- **Feed de actividad:** Timeline simple mostrando cuándo entrenó un amigo (sin detalles de peso/reps para preservar privacidad).
- **Configuración de privacidad:** Cada usuario elige qué compartir (todo público, solo amigos, privado).

### Récords de amigos

- Ver los **PRs públicos** de un amigo por ejercicio.
- Comparativa lado a lado: "Tu 1RM en Bench Press vs. el de tu amigo".
- Tabla de líderes (leaderboard) entre amigos por ejercicio o volumen semanal.

### Rutinas de amigos

- Ver las rutinas que un amigo marcó como **públicas**.
- **"Guardar como mía":** Clonar la estructura de la rutina sin copiar datos personales del creador.
- El creador original recibe un contador de cuántas veces se clonó su rutina (métrica de validación social).

---

## 4. Grupos de Rutinas (Programas)

Concepto nuevo: agrupar varias rutinas en un **programa de entrenamiento** estructurado.

### Ejemplo

> **Programa "Push Pull Legs 6 días"**
>
> - Día 1: Push A
> - Día 2: Pull A
> - Día 3: Legs A
> - Día 4: Push B
> - Día 5: Pull B
> - Día 6: Legs B

### Funcionalidades

- Crear programas con N rutinas ordenadas.
- Asignar días de la semana a cada rutina.
- Al iniciar un entrenamiento desde Home, la app sugiere automáticamente la rutina que corresponde según el día y el orden del programa.
- Clonar programas completos de otros usuarios (misma lógica de "Guardar como mío" pero para el paquete completo).
- Los programas compartidos incluyen descripción del creador, objetivo del programa y nivel recomendado.

---

## 5. Base de Datos Centralizada

La transición de offline-only a un modelo híbrido requiere un backend remoto.

### Cuándo implementar

- **Solo si la app gana tracción real** (usuarios activos, suscriptores).
- Mientras tanto, las funciones sociales pueden funcionar con un enfoque mínimo (compartir vía links/archivos sin necesidad de servidor).

### Stack propuesto

| Componente        | Tecnología                                           |
| ----------------- | ---------------------------------------------------- |
| **API**           | Node.js + Fastify (o Express) con TypeScript         |
| **Base de datos** | PostgreSQL (relacional, ideal para datos de usuario)  |
| **ORM**           | Drizzle ORM (ya se usa en el frontend)               |
| **Auth**          | Supabase Auth o Firebase Auth (OAuth + email/pass)   |
| **Hosting**       | Railway, Render, o Supabase (tier gratuito inicial)  |
| **Storage**       | Supabase Storage o S3 (fotos de perfil, assets)      |

### Estrategia de sincronización

- **Offline-first se mantiene:** SQLite local sigue siendo la fuente primaria.
- **Sync en background:** Cuando hay conexión, los datos se sincronizan con el servidor.
- **Conflict resolution:** Last-write-wins con timestamps o CRDT para datos críticos.
- Los datos sensibles (pesos, reps, historial) solo se sincronizan si el usuario lo autoriza explícitamente.

---

## 6. Estrategia de Actualizaciones

Facilitar el despliegue de nuevas versiones sin fricciones para el usuario.

### Actualizaciones OTA (Over-The-Air)

- **EAS Update** (Expo Application Services) permite pushear cambios de JavaScript sin pasar por la revisión de las tiendas.
- Ideal para: bug fixes, ajustes de UI, nuevas pantallas, cambios de lógica.
- No sirve para: cambios en módulos nativos (nuevas librerías nativas, permisos del OS).

### Actualizaciones nativas (Store)

- Se requieren cuando se agregan nuevas dependencias nativas (ej: cámara para QR, notificaciones push).
- Usar **EAS Build** para generar los binarios.
- Configurar `eas.json` con canales: `preview` (testing interno), `production` (tienda).

### Rollback

- EAS Update soporta rollback instantáneo: si una actualización OTA rompe algo, se revierte al bundle anterior en minutos.
- Para actualizaciones nativas, mantener siempre la versión anterior del binario lista para re-publicar.

### Versionado

- Seguir **Semantic Versioning** (`MAJOR.MINOR.PATCH`):
  - `MAJOR` (2.0, 3.0): Cambios grandes (ej: sistema social, SaaS).
  - `MINOR` (2.1, 2.2): Features nuevos compatibles.
  - `PATCH` (2.1.1): Bug fixes.
- Cada release tiene su entrada en un `CHANGELOG.md` en la raíz del proyecto.

---

## Orden de prioridad sugerido

| Fase   | Feature                          | Dependencia de servidor |
| ------ | -------------------------------- | ----------------------- |
| 2.0.0  | Modelo Freemium (RevenueCat)     | No                      |
| 2.0.0  | Compartir rutinas (links/QR)     | No                      |
| 2.0.0  | Grupos de rutinas (Programas)    | No                      |
| 2.0.0  | EAS Update + Rollback            | No                      |
| 2.1.0  | Backend centralizado (Auth + DB) | Sí                      |
| 2.1.0  | Sistema de amigos                | Sí                      |
| 2.2.0  | Récords y leaderboards           | Sí                      |
| 2.2.0  | Feed de actividad social         | Sí                      |
