# Directivas Globales del Proyecto

## 1. Documentación de Arquitectura

Al iniciar o estructurar un proyecto, crea obligatoriamente la carpeta Docs/ en la raíz con estos cuatro archivos:

* BD.md: Diagrama físico, esquemas, tablas, relaciones y tipos de datos.
* Back.md: Arquitectura del servidor. Stack tecnológico, estructura de carpetas, lógica de negocio, librerías y especificación de endpoints API.
* Front.md: Arquitectura del cliente. Stack tecnológico, carpetas, estado global y estructura de componentes principales.
* Vistas.md: Flujo UX. Lista de vistas y sub-vistas. Cada botón debe detallar su acción y redirección.

Al modificar la arquitectura (nueva entidad, nuevo endpoint, nueva vista), actualizar el archivo correspondiente en Docs/ antes de cerrar la tarea. El stack tecnológico se documenta dentro de estos archivos, no en este documento.

## 2. Rendimiento de Base de Datos

Prohibido el anti-patrón N+1. Las iteraciones que requieran datos relacionados deben resolverse con una única consulta utilizando JOINs o el equivalente en el ORM. Minimiza la carga en el servidor.

## 3. Resolución de Errores

Al encontrar un bug o antes de proponer una refactorización compleja, utiliza la skill de auto-evolución definida en `c:\Users\Juanchi\.agents\skills\error-tracker\SKILL.md` para no repetir fallos previos.

## 4. Código Auto-Descriptivo

El código debe leerse como prosa. Los comentarios son un último recurso, no un parche para nombres vagos.

### Principios obligatorios

1. **Variables con intención:** Extraer condiciones complejas a variables con nombres que expliquen el *por qué*, no el *cómo*.
2. **Funciones como documentación:** Si un bloque de lógica necesita un comentario para explicarse, extraerlo a una función con nombre semántico.
3. **Cero comentarios obvios:** Prohibido comentar lo que el código ya dice (`// incrementar contador` antes de `counter++`).
4. **Comentarios solo para el *por qué*:** Usar comentarios únicamente cuando el motivo de una decisión no es evidente por el código (workaround, decisión de negocio, edge case no obvio).

### Ejemplo — Evolución de calidad

```javascript
// MAL — comentario compensando lógica ilegible
// show banner if the store is currently open
if (currentHour >= OPENING_HOUR && currentHour < CLOSING_HOUR
    && currentDay !== SATURDAY && currentDay !== SUNDAY && !isHoliday) {
  showOpenBanner();
}

// MEJOR — variables expresivas eliminan la necesidad de comentar
const isBusinessHour = currentHour >= OPENING_HOUR && currentHour < CLOSING_HOUR;
const isBusinessDay = currentDay !== SATURDAY && currentDay !== SUNDAY && !isHoliday;
const isStoreOpen = isBusinessHour && isBusinessDay;
if (isStoreOpen) {
  showOpenBanner();
}

// ÓPTIMO — función con nombre semántico, reutilizable y testeable
function checkIsStoreOpen() {
  const isBusinessHour = currentHour >= OPENING_HOUR && currentHour < CLOSING_HOUR;
  const isBusinessDay = currentDay !== SATURDAY && currentDay !== SUNDAY && !isHoliday;
  return isBusinessHour && isBusinessDay;
}
if (checkIsStoreOpen()) {
  showOpenBanner();
}
```
