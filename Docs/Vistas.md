# Diccionario de Vistas y Navegación Maestro - GymApp

Este documento detalla exhaustivamente cada pantalla, su propósito, todos los botones interactivos, su comportamiento y a qué vista redirigen.

---

## Pestañas Principales (Tab Bar)

- **Ruta Base:** `app/(tabs)/`
- Modos accesibles globalmente desde el footer de la aplicación.
- **"Mini-Player" Flotante (Navegación Global de Workout):** Componente persistente por encima de la Tab Bar si hay un workout activo. Muestra el tiempo global y ejercicio en curso. Tocarlo redirige de inmediato a `app/(workouts)/[active]`.

### 1. Inicio / Dashboard (`app/(tabs)/index.tsx`)

**Propósito:** Punto de entrada, panorama general y motivación.

- **Componentes Interactivos y Botones:**
  - **Botón Perfil (Header - si aplica):** Redirige a Detalles de usuario (o redirige a tab `settings`).
  - **Tarjeta "Retomar Entrenamiento" (Condicional):** Aparece si hay un workout activo en Zustand. **Acción:** Redirige a `app/(workouts)/[active]`.
  - **Carrusel "Rutinas" (Sección Rutinas para hoy):**
    - **Click en la Tarjeta general:** Lleva al editor de rutina -> `app/routine/[id]`.
    - **Botón Play (Icono ▶️):** Inicia la sesión de esa rutina inmediatamente. -> Crea registro activo y redirige a `app/(workouts)/[active]`.
  - **Tarjeta "Actividad Reciente":**
    - **Click en la tarjeta:** Abre el resumen detallado de esa sesión pasada. -> `app/(workouts)/summary?id=[workoutId]`.

### 2. Biblioteca de Rutinas (`app/(tabs)/routines.tsx`)

**Propósito:** Gestión, creación y exploración de planes de entrenamiento.

- **Componentes Interactivos y Botones:**
  - **Botón "+ Nueva Rutina" (Header superior derecho):** Abre el flujo de creación. -> Redirige a `app/routine/create`.
  - **Barra de Búsqueda (Input de texto):** Filtra en tiempo real la lista de rutinas en pantalla. (No navega).
  - **Tarjeta de Rutina (Listado):**
    - **Área Principal (Nombre, Tags):** Abre el modo Edición de la rutina. -> Redirige a `app/routine/[id]`.
    - **Botón Play (Icono ▶️) en la esquina:** Inicia directamente esa rutina. -> Redirige a `app/(workouts)/[active]`.

### 3. Historial de Sesiones (`app/(tabs)/history.tsx`)

**Propósito:** Registro cronológico de todos los entrenamientos finalizados con búsqueda integrada.

- **Componentes Interactivos y Botones:**
  - **Buscador (TextInput Superior):** Filtra instantáneamente el listado por nombre de rutina, fecha o nombre de un ejercicio específico contenido en el historial.
  - **Tarjeta de Entrenamiento Individual:**
    - **Área Clickable:** Lleva a la pantalla de métricas de la sesión. -> Redirige a `app/(workouts)/summary?id=[workoutId]`.
  - **Swipe Izquierda en Tarjeta (Swipeable de Reanimated):** Desvela el botón subyacente de "Basura" roja. Al confirmar en Modal Alert, destruye permanentemente el entrenamiento de SQLite.

### 4. Estadísticas y Progreso (`app/(tabs)/stats.tsx`)

**Propósito:** Análisis de rendimiento a largo plazo, volumen y peso corporal.

- **Componentes Interactivos y Botones:**
  - **Dropdown / Selector de Ejercicio (Si aplica al gráfico 1RM):** Cambia el DataSet visualizado en la gráfica de progreso. (No navega).
  - **Tarjeta "Peso Corporal":**
    - **Botón "+" (Añadir Registro):** Abre el Logger. -> Redirige a `app/stats/weight.tsx`.
  - **Botón "Share" (Exportar/Compartir - Header):** Invoca el OS Share modal nativo.

### 5. Ajustes e Inventario (`app/(tabs)/settings.tsx`)

**Propósito:** Personalización técnica y de usuario. Variables globales.

