# Especificación Técnica – Frontend

## Aplicación Personal de Entrenamiento (estilo Hevy)

---

## 1. Objetivo del Frontend

El frontend es responsable de:

- Renderizar la interfaz de usuario
- Gestionar interacciones y navegación
- Controlar animaciones, temporizadores y feedback háptico
- Manejar estado visual y transiciones entre pantallas
- Conectarse con el backend local vía Services/Hooks

> [!IMPORTANT]
> El frontend **no debe contener lógica de negocio**. Toda lógica reside en el backend local (ver `Back.md`). El frontend solo consume Services.

### Principios de diseño

| Principio              | Implementación                                    |
| ---------------------- | ------------------------------------------------- |
| **Rápido**             | FlashList, memoización, lazy loading              |
| **Reactivo**           | Zustand + re-renders mínimos                      |
| **Accesible**          | Touch targets ≥44pt, contraste ≥4.5:1, VoiceOver  |
| **Offline-first**      | Todo funciona sin conexión                        |
| **Fácil de mantener**  | MVVM + componentes reutilizables                  |

---

## 2. Stack tecnológico

| Tecnología                         | Uso                                                                                        |
| ---------------------------------- | ------------------------------------------------------------------------------------------ |
| **React Native + Expo**            | Framework principal                                                                        |
| **TypeScript**                     | Lenguaje (modo `strict`)                                                                   |
| **Expo Router**                    | Navegación file-based                                                                      |
| **Zustand**                        | Estado global                                                                              |
| **Tamagui / NativeWind**           | **NUEVO:** Sistema de UI y estilos (Plantillas/Componentes gratis y de alto rendimiento)   |
| **@gorhom/bottom-sheet**           | **NUEVO:** Bottom sheets nativos a 60fps (Buscador, Ajustes)                               |
| **React Native Reanimated**        | Animaciones UI thread                                                                      |
| **lottie-react-native**            | **NUEVO:** Animaciones complejas (celebración de PRs, onboarding)                          |
| **FlashList**                      | Listas de alto rendimiento                                                                 |
| **Victory Native**                 | Gráficos de estadísticas                                                                   |
| **Lucide React Native**            | Sistema de iconos (SVG consistente)                                                        |
| **expo-haptics**                   | Feedback háptico                                                                           |
| **expo-image**                     | Imágenes optimizadas + WebP animado                                                        |
| **react-native-toast-message**     | Notificaciones toast                                                                       |

> [!NOTE]
> **Preferencias de librería** según skill `building-native-ui`:
>
> - `expo-image` en lugar de `<Image>` nativo
> - `Pressable` en lugar de `TouchableOpacity` (cuando no hay comportamientos avanzados)
> - `TextInput` de React Native para inputs (mejor control nativo y performance)
> - `process.env.EXPO_OS` en lugar de `Platform.OS`
> - Inline styles en lugar de `StyleSheet.create` (salvo estilos reutilizados)
> - **Dependencias en hooks**: Siempre incluir las funciones/servicios en el array de dependencias de `useEffect` para evitar stale closures

---

## 2.1 Desglose y Propósito de cada Librería

Para evitar redundancias y mantener un desarrollo limpio, aquí se detalla el uso exclusivo de cada librería a lo largo de la app:

### Sistema Base y Estructura

- **`expo` / `react-native`**: Motor base y acceso a APIs del sistema operativo (teclado, portapapeles, dimensiones).
- **`expo-router`**: Gestiona **toda la navegación**, incluyendo las Tabs del menú inferior y el Stack (pila) de pantallas superpuestas (ej: ir de Home a Workout Screen). Todo vive bajo la carpeta `app/`.
- **`zustand`**: Gestión del **estado global sincrónico prestablecido** como el temporizador de descanso, el entrenamiento activo (`workoutStore`), o los filtros seleccionados (`exerciseStore`). *No usar para estados locales UI (ej. abrir/cerrar un popup).*

### UI y Estilos (Look and Feel)

- **`tamagui` & `@tamagui/core`**: Sistema de diseño principal. Construcción de componentes atómicos (Buttons, Cards, Stack layouts). Utiliza tokens de diseño definidos (colores, espaciado `8dp`) para compilar estilos nativos eficientes en lugar del viejo `StyleSheet.create`.
- **`react-native` TextInput**: Inputs de texto/búsqueda usan `TextInput` nativo de React Native (no Tamagui) para mejor control, performance y compatibilidad con teclados nativos. *Uso en: búsquedas, campos de formulario, notas.*
- **`lucide-react-native`**: **Única fuente de íconos**. Utilizada en botones, menús y Tabs. *Prohibido usar emojis estructurales o mezclar librerías de íconos.*
- **`expo-font`**: Utilizada para cargar fuentes modernas (Inter, Roboto) y crucial para aplicar la regla `fontVariant: ['tabular-nums']` en textos numéricos fluctuantes (pesos, cronómetros).

### Listas de Rendimiento Crítico

- **`@shopify/flash-list`**: Obligatorio para **todas las listas largas o dinámicas** por su superioridad técnica (reemplaza a FlatList).
  - *Uso obligatorio en:* Pantalla de *Routines*, *History*, buscador del *Exercise Browser*, y la lista de Sets (`SetRow`) en la *Workout Screen*.

### Interfaz Avanzada y Navegación Overlay

- **`@gorhom/bottom-sheet`**: Exclusivo para modales que emergen desde la base a 60fps.
  - *Casos:* **Exercise Browser** (el modal para buscar/agregar ejercicios), selectores rápidos u opciones contextuales (long-press en History).
- **`react-native-safe-area-context`**: Fundamental para evitar que los elementos de UI queden bloqueados por el "Notch/Isla Dinámica" en iOS o las barras de navegación en Android.

### Interacción y Sensaciones Físicas (Feedback)

- **`expo-haptics`**: Feedback físico al usuario en momentos clave (vibración).
  - *Casos:* `Medium` al completar un Set (check ✔). `Notification` al finalizar el temporizador. `Heavy` al romper un récord personal (PR).
- **`react-native-toast-message`**: Feedback visual rápido y no bloqueante (Ej: "Rutina guardada con éxito" o alertas de error de formulario).

### Animaciones

- **`react-native-reanimated`**: Animaciones fluidas atadas al hilo de la UI. Microinteracciones.
  - *Casos:* El efecto de presionado del check en `SetRow`, transiciones de Drag & Drop, o el desplazamiento de sliders/barras de progreso.
- **`lottie-react-native`**: Animaciones vectoriales pre-renderizadas no atadas al estado interactivo.
  - *Casos:* Celebraciones grandes de PRs, onboarding, o `EmptyChartState` súper visuales.

### Ejercicios y Visualización de Datos

- **`expo-image`**: Utilizada para cargar los assets de imágenes y, lo más importante, las **animaciones WebP de los ejercicios** (ej. mostrar un press banca en loop dentro del *Exercise Detail* y el *Workout Screen*) gracias a su carga bajo demanda (lazy load).
- **`victory-native`**: Exclusivo para el tab de **Stats**. Renderiza los gráficos de progreso (torta de balance muscular, barras del volumen levantado, o línea de estimación 1RM).

### Utilidades y Lógica Liviana

- **`date-fns`**: Parseo y formato de fechas limpios para toda la app (Ej: Formatear tiempos "Ayer a las 18:00", duraciones, etc.).
- **`zod`**: Validación robusta de formularios antes de hablar con los Services/Stores (Ej: Validar que el peso insertado es > 0, o que el nombre de rutina existe).
- **`expo-crypto`**: Empleado para **generar UUIDs ultrarrápidos** localmente, vital a la hora de asignar IDs temporales a nuevos sets o rutinas generados en pantalla antes de mandarlos a la base de datos backend.

---

## 3. Arquitectura frontend — MVVM

```mermaid
graph TD
    subgraph "View Layer"
        A["Screens\n(React Components)"]
        B["Componentes UI\n(Cards, Rows, Charts)"]
    end

    subgraph "ViewModel Layer"
        C["Zustand Stores\n(Estado reactivo)"]
        D["Custom Hooks\n(useWorkout, useStats)"]
    end

    subgraph "Service Layer"
        E["Backend Services\n(WorkoutService, etc.)"]
    end

    A --> D
    B --> D
    D --> C
    D --> E
```

| Capa           | Responsabilidad                              | No debe hacer                    |
| -------------- | -------------------------------------------- | -------------------------------- |
| **View**       | Renderizar UI, capturar input del usuario    | Lógica de negocio, SQL           |
| **ViewModel**  | Gestionar estado, transformar datos para UI  | Acceso directo a BD              |
| **Service**    | Puente al backend local                      | Renderizar componentes           |

---

## 4. Estructura de navegación

### Tabs principales

```mermaid
graph LR
    subgraph "Bottom Tab Navigation"
        T1["🏠 Home"]
        T2["📋 Routines"]
        T3["📜 History"]
        T4["📊 Stats"]
        T5["⚙️ Settings"]
    end
```

### Mapa de navegación completo

```mermaid
flowchart TD
    A["App Init\n(Splash Screen)"] --> B["Tab Navigator"]

    B --> H["Home"]
    B --> R["Routines"]
    B --> HI["History"]
    B --> S["Stats"]
    B --> SE["Settings"]

    H --> W["Workout Screen\n(Stack Push)"]
    H --> EB["Exercise Browser\n(Modal)"]

    R --> RE["Routine Editor\n(Stack Push)"]
    RE --> EB

    W --> EB

    HI --> WD["Workout Detail\n(Stack Push)"]

    S --> ED["Exercise Detail\n(Stack Push)"]

    SE --> BK["Backup Manager"]
    SE --> PR["Preferences"]
```

### Implementación con Expo Router

```text
app/
├── _layout.tsx                    ← NativeTabs / Bottom Tabs
├── (home,routines,history,stats,settings)/
│   ├── _layout.tsx                ← Stack Navigator compartido
│   ├── index.tsx                  ← Pantalla principal del tab
│   ├── workout/
│   │   └── [id].tsx               ← Workout activo / detalle
│   ├── routine/
│   │   ├── create.tsx
│   │   └── [id].tsx               ← Editor de rutina
│   ├── exercise/
│   │   └── [id].tsx               ← Detalle de ejercicio
│   └── exercise-browser.tsx       ← Modal: buscador de ejercicios
```

> [!TIP]
> Usar **grupos compartidos** `(home,routines,...)` permite que screens como `exercise/[id]` sean accesibles desde múltiples tabs sin duplicar rutas.

---

## 5. Pantallas del sistema — Descripción exhaustiva

### 5.1 🏠 Home (Tab Principal)

**Función**: Dashboard principal — acceso rápido a entrenar y resumen del estado actual.

**Layout**: ScrollView vertical con `contentInsetAdjustmentBehavior="automatic"`.

#### Componentes de la pantalla

| # | Componente | Descripción detallada | Datos |
| - | - | - | - |
| 1 | **Header nativo** | Título "GymApp" con large title. Sin botones adicionales. | Stack header |
| 2 | **CTA "Empezar Entrenamiento"** | Botón principal prominente, ancho completo (`width: 100%`), altura ≥56pt, gradiente `primary → primary-dark`, ícono `Play` (Lucide). Efecto pressed: `scale(0.97)` + haptic `Medium`. | — |
| 3 | **Resumen rápido semanal** | Card compacto con 3 métricas inline: 🏋️ Entrenamientos esta semana, ⏱ Tiempo total, 📊 Volumen total. Usa `fontVariant: 'tabular-nums'`. | `StatsService.getWeeklyStats()` |
| 4 | **Último entrenamiento** | `WorkoutCard` con: fecha relativa ("Ayer", "Hace 2 días"), nombre rutina, duración, nº ejercicios, volumen. Tap → **Workout Detail**. | `WorkoutService` (último) |
| 5 | **Rutinas recientes** | ScrollView horizontal con `RoutineCard` (máx 5). Cada card: nombre, nº ejercicios, badge "Última vez: hace X días". Tap → inicia workout con esa rutina. | `RoutineService.getAll()` |
| 6 | **Streak / Racha** | Indicador visual de días consecutivos entrenando. Ícono `Flame` (Lucide) con contador. Se oculta si streak = 0. | `StatsService.getTrainingFrequency()` |

#### Empty States

| Estado | Contenido |
| - | - |
| Sin entrenamientos | Ilustración Lottie + "¡Comienza tu primer entrenamiento!" + botón CTA |
| Sin rutinas | "Crea tu primera rutina para entrenar más rápido" + link a tab Routines |

#### Flujos de navegación desde Home

```mermaid
flowchart TD
    H["🏠 Home"] -->|"Tap 'Empezar Entrenamiento'"| SEL["Selector de Rutina\n(Bottom Sheet)"]
    SEL -->|"Elige rutina"| WS["⭐ Workout Screen"]
    SEL -->|"'Entrenamiento vacío'"| WS
    H -->|"Tap WorkoutCard"| WD["📋 Workout Detail"]
    H -->|"Tap RoutineCard"| WS
    H -->|"Long press RoutineCard"| CM["Context Menu:\n• Editar rutina\n• Duplicar\n• Eliminar"]
    CM -->|"Editar"| RE["✏️ Routine Editor"]
```

---

### 5.2 📋 Routines (Tab)

**Función**: CRUD completo de rutinas (plantillas de entrenamiento).

**Layout**: FlashList vertical de `RoutineCard`.

#### Componentes de la pantalla Routines

| # | Componente | Descripción detallada |
| - | - | - |
| 1 | **Header nativo** | Título "Rutinas" (large title). Botón derecho: ícono `Plus` (Lucide) → **Routine Editor (crear)** |
| 2 | **Search bar** | `headerSearchBarOptions` nativo en el Stack. Filtra rutinas por nombre en tiempo real con debounce 300ms. |
| 3 | **Lista de rutinas** | FlashList con `RoutineCard`. Cada card muestra: nombre, nº ejercicios, músculos objetivo (badges), fecha de última vez usada. |
| 4 | **Swipe actions** | Swipe izquierda sobre cada card: **Editar** (azul) y **Eliminar** (rojo, con confirmación). |
| 5 | **Long press context menu** | Opciones: Entrenar, Editar, Duplicar, Eliminar. Usa `<Link.Menu>` de Expo Router. |
| 6 | **FAB (alternativo)** | En la esquina inferior derecha, `Plus` flotante. Solo visible si hay ≥ 1 rutina (si no, empty state tiene CTA). |

#### Detalle de `RoutineCard`

```text
┌──────────────────────────────────────────┐
│  🏋️  Push Day                           │
│  5 ejercicios · Pecho, Tríceps, Hombros  │
│  Última vez: hace 3 días                 │
│                                    [▶]   │
└──────────────────────────────────────────┘
```