- **Componentes Interactivos y Botones:**
  - **Chips de Equipamiento "Discos Disponibles" (1.25, 2.5, 5, etc):** Activa/Desactiva discos de tu inventario local persistido. (No navega, afecta cálculos globales).
  - **Botones "Barra por Defecto" (10kg, 15kg, 20kg):** Define la barra estándar. (No navega).
  - **Switch "Modo Oscuro":** Alterna el tema visual de la UI.
  - **Enlaces de Perfil (Usuario, Notificaciones, etc):** Disparan un "Alert" tipo Placeholder ("Próximamente").
  - **Botón "Cerrar Sesión" (Rojo):** Dispara Modal Alert de confirmación -> Limpia tokens y redirigiría a Login/Auth (Futuro).

---

## Vistas Operativas (Modo Entrenamiento)

- Rutas fuera del Tab Bar, usadas durante una ejecución o edición profunda.

### 6. Entrenamiento Activo (`app/(workouts)/[active].tsx`)

**Propósito:** Interfaz "In-Game" (ejecución táctica). Extremadamente interactiva.

- **Header / Zona Superior:**
  - **Botón "X" (Cancelar - Top Left):** Dispara Modal Alert "¿Cancelar entrenamiento?". Si presiona "Sí, salir", borra estado global y redirige de vuelta a Tabs (Navigation `.back()`).
  - **Botón "Ojo" (Modo Foco - Top Right):** Oculta visualmente en la pantalla todo ejercicio que no sea el "activo actual" (o el grupo de ejercicios actual si están enlazados como **Superserie**).
  - **Botón "Finalizar" (Verde - Top Right):** Guarda la sesión en SQL, sube el volumen total, reinicia Zustand, y redirige al Resumen -> `app/(workouts)/summary?id=[workoutId]`.
- **Cuerpo Principal (Ejercicios y sets):**
  - Si hay ejercicios agrupados (Superseries), aparecerán visualmente conectados por una línea de enlace lateral, y el avance automático hacia el próximo bloque solo ocurrirá cuando todos los ejercicios enlazados completen sus series.
  - **Botón "Saltar" (Header del ejercicio):** Marca el ejercicio completo como omitido, baja el nivel de opacidad.
  - **Menú "Opciones" (••• Más Vertical):** Abre el `BottomSheet` de Opciones de Ejercicio.
    - *Sustituir Ejercicio:* Navega a `app/(workouts)/exercise-browser?action=replace` para intercambiarlo sin perder posición. El buscador se abre pre-inyectado con filtros inteligentes (músculo actual activado) y divide la lista en ✨ Alternativas Sugeridas (distinto equipo) y el resto del catálogo.
    - *Mover al final:* Empuja el ejercicio activo a la última posición del listado.
    - *Eliminar Ejercicio:* Previa alerta, lo borra en tiempo real de la sesión.
  - **En cada Fila de Set (`set-row.tsx`); LOS CONTROLES ELITE:**
    - **Botón del Número de Set (Izquierda):** Alterna el tipo de serie cíclicamente (Normal '1,2,3' -> Calentamiento '🔥 Llama' -> Drop/Fallo).
    - **Inputs (Cajas de Texto):** Actualizan Peso (kg) y Repeticiones (reps). **Pulsación larga** sobre el número de Peso (o un toque en una etiqueta sutil) abre la **Calculadora de Discos (Plate Math)** nativamente. (Icono extra eliminado por Ley de Fitts).
    - **Botón "Check" (Verde a la derecha):** Marca la serie completada. Detona el Rest Timer global y dispara un Feedback Háptico escalonado (Medium, o Heavy si es PR).
    - **Fila "RIR Pills" (Repetitions In Reserve):** Al marcar la serie como completada, efectúa una transición horizontal (Slide/Fade) ocultando los inputs para mostrar los botones RIR, manteniendo la **altura constante** de la fila (evitando saltos visuales o *Cumulative Layout Shift*). Toque vibra (Light Haptic).
    - **Eliminar Set:** Modo seguro (Pulsación Larga sobre la fila y opción "Eliminar", o botón estilo Basura de baja opacidad), en lugar de Swipe lateral que crea conflictos con la UI.
  - **Footer de un Ejercicio:**
    - **Botón "+ Añadir set":** Agrega dinámicamente una nueva fila al array de sets.
- **Footer de la Pantalla Completa:**
  - **Botón Gigante "+ Añadir Ejercicio":** Despliega el **BottomSheet Modal** desde abajo (o redirige a Exercise Browser interactivo).
    - **BottomSheet Search Bar:** Filtra ejercicios por nombre.
    - **BottomSheet Lista de Resultados (Click):** Agrega el ejercicio al workout actual y cierra el BottomSheet automáticamente.