- **Tap card** → abre **Routine Detail / Editor** (modo vista).
- **Tap ▶** → inicia workout con esa rutina directamente.
- **Long press** → context menu.

#### Empty State

Ilustración Lottie (persona pensando) + "Aún no tenés rutinas" + botón "Crear mi primera rutina".

#### Flujos desde Routines

```mermaid
flowchart TD
    R["📋 Routines"] -->|"Tap '+' header"| RE_N["✏️ Routine Editor\n(modo crear)"]
    R -->|"Tap RoutineCard"| RE_V["👁️ Routine Detail\n(modo ver)"]
    R -->|"Tap '▶' en card"| WS["⭐ Workout Screen"]
    R -->|"Swipe → Editar"| RE_E["✏️ Routine Editor\n(modo editar)"]
    R -->|"Swipe → Eliminar"| CONF["⚠️ Diálogo de\nconfirmación"]
    CONF -->|"Confirmar"| R
    R -->|"Long press → Duplicar"| R
```

---

### 5.3 ✏️ Routine Editor (Stack Push)

**Función**: Crear o editar una rutina con sus ejercicios, sets objetivo y configuración.

**Layout**: ScrollView con KeyboardAwareScrollView para inputs.

#### Componentes de la pantalla Routine Editor

| # | Componente | Descripción |
| - | - | - |
| 1 | **Header** | Título "Nueva Rutina" / "Editar Rutina". Botón izq: `X` (cancelar con confirmación si hay cambios). Botón der: "Guardar" (disabled si form inválido). |
| 2 | **Input nombre** | TextInput con label visible "Nombre de la rutina". Validación: requerido, min 2 chars. Error debajo del campo. |
| 3 | **Input notas** | TextInput multiline, label "Notas (opcional)". Placeholder: "Descripción, objetivo, etc." |
| 4 | **Lista de ejercicios** | Drag & drop (Reanimated + GestureHandler). Cada item es un `RoutineExerciseRow`. |
| 5 | **Botón "+ Agregar Ejercicio"** | Outlined button al final de la lista. Tap → abre **Exercise Browser** (modal/bottom sheet). |
| 6 | **Sección por ejercicio** | Ver `RoutineExerciseRow` abajo. |

#### Detalle de `RoutineExerciseRow`

```text
┌────────────────────────────────────────────┐
│  ≡  Bench Press (compound)           [🗑]  │
│     Pecho, Tríceps                          │
│                                             │
│     Series objetivo:  [3]  ▲▼               │
│     Rango de reps:    [8] - [12]            │
│     Descanso (seg):   [90]   (o global)     │
│     Superset grupo:   [Ninguno ▼]           │
│                                             │
│     ☰ Arrastrar para reordenar              │
└────────────────────────────────────────────┘
```

- **≡** → Drag handle para reordenar (Reanimated layout animation).
- **🗑** → Eliminar ejercicio con confirmación si tiene datos.
- **Inputs numéricos** → Steppers (`+` / `-`) con touch target ≥ 44pt.
- **Superset grupo** → Dropdown/Picker: "Ninguno", "Grupo A", "Grupo B", etc.

#### Flujos desde Routine Editor

```mermaid
flowchart TD
    RE["✏️ Routine Editor"] -->|"Tap '+ Agregar Ejercicio'"| EB["🔍 Exercise Browser\n(Bottom Sheet Modal)"]
    EB -->|"Selecciona ejercicio(s)"| RE
    RE -->|"Tap 'Guardar'"| R["📋 Routines\n(pop con toast success)"]
    RE -->|"Tap 'X'"| CONF{"¿Cambios sin guardar?"}
    CONF -->|"Descartar"| R
    CONF -->|"Seguir editando"| RE
    RE -->|"Tap ejercicio existente"| ED["📄 Exercise Detail\n(ver info)"]
```

---

### 5.4 ⭐ Workout Screen (Stack Push — Pantalla Principal)

**Pantalla más importante** — diseñada para uso en gimnasio con manos sudadas.

**Layout**: ScrollView vertical. Header sticky con timer. Bottom bar sticky con acciones.

#### Componentes de la pantalla Workout Screen

| # | Componente | Descripción |
| - | - | - |
| 1 | **Header sticky** | Botón `←` (back con confirmación). Centro: Timer general del workout (`MM:SS`, `fontVariant: 'tabular-nums'`). Botón der: `•••` (menú overflow). |
| 2 | **Progress indicator** | Barra de progreso horizontal: ejercicio actual / total ejercicios. Color `primary`. |
| 3 | **Exercise Section** | Sección por cada ejercicio (ver detalle abajo). El ejercicio actual está expandido, los demás colapsados. |
| 4 | **Bottom bar sticky** | 3 botones: "Anterior" ← , "Siguiente" → , "Finalizar" (solo visible en último ejercicio). |
| 5 | **Rest Timer overlay** | Timer de descanso entre sets. Aparece como overlay/bottom sheet con: countdown circular, botones `+15s`, `-15s`, `Skip`. Haptic `Notification` al terminar. |
| 6 | **PR Alert** | Overlay animado (Lottie confetti) cuando se rompe un record personal. Haptic `Heavy`. Auto-dismiss 3s. |

#### Detalle de `ExerciseSection`

```text
┌─────────────────────────────────────────────┐
│  ┌──────────────┐                            │
│  │  [WebP anim] │  Bench Press               │
│  │   120x120    │  Pecho · Compound           │
│  └──────────────┘  Peso anterior: 80 kg       │
│                    💡 Sugerido: 82.5 kg        │
│                                               │
│  ┌─ Calentamiento sugerido ──────────────┐   │
│  │  🔥 Frío → 3 series de calentamiento   │   │
│  │    40% (32.5kg) × 12  ·  60% × 8  ·   │   │
│  │    80% × 4                              │   │
│  │  [Usar calentamiento] [Saltar]          │   │
│  └────────────────────────────────────────┘   │
│                                               │
│  ─── Sets ───────────────────────────────    │
│  #   PESO      REPS    TIPO      RIR    ✔   │
│  1   [82.5]    [10]    Normal    [2]    ☑   │
│  2   [82.5]    [10]    Normal    [1]    ☑   │
│  3   [82.5]    [ _]    Normal    [ ]    ☐   │
│                                               │
│  [+ Agregar Set]                              │
│                                               │
│  Notas del ejercicio: [________________]      │
├─────────────────────────────────────────────┤
│  [Skip ejercicio]                             │
└─────────────────────────────────────────────┘
```

##### Detalle de `SetRow`

| Elemento | Comportamiento |
| - | - |
| **#** | Número de set (auto-incrementa) |
| **PESO** | Input numérico, teclado decimal. Pre-rellenado con peso sugerido. Stepper ±2.5kg. `fontVariant: 'tabular-nums'` |
| **REPS** | Input numérico, teclado entero. Pre-rellenado con target reps de la rutina |
| **TIPO** | Chip selector: `Normal` · `Warmup` · `Dropset` · `Failure`. Tap → cicla entre tipos. Color-coded. |
| **RIR** | Input numérico 0-10. Tooltip "Reps In Reserve". Opcional |
| **✔** | Checkbox. Tap → marcar set completado. Animación: scale 0.95→1 (150ms spring). Haptic `Medium`. Inicia rest timer |

##### Superset visual

Cuando un ejercicio pertenece a un superset group, el indicador visual es:

```text
│  🔗 Superset A                                │
│  ┌──────────────────────────────────────────┐ │
│  │ 1A  Bench Press       Set 1: ☑  Set 2: ☐│ │
│  │ 1B  Incline Fly       Set 1: ☑  Set 2: ☐│ │
│  └──────────────────────────────────────────┘ │
```

#### Menú overflow (•••)

| Opción | Acción |
| - | - |
| Reordenar ejercicios | Abre modo drag & drop para cambiar orden |
| Añadir ejercicio | Abre **Exercise Browser** |
| Añadir notas al workout | Abre input de notas |
| Cancelar entrenamiento | Confirmación destructiva → descarta workout |

#### Flujos desde Workout Screen

```mermaid
flowchart TD
    WS["⭐ Workout Screen"] -->|"Tap '+' agregar set"| WS_SET["Nuevo SetRow\n(pre-rellenado)"]
    WS -->|"Tap ✔ en set"| RT["⏱ Rest Timer\n(overlay/bottom sheet)"]
    RT -->|"Timer termina o Skip"| WS
    WS -->|"Tap 'Siguiente →'"| WS_NEXT["Scroll al siguiente\nejercicio (slide anim)"]
    WS -->|"Tap 'Finalizar'"| WS_FINISH["📊 Workout Summary\n(modal)"]
    WS -->|"••• → Añadir ejercicio"| EB["🔍 Exercise Browser"]
    EB -->|"Selecciona"| WS
    WS -->|"••• → Reordenar"| WS_DRAG["Modo Drag & Drop"]
    WS_DRAG -->|"Soltar/Confirmar"| WS
    WS -->|"Tap '←' back"| CONF{"¿Guardar progreso?"}
    CONF -->|"Guardar (en background)"| HOME["🏠 Home"]
    CONF -->|"Descartar"| HOME
    WS -->|"PR detectado!"| PR_ALERT["🎉 PR Alert\n(Lottie + confetti)"]
    PR_ALERT -->|"Auto-dismiss 3s"| WS
```

---

### 5.5 📊 Workout Summary (Modal — Post-workout)

**Función**: Resumen al finalizar un entrenamiento.

**Layout**: Modal `presentation: "formSheet"` con `sheetAllowedDetents: [0.75, 1.0]`.

#### Componentes

| # | Componente | Descripción |
| - | - | - |
| 1 | **Header** | "¡Entrenamiento Completado!" + ícono `CheckCircle` (success color). Animación Lottie de celebración (sutil, 1s). |
| 2 | **Métricas principales** | Grid 2×2: Duración (`HH:MM:SS`), Volumen total (kg), Sets completados, Ejercicios realizados. |
| 3 | **Records personales** | Lista de PRs rotos en esta sesión. Cada PR: ícono `Trophy`, tipo (max weight/max reps/1RM), valor, ejercicio. Color `success`. |
| 4 | **Ejercicios realizados** | Lista colapsable: nombre + sets × reps × peso. Ejercicios skipped en gris. |
| 5 | **Input notas** | "¿Cómo fue el entrenamiento?" TextInput multiline. |
| 6 | **Botón "Cerrar"** | CTA primario. Pop modal → Home con toast "Entrenamiento guardado". |

#### Flujos desde Workout Summary

```mermaid
flowchart TD
    WS_SUM["📊 Workout Summary"] -->|"Tap 'Cerrar'"| HOME["🏠 Home\n(toast success)"]
    WS_SUM -->|"Tap un ejercicio"| ED["📄 Exercise Detail"]
    WS_SUM -->|"Tap un PR"| ED_PR["📄 Exercise Detail\n(scroll a PRs)"]
```

---

### 5.6 🔍 Exercise Browser (Bottom Sheet Modal)

**Función**: Buscar, filtrar y seleccionar ejercicios del catálogo.

**Layout**: `@gorhom/bottom-sheet` con `snapPoints: ['75%', '100%']`. Sticky search bar arriba.

#### Componentes Exercise Browser

| # | Componente | Descripción |
| - | - | - |
| 1 | **Search bar** | Input con ícono `Search` (Lucide). Placeholder: "Buscar ejercicios...". Debounce 300ms. Clear button. |
| 2 | **Filtros rápidos** | ScrollView horizontal de chips: **por músculo** (Pecho, Espalda... ) y **por equipo** (Barra, Máquina...). Multi-select. Al Sustituir, el filtro muscular se pre-inyecta automáticamente. |
| 3 | **Lista de ejercicios** | FlashList de `ExerciseListItem`. Al ubicar reemplazos, se divide en **✨ Alternativas Sugeridas** (mismo músculo, distinto equipo) y **Todos los ejercicios**. Cada item: animación WebP, metadata y badges. |
| 4 | **Botón "+ Crear Ejercicio"** | Al final de la lista (o si búsqueda no tiene resultados). Abre **Exercise Creator** (form modal). |
| 5 | **Header de sección** | Agrupación por músculo principal si no hay filtro activo. |

#### Detalle de `ExerciseListItem`

```text
┌──────────────────────────────────────────┐
│  [WebP]  Bench Press                      │
│  40×40   Pecho · Barra · Compound         │
│          ▸ Tap para seleccionar           │
└──────────────────────────────────────────┘
```

- **Tap** → selecciona/deselecciona (checkmark animado). Si viene de Routine Editor: selección múltiple. Si viene de Workout: inserción directa.
- **Long press** → abre **Exercise Detail** en preview sin cerrar el browser.

#### Empty State (búsqueda sin resultados)

"No se encontraron ejercicios" + "¿Querés crear uno personalizado?" + botón CTA.

#### Flujos desde Exercise Browser

```mermaid
flowchart TD
    EB["🔍 Exercise Browser"] -->|"Tap ExerciseListItem"| SELECT["Selecciona ejercicio(s)"]
    SELECT -->|"Si viene de Routine Editor"| RE["✏️ Routine Editor\n(añade ejercicio/s)"]
    SELECT -->|"Si viene de Workout"| WS["⭐ Workout Screen\n(añade ejercicio)"]
    EB -->|"Long press item"| ED["📄 Exercise Detail\n(preview)"]
    EB -->|"Tap '+ Crear Ejercicio'"| EC["📝 Exercise Creator"]
    EC -->|"Guardar"| EB
```

---

### 5.7 📝 Exercise Creator / Editor (Modal)

**Función**: Crear o editar un ejercicio personalizado.

**Layout**: Modal `presentation: "formSheet"`.

#### Componentes Exercise Creator

| # | Componente | Descripción |
| - | - | - |
| 1 | **Header** | "Nuevo Ejercicio" / "Editar Ejercicio". Botón izq: Cancelar. Botón der: Guardar. |
| 2 | **Input nombre** | TextInput con label "Nombre del ejercicio *". Validación: requerido, min 2 chars. |
| 3 | **Selector músculos primarios** | Multi-select chips de `MuscleGroup`. Al menos 1 requerido. |
| 4 | **Selector músculos secundarios** | Multi-select chips de `MuscleGroup`. Opcional. |
| 5 | **Selector equipo** | Single-select segmented control: Barra, Mancuernas, Máquina, Cable, Peso Corporal, Banda, Otro. |
| 6 | **Tipo de ejercicio** | Segmented: Compound / Aislamiento. |
| 7 | **Incremento de peso** | Input numérico con stepper. Default: 2.5 kg. Label: "Incremento mínimo de peso". |
| 8 | **Descripción** | TextInput multiline, label "Descripción (opcional)". |