- **Elemento Flotante "Timer de Descanso" (Píldora Flotante):**
  - **Click:** Redirige a pantalla de timer a pantalla completa u overlay -> `app/(workouts)/rest-timer`.

### 7. Timer de Descanso (`app/(workouts)/rest-timer.tsx` - Si aplica)

- **Botones "+15s" / "-15s":** Ajustan el tiempo dinámico.

- **Botón "Omitir" / Cerrar:** Corta el timer activo y vuelve a `[active]`.

### 8. Gestor / Creador de Rutinas (`app/routine/[id].tsx` y `create.tsx`)

**Propósito:** Ingeniería, creación de templates.

- **Header:**
  - **Botón "X" o "Chevron Izquierdo":** Cancela edición, redirige hacia atrás `.back()`.
  - **Botón "Guardar" (Icono Disquete):** Valida, inserta/actualiza en base de datos SQLite, y redirige hacia atrás `.back()`.
- **Cuerpo:**
  - **Lista Arrastrable (Drag & Drop):** Mantener presionado el ícono ☰ (Handle) permite reordenar el array de ejercicios verticalmente.
  - **Botones "-" y "+" por ejercicio:** Ajustan Target Sets y Min/Max Reps de la plantilla de ese ejercicio.
  - **Enlace de Superseries (Ícono Link):** Permite encadenar el ejercicio actual con el siguiente para crear grupos de Superseries/Circuitos, los cuales se visualizan unidos por una línea lateral.
  - **Botón "+ Añadir Ejercicio" (Centro/Abajo):** Abre el buscador de biblioteca forzando el retorno del resultado. -> Navega a `app/(workouts)/exercise-browser?target=routine`.
- **Footer:**
  - **Botón "Eliminar Rutina" (Rojo - Solo en `[id].tsx`):** Dispara Alert de confirmación y borra permanentemente, retornando a `routines.tsx`.

### 9. Explorador de Ejercicios General (`app/(workouts)/exercise-browser.tsx`)

**Propósito:** Catálogo universal para agregar a Rutinas (Templates) o Entrenamientos Activos.

- **Componentes:**
  - **Input Búsqueda:** Filtra catálogo. Cuenta con prop `autoFocus={true}` cuando se invoca desde el botón "+ Añadir" dentro de un entrenamiento activo.
  - **Filtros por Músculo (Píldoras horizontales):** Filtra por etiquetas.
  - **Lista de Ejercicios:**
    - **Click en la fila (Comportamiento depende del Param URL `target`):**
      - Si `target=routine`: Lo agrega al template en el store Zustand y hace un `.back()` al editor.
      - Si no hay target: Abre simplemente la página de detalle anatómico. -> Redirige a `app/exercise/[id]`.

### 10. Pantalla Detalle Anatómico y Récords (`app/exercise/[id].tsx`)

**Propósito:** Analítica microscópica de un solo ejercicio.

- **Header:**
  - **Botón "Chevron" (Atrás):** Redirige a página anterior `.back()`.
- **Cuerpo:**
  - **Widget "Vídeo/GIF" (Futuro Player):** Botón play para demostrar técnica.
  - **Widget de PR (1RM):** Simplemente visual.
  - **Heatmap / Modelo (Futuro Componente SVG SVG interactivo):** Muestra áreas tocadas por la biomecánica del movimiento.
  - **Registro Histórico de Sets:** Lista cronológica visual (pasiva).

### 11. Resumen de Post-Sesión (`app/(workouts)/summary.tsx`)

**Propósito:** Pantalla de gamificación y recompensa tras terminar de sufrir.

- **Botón "X" (Header - Esquina superior izquierda):** Cierra el resumen general y vuelve a Home -> Redirige a `app/(tabs)/index.tsx`.
- **Botón "Share / Exportar" (Futuro - Footer/Derecha inferior):** Dispara lógica local para guardar un Canvas / Pantallazo en la galería o abrir modal de Instagram Share. (No navega).
- **Botón "Guardar como plantilla" (Solo si fue un Workout Manual "Vacío"):** (Si se aplica) -> Clona la estructura de este log al editor `app/routine/create`.

---

## Modales de Confort Global

- **Modal Alert (Alerts):** Nativo del sistema para casos destructivos (Salir sin guardar, Borrar Routine, Borrar Set en algunos contextos).

- **Toasts (React-Native-Toast-Message):** Aparecen por 3 segundos (Arriba o abajo). Comportamiento pasivo, se usan recurrentemente al:
  - Romper un PR.
  - Guardar cambios con éxito.
  - Fallas de red/motor.