---

### 5.8 📄 Exercise Detail (Stack Push)

**Función**: Ver información completa de un ejercicio y su historial.

**Layout**: ScrollView con header transparente y animación parallax en la imagen.

#### Componentes Exercise Detail

| # | Componente | Descripción |
| - | - | - |
| 1 | **Animación WebP hero** | Imagen/animación del ejercicio a 200×200 con parallax al scroll. Si no hay animación: placeholder SVG anatómico. |
| 2 | **Nombre y metadata** | Nombre ejercicio (H1), tipo (badge compound/isolation), equipo (badge). |
| 3 | **Músculos** | Primarios (badges `primary` color) + Secundarios (badges `secondary` color). |
| 4 | **Descripción** | Texto expandible si es largo (> 3 líneas). |
| 5 | **Estadísticas** | Card con: Max Peso, Max Reps, 1RM Estimado, Volumen Total, Total Sets. Datos de `ExerciseStats`. Empty state si no hay datos. |
| 6 | **Records Personales** | Lista de PRs por tipo (max_weight, max_reps, max_volume, estimated_1rm) con fecha y valor. Ícono `Trophy`. |
| 7 | **Historial de sets** | FlashList de sets recientes, agrupados por fecha de workout. Cada set: peso × reps, tipo, RIR. |
| 8 | **Gráfico de progreso** | Victory Line Chart: peso máximo por sesión a lo largo del tiempo. Toggle: peso / volumen / 1RM. |

#### Flujos desde Exercise Detail

```mermaid
flowchart TD
    ED["📄 Exercise Detail"] -->|"Tap 'Editar'"| EC["📝 Exercise Editor"]
    ED -->|"Tap set en historial"| WD["📋 Workout Detail\nde esa sesión"]
    ED -->|"←  Back"| PREV["Pantalla anterior"]
```

---

### 5.9 📜 History (Tab)

**Función**: Historial cronológico de todos los entrenamientos.

**Layout**: FlashList con sección headers por mes/semana.

#### Componentes History

| # | Componente | Descripción |
| - | - | - |
| 1 | **Header nativo** | Título "Historial" (large title). |
| 2 | **Filtros de período** | Segmented control (arriba): "Semana" / "Mes" / "Todo". Cambia la agrupación. |
| 3 | **Section headers** | "Marzo 2026" / "Semana del 10 Mar" según filtro. |
| 4 | **WorkoutCard por entry** | Card con: fecha y hora (formateada: "Lun 15 Mar · 18:30"), nombre rutina (o "Libre"), duración, nº ejercicios, volumen total, badges de músculos trabajados. |
| 5 | **Swipe actions** | Swipe izquierda: Eliminar (con confirmación destructiva). |
| 6 | **Long press context menu** | "Ver detalle", "Repetir entrenamiento", "Eliminar". |

#### Detalle de `WorkoutCard` en History

```text
┌──────────────────────────────────────────┐
│  Lun 15 Mar · 18:30                      │
│  Push Day                                 │
│  ⏱ 1h 12min  ·  📊 15,200 kg  ·  5 ej. │
│  [Pecho] [Tríceps] [Hombros]             │
│                                    🏆×2  │
└──────────────────────────────────────────┘
```

`🏆×2` = indica que se rompieron 2 PRs en ese workout.

#### Empty State

Lottie animation (calendario vacío) + "Todavía no hay entrenamientos" + botón "Empezar Ahora".

#### Flujos desde History

```mermaid
flowchart TD
    HI["📜 History"] -->|"Tap WorkoutCard"| WD["📋 Workout Detail"]
    HI -->|"Long press → Repetir"| WS["⭐ Workout Screen\n(carga mismos ejercicios)"]
    HI -->|"Swipe → Eliminar"| CONF["⚠️ Confirmación"]
    CONF -->|"Confirmar"| HI_UPD["📜 History\n(actualizada)"]
```

---

### 5.10 📋 Workout Detail (Stack Push)

**Función**: Ver el detalle completo de un entrenamiento pasado (solo lectura).

**Layout**: ScrollView.

#### Componentes Workout Detail

| # | Componente | Descripción |
| - | - | - |
| 1 | **Header** | Fecha completa ("Lunes 15 de Marzo, 2026"). Botón der: `•••` (opciones). |
| 2 | **Métricas principales** | Grid 2×2: Duración, Volumen total, Sets totales, Ejercicios. Mismo estilo que Workout Summary. |
| 3 | **Notas del workout** | Si existen, card con texto del usuario. |
| 4 | **PRs obtenidos** | Cards de PRs (si los hubo): tipo, valor, ejercicio. Color `success`. |
| 5 | **Lista de ejercicios** | Colapsable por ejercicio. Cada ejercicio: nombre, sets (tabla: #, peso, reps, tipo, RIR). Ejercicios skipped en gris con `Skipped` badge. |

#### Menú overflow (•••)

| Opción | Acción |
| - | - |
| Repetir este entrenamiento | Inicia workout nuevo con mismos ejercicios |
| Eliminar | Confirmación destructiva → pop + toast |

---

### 5.11 📊 Stats (Tab)

**Función**: Visualización de progreso y estadísticas.

**Layout**: ScrollView con secciones seleccionables.

#### Componentes Stats

| # | Componente | Descripción |
| - | - | - |
| 1 | **Header nativo** | Título "Estadísticas" (large title). |
| 2 | **Period selector** | Segmented control: "7 días" / "30 días" / "90 días" / "Todo". Afecta todos los gráficos. |
| 3 | **Resumen numérico** | Card horizontal con métricas del período: Total workouts, Total volumen, Tiempo total, PRs obtenidos. |
| 4 | **Volumen semanal** | Victory Bar Chart. Eje X: días/semanas. Eje Y: volumen (kg). Colores accesibles. Tooltip on tap. |
| 5 | **Balance muscular** | Victory Pie/Donut Chart. Distribución de volumen por músculo. Máx 8 segmentos (agrupar "Otros"). Leyenda interactiva. Tap segmento → highlight + tooltip. |
| 6 | **Frecuencia de entrenamiento** | Heatmap estilo GitHub contributions. Cuadraditos por día, color = intensidad. Tooltip on tap: "3 Mar: 2 entrenamientos, 12,000 kg". |
| 7 | **Top ejercicios** | FlashList (máx 10). Ranking por volumen total. Cada item: nombre, volumen, sets, 1RM. Tap → **Exercise Detail**. |
| 8 | **Records Personales recientes** | Lista de los últimos 10 PRs. Cada PR: ejercicio, tipo, valor, fecha. Ícono `Trophy`. |

#### Reglas de gráficos (skills `ui-ux-pro-max`)

- Leyendas visibles junto al gráfico, no debajo del scroll
- Tooltips en tap con valores exactos
- Empty state por gráfico con mensaje "Sin datos aún" + guidance
- Colores accesibles (no depender solo de rojo/verde)
- `fontVariant: 'tabular-nums'` en ejes numéricos
- Grid lines sutiles (`--border` con baja opacidad)
- Loading state: skeleton shimmer (nunca eje vacío)
- Máx 5 categorías en pie chart (agrupar resto como "Otros")

#### Flujos desde Stats

```mermaid
flowchart TD
    ST["📊 Stats"] -->|"Tap ejercicio en Top"| ED["📄 Exercise Detail"]
    ST -->|"Tap PR en lista"| ED_PR["📄 Exercise Detail\n(scroll a PRs)"]
    ST -->|"Tap día en heatmap"| HI["📜 History\n(filtrada a ese día)"]
```

---

### 5.12 ⚙️ Settings (Tab)

**Función**: Configuración general, datos y preferencias.

**Layout**: ScrollView con secciones agrupadas (estilo iOS Settings).

#### Secciones y componentes

**Sección: Preferencias e Inventario**

| # | Componente | Comportamiento |
| - | - | - |
| 1 | **Unidad de peso** | Switch/Segmented: `kg` / `lbs`. Cambio inmediato con toast "Unidad cambiada a lbs". |
| 2 | **Tema** | Segmented: Claro / Oscuro / Sistema. Cambio en tiempo real. |
| 3 | **Descanso predeterminado** | Stepper con label: "Tiempo de descanso entre sets". Default 90s. Rango 30–300s en pasos de 15s. |
| 4 | **Inventario de Discos** | Multi-select chips: 1.25, 2.5, 5, 10, 15, 20, 25 kg. Activa/desactiva los discos disponibles. Impacta en Plate Math. |
| 5 | **Peso de Barra Base** | Segmented/Tabs: 10kg, 15kg, 20kg. Define peso por defecto sustraído en Plate Math. |

**Sección: Peso Corporal**

| # | Componente | Comportamiento |
| - | - | - |
| 4 | **Último peso registrado** | Card: "72.5 kg · hace 3 días". Si no hay registro: "Sin registros aún". |
| 5 | **Botón "Registrar Peso"** | Abre form sheet con input numérico + date picker + notas. Guardar → toast success. |
| 6 | **Gráfico de peso** | Victory Line Chart (últimos 90 días). Y-axis: peso. Tooltip on tap. |
| 7 | **Historial** | Lista colapsable de entradas: fecha, peso, notas. Swipe para eliminar. |

**Sección: Backup & Exportación**

| # | Componente | Comportamiento |
| - | - | - |
| 8 | **Crear backup** | Botón → progress indicator → success toast con tamaño del archivo. Exporta JSON. |
| 9 | **Restaurar backup** | Botón → file picker (JSON) → confirmación destructiva ("Esto reemplazará TODOS los datos") → progress → success/error. |
| 10 | **Exportar CSV** | Botón → genera CSV → share sheet nativa del OS. |
| 11 | **Google Drive (futuro)** | Botón gris/disabled con texto "Próximamente". |

**Sección: Información**

| # | Componente | Comportamiento |
| - | - | - |
| 12 | **Versión de la app** | Texto: "GymApp v1.0.0". |
| 13 | **Datos almacenados** | Texto: "X entrenamientos · Y ejercicios · Z sets". |

#### Flujos desde Settings

```mermaid
flowchart TD
    SE["⚙️ Settings"] -->|"Tap 'Registrar Peso'"| BW_FORM["📝 Body Weight Form\n(Form Sheet)"]
    BW_FORM -->|"Guardar"| SE
    SE -->|"Tap 'Crear backup'"| BK_PROG["⏳ Progress...\n→ ✅ Toast success"]
    SE -->|"Tap 'Restaurar backup'"| BK_FILE["📂 File Picker"]
    BK_FILE -->|"Selecciona JSON"| BK_CONF["⚠️ Confirmación\ndestructiva"]
    BK_CONF -->|"Confirmar"| BK_RESTORE["⏳ Restaurando...\n→ ✅/❌ Toast"]
    SE -->|"Tap 'Exportar CSV'"| CSV["📤 Share Sheet\n(nativa)"]
```

---

### 5.13 ⏱ Rest Timer (Overlay)

**Función**: Temporizador de descanso entre sets.

**Layout**: Bottom sheet o overlay centrado.

#### Componentes Rest Timer

| # | Componente | Descripción |
| - | - | - |
| 1 | **Countdown circular** | Animación circular que se vacía. Números grandes centrales: `1:30`. `fontVariant: 'tabular-nums'`. |
| 2 | **Botones de ajuste** | `-15s` y `+15s` a los lados del timer. Touch target ≥ 44pt. |
| 3 | **Botón Skip** | "Saltar descanso" debajo del timer. |
| 4 | **Próximo set info** | Texto sutil: "Próximo: Set 3 · 82.5 kg". |

**Comportamiento**:

- Se activa automáticamente al marcar set como completado (✔).
- Tiempo: usa `restSeconds` del ejercicio en la rutina, o `defaultRestSeconds` de UserPreferences.
- Al terminar: haptic `Notification` + sonido sutil + auto-dismiss.
- Es interruptible: tocar cualquier input del workout lo minimiza.

---

## 6. Mapa de Navegación Completo

### 6.1 Árbol de navegación

```mermaid
flowchart TD
    SPLASH["💧 Splash Screen\n(init BD + migraciones)"] --> TABS["📱 Tab Navigator"]

    TABS --> HOME["🏠 Home"]
    TABS --> ROUT["📋 Routines"]
    TABS --> HIST["📜 History"]
    TABS --> STAT["📊 Stats"]
    TABS --> SETT["⚙️ Settings"]

    HOME -->|"'Empezar Entrenamiento'"| RS["Selector de Rutina\n(Bottom Sheet)"]
    RS -->|"Elige rutina"| WS["⭐ Workout Screen"]
    RS -->|"'Vacío'"| WS
    HOME -->|"Tap WorkoutCard"| WD["📋 Workout Detail"]

    ROUT -->|"'+' crear"| RE["✏️ Routine Editor"]
    ROUT -->|"Tap card"| RE_V["👁️ Routine Detail"]
    ROUT -->|"Tap ▶"| WS
    RE -->|"'+ Ejercicio'"| EB["🔍 Exercise Browser"]

    HIST -->|"Tap card"| WD
    HIST -->|"Long press → Repetir"| WS

    STAT -->|"Tap ejercicio"| ED["📄 Exercise Detail"]

    SETT -->|"'Registrar Peso'"| BWF["📝 Body Weight Form"]
    SETT -->|"'Restaurar backup'"| BK["📂 File Picker → Confirm"]

    WS -->|"Finalizar"| WSUM["📊 Workout Summary"]
    WS -->|"'+ Ejercicio'"| EB
    WS -->|"PR detectado"| PR["🎉 PR Alert"]

    EB -->|"Long press"| ED
    EB -->|"'+ Crear'"| EC["📝 Exercise Creator"]

    ED -->|"'Editar'"| EC
    WD -->|"'Repetir'"| WS

    WSUM -->|"Cerrar"| HOME
```

### 6.2 Flujo completo de entrenamiento

```mermaid
flowchart TD
    A["Usuario toca\n'Empezar Entrenamiento'"] --> B["Bottom Sheet:\nSeleccionar rutina"]
    B -->|"Elige rutina"| C["WorkoutService.startWorkout(routineId)"]
    B -->|"'Entrenamiento vacío'"| C2["WorkoutService.startWorkout(null)"]
    C --> D["Mostrar primer ejercicio\ncon animación + peso sugerido"]
    C2 -->|"Abre Exercise Browser"| EB["Seleccionar ejercicios"]
    EB --> D

    D --> WARM{"¿Calentamiento\nsugerido?"}
    WARM -->|"Sí + Acepta"| WARM_SETS["Ejecutar sets\nde calentamiento"]
    WARM -->|"No / Saltar"| E
    WARM_SETS --> E

    E["Usuario rellena set\n(peso + reps + tipo + RIR)"]
    E --> F["Tap ✔ → Completar set"]
    F --> HAP["Haptic Medium\n+ animación check"]
    HAP --> PR_CHECK{"¿Nuevo PR?"}
    PR_CHECK -->|"Sí"| PR["🎉 PR Alert\n(Lottie + Haptic Heavy)"]
    PR_CHECK -->|"No"| SAVE["RecordSet → actualizar stats"]
    PR --> SAVE
    SAVE --> REST["⏱ Rest Timer\n(automático)"]
    REST -->|"Timer termina\no Skip"| MORE_SETS{"¿Más sets\nen este ejercicio?"}

    MORE_SETS -->|"Sí"| E
    MORE_SETS -->|"No"| MORE_EX{"¿Más ejercicios?"}

    MORE_EX -->|"Sí"| SS_CHECK{"¿Es Superset?"}
    SS_CHECK -->|"Sí"| SS["Intercalar con\nejercicio del grupo\n(1A → 1B → 1A...)"]
    SS_CHECK -->|"No"| NEXT["Siguiente ejercicio\n(slide animation)"]
    SS --> D
    NEXT --> D

    MORE_EX -->|"No"| FINISH["WorkoutService.finishWorkout()"]
    FINISH --> SUM["📊 Workout Summary\n(modal con PRs + métricas)"]
    SUM -->|"Cerrar"| HOME["🏠 Home\n(toast 'Entrenamiento guardado')"]
```

---

## 7. Gestión de estado — Zustand

### Stores principales

```typescript
// stores/workoutStore.ts
interface WorkoutState {
  activeWorkout: Workout | null;
  currentExerciseIndex: number;
  restTimerSeconds: number;
  isTimerRunning: boolean;

  // Actions
  startWorkout: (routineId: string) => Promise<void>;
  recordSet: (input: CreateSetInput) => Promise<void>;
  skipExercise: () => void;
  finishWorkout: () => Promise<void>;
  nextExercise: () => void;
  startRestTimer: () => void;
  resetRestTimer: () => void;
}
```

```typescript
// stores/exerciseStore.ts
interface ExerciseState {
  exercises: Exercise[];
  searchQuery: string;
  selectedMuscle: MuscleGroup | null;
  selectedEquipment: Equipment | null;
  filteredExercises: Exercise[];

  // Actions
  loadExercises: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setMuscleFilter: (muscle: MuscleGroup | null) => void;
  setEquipmentFilter: (equipment: Equipment | null) => void;
}
```

```typescript
// stores/statsStore.ts
interface StatsState {
  exerciseStats: Map<string, ExerciseStats>;
  dailyStats: DailyStats[];
  personalRecords: PersonalRecord[];

  // Actions
  loadExerciseStats: (exerciseId: string) => Promise<void>;
  loadDailyStats: (range: DateRange) => Promise<void>;
  loadPRs: (exerciseId: string) => Promise<void>;
}
```

> [!TIP]
> **Rendimiento con Zustand** (skill `vercel-react-native-skills`):
>
> - Usar selectores específicos: `useWorkoutStore(s => s.activeWorkout)`
> - Minimizar state subscriptions
> - Usar `dispatcher pattern` para callbacks estables en listas

---

## 8. Componentes reutilizables

### Design System y Librería Base

Para acelerar el desarrollo sin sacrificar rendimiento, no es necesario construir componentes atómicos (`Button`, `Input`) desde cero. Se recomienda utilizar una librería *headless* o un *UI Kit* moderno y envolverlo en nuestros propios componentes.

> [!TIP]
> **Recomendación de Librerías (Gratis):**
>
> - **[Tamagui](https://tamagui.dev/)**: Considerada la librería UI más rápida para React Native hoy en día. Su compilador extrae estilos estáticos, lo cual es ideal para apps como Hevy que necesitan mucho rendimiento. Incluye componentes interactivos gratuitos.
> - **[Gluestack UI](https://gluestack.io/)**: Componentes accesibles y sin estilo (*headless*) ideales si quieres crear un diseño visual propio muy customizado mediante tokens.
> - **[NativeWind](https://www.nativewind.dev/)**: Si prefieres usar clases de Tailwind CSS en React Native. Ideal combinado con componentes base custom.
> - **Componentes Modales**: Usar sí o sí **`@gorhom/bottom-sheet`** para todos los selectores de rutinas, buscadores (Exercise Browser) y paneles de configuración contextuales emergentes.

```text
src/
├── components/
│   ├── ui/                        ← Wrappers sobre Tamagui / Gluestack
│   │   ├── Button.tsx              ← Variantes: primary, secondary, danger
│   │   ├── Input.tsx               ← Numérico (peso/reps) con stepper
│   │   ├── Badge.tsx               ← PRs, etiquetas de músculo
│   │   ├── Toast.tsx               ← Wrapper de toast-message
│   │   └── Timer.tsx               ← Display de temporizador
│   ├── cards/
│   │   ├── ExerciseCard.tsx        ← Animación + nombre + músculo
│   │   ├── WorkoutCard.tsx         ← Resumen: fecha, duración, volumen
│   │   └── RoutineCard.tsx         ← Nombre + ejercicios count
│   ├── workout/
│   │   ├── SetRow.tsx              ← Input de peso + reps + checkbox
│   │   ├── WorkoutHeader.tsx       ← Timer + ejercicio actual
│   │   └── ExerciseSection.tsx     ← Grupo de sets por ejercicio
│   └── charts/
│       ├── ProgressChart.tsx       ← Victory Line Chart
│       ├── VolumeChart.tsx         ← Victory Bar Chart
│       └── EmptyChartState.tsx     ← Estado vacío con guidance
```

### Ejemplo: `SetRow`

```tsx
import { Pressable, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';

interface SetRowProps {
  setNumber: number;
  weight: number;
  reps: number;
  setType: 'normal' | 'warmup' | 'dropset' | 'failure';
  completed: boolean;
  onComplete: () => void;
  onWeightChange: (value: number) => void;
  onRepsChange: (value: number) => void;
  onTypeChange: (type: string) => void;
}

export function SetRow({
  setNumber, weight, reps, completed, onComplete,
  onWeightChange, onRepsChange,
}: SetRowProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleComplete = () => {
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onComplete();
  };

  return (
    <Animated.View style={[animatedStyle, {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      gap: 12,
      borderRadius: 12,
      borderCurve: 'continuous',
    }]}>
      <Text style={{ fontVariant: ['tabular-nums'], width: 32 }}>
        {setNumber}
      </Text>
      {/* Weight & Reps inputs */}
      <Pressable
        onPress={handleComplete}
        style={{ minWidth: 44, minHeight: 44 }}
      >
        <Text>{completed ? '✔' : '☐'}</Text>
      </Pressable>
    </Animated.View>
  );
}
```

---

## 9. Animaciones de ejercicios

| Aspecto           | Especificación                            |
| ----------------- | ----------------------------------------- |
| **Formato**       | WebP animado                              |
| **Componente**    | `expo-image` (`<Image>`)                  |
| **Ubicación**     | `assets/exercises/animations/`            |
| **Carga**         | Lazy loading, bajo demanda                |
| **Referencia BD** | `exercises.animation_path` (ruta relativa)|

```tsx
import { Image } from 'expo-image';

<Image
  source={require(`../../assets/exercises/animations/${exercise.animationPath}`)}
  style={{ width: 200, height: 200, borderRadius: 16, borderCurve: 'continuous' }}
  contentFit="contain"
  transition={200}
/>
```

---

## 10. Diseño visual

### Paleta de colores

| Token                | Light Mode       | Dark Mode        |
| -------------------- | ---------------- | ---------------- |
| `--background`       | `#FFFFFF`        | `#0F0F14`        |
| `--surface`          | `#F8F9FA`        | `#1A1A24`        |
| `--primary`          | `#3B82F6`        | `#60A5FA`        |
| `--primary-muted`    | `#DBEAFE`        | `#1E3A5F`        |
| `--text-primary`     | `#111827`        | `#F9FAFB`        |
| `--text-secondary`   | `#6B7280`        | `#9CA3AF`        |
| `--success`          | `#10B981`        | `#34D399`        |
| `--danger`           | `#EF4444`        | `#F87171`        |
| `--border`           | `#E5E7EB`        | `#2D2D3A`        |

> [!IMPORTANT]
> **Tokens semánticos obligatorios** — nunca usar hex hardcodeados directamente en componentes. Definir todos los colores como tokens en un ThemeProvider.

### Principios visuales

- **Minimalista**: centrado en datos, sin decoración innecesaria
- **Dark mode por defecto**: optimizado para uso en gimnasio (poca luz)
- **Espaciado 8dp**: sistema de grid consistente (4/8/12/16/24/32/48)
- **Border radius**: `borderRadius: 12` + `borderCurve: 'continuous'`
- **Sombras**: `boxShadow` CSS style (nunca legacy shadow/elevation)
- **Tipografía**: `fontVariant: ['tabular-nums']` en todos los números

---

## 11. Feedback al usuario

| Evento                    | Feedback                                    | Timing       |
| ------------------------- | ------------------------------------------- | ------------ |
| Completar set             | Haptic `Medium` + animación ✔               | < 100ms      |
| Nuevo PR                  | Haptic `Heavy` + animación especial + toast | 150-300ms    |
| Error de validación       | Toast error con mensaje claro               | 3-5s auto    |
| Borrar workout            | Diálogo de confirmación destructivo         | Requiere tap |
| Timer finalizado          | Haptic `Notification` + sonido sutil        | Inmediato    |
| Guardar rutina            | Toast success + animación                   | 3s auto      |

> [!NOTE]
> Feedback háptico solo en iOS (`process.env.EXPO_OS === 'ios'`). En Android usar ripple effect nativo.

---

## 12. Rendimiento

### Reglas críticas (skill `vercel-react-native-skills`)

| Prioridad  | Regla                             | Implementación                           |
| ---------- | --------------------------------- | ---------------------------------------- |
| 🔴 CRITICAL| Virtualizar listas                | FlashList para todas las listas          |
| 🔴 CRITICAL| Memoizar items de lista           | `React.memo` en `SetRow`, `ExerciseCard` |
| 🔴 CRITICAL| Estabilizar callbacks             | `useCallback` en handlers de listas      |
| 🟠 HIGH    | Animar solo transform/opacity     | Nunca animar width/height/top/left       |
| 🟠 HIGH    | Usar Pressable                    | Nunca `TouchableOpacity`                 |
| 🟡 MEDIUM  | Minimizar state subscriptions     | Selectores específicos en Zustand        |
| 🟡 MEDIUM  | `useWindowDimensions`             | Nunca `Dimensions.get()`                 |

### Estrategia de carga inicial

```mermaid
flowchart LR
    A["Splash Screen"] --> B["Inicializar BD\n(migraciones)"]
    B --> C["Cargar ejercicios\nen memoria"]
    C --> D["Cargar config\nusuario"]
    D --> E["Navegar a Home"]
```

---

## 13. Accesibilidad

### Checklist obligatorio (Apple HIG + Material Design)

- [ ] Touch targets ≥ 44×44pt (iOS) / 48×48dp (Android)
- [ ] Contraste texto ≥ 4.5:1 (primario) / 3:1 (secundario)
- [ ] `accessibilityLabel` en todos los botones de ícono
- [ ] Focus order de VoiceOver coincide con el orden visual
- [ ] Soporte para Dynamic Type (texto escalable)
- [ ] `prefers-reduced-motion`: reducir/deshabilitar animaciones
- [ ] Dark mode contrastado independientemente del light mode
- [ ] Sin uso de color como único indicador (agregar ícono/texto)
- [ ] Labels visibles en todos los inputs (no solo placeholder)
- [ ] Confirmación antes de acciones destructivas

---

## 14. Arquitectura de carpetas completa

```text
src/
├── app/                           ← Expo Router (solo rutas)
│   ├── _layout.tsx
│   ├── (workouts)/
│   ├── exercise/
│   ├── history/
│   ├── routine/
│   ├── stats/
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── index.tsx              ← Home
│       ├── routines.tsx
│       ├── history.tsx
│       ├── stats.tsx
│       └── settings.tsx
│
├── components/
│   ├── ui/                        ← Design system base
│   ├── feedback/
│   ├── cards/                     ← Cards reutilizables
│   ├── workout/                   ← Componentes de workout
│   └── charts/                    ← Gráficos Victory
│
├── stores/                        ← Zustand stores
│   ├── workoutStore.ts
│   ├── exerciseStore.ts
│   └── statsStore.ts
│
├── hooks/                         ← Custom hooks
│   ├── useWorkout.ts
│   ├── useExercises.ts
│   ├── useStats.ts
│   └── useRestTimer.ts
│
├── services/                      ← Puente al backend
│   ├── WorkoutService.ts
│   ├── ExerciseService.ts
│   ├── StatsService.ts
│   └── BackupService.ts
│
├── theme/                         ← Design tokens
│   ├── colors.ts
│   ├── spacing.ts
│   ├── typography.ts
│   └── ThemeProvider.tsx
│
├── types/                         ← Tipos compartidos
│   └── index.ts
│
└── assets/
    └── exercises/
        └── animations/            ← WebP animados
```

> [!WARNING]
> **Nunca** colocar componentes, types, o utilidades en la carpeta `app/`. Es un anti-pattern de Expo Router. Solo rutas deben vivir ahí.

---

## 15. Pre-Delivery Checklist

Antes de entregar, verificar según skills `ui-ux-pro-max` y `building-native-ui`:

### Visual

- [ ] Sin emojis como íconos estructurales (usar Lucide)
- [ ] Tokens semánticos de color consistentes (no hex hardcoded)
- [ ] `borderCurve: 'continuous'` en todos los bordes redondeados
- [ ] `boxShadow` en lugar de legacy shadow/elevation

### Interacción

- [ ] Feedback háptico en acciones importantes
- [ ] Animaciones 150-300ms con easing spring/ease-out
- [ ] Disabled states claros y no interactivos
- [ ] Pressed states con scale sutil (0.95-1.05)

### Layout

- [ ] Safe areas respetadas (header, tab bar, bottom)
- [ ] Espaciado 8dp consistente
- [ ] `contentInsetAdjustmentBehavior="automatic"` en ScrollView/FlatList
- [ ] Verificado en teléfono pequeño (375px) + landscape

### Dark Mode

- [ ] Contraste primario ≥ 4.5:1
- [ ] Contraste secundario ≥ 3:1
- [ ] Bordes/divisores visibles en ambos temas
- [ ] Testeado independientemente del light mode
