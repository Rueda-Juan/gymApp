# Diccionario de Vistas y Navegación Maestro - GymApp

Este documento detalla exhaustivamente cada pantalla, su propósito, todos los botones interactivos, su comportamiento, a qué vista redirigen y todas las especificaciones visuales (color, tipografía, tamaño, fondo, borde, etc.).

---

## Sistema de Design Tokens (Referencia Rápida)

### Tipografía — `AppText` variantes

| Variante   | fontSize token | px  | fontWeight | Notas                        |
| ---------- | -------------- | --- | ---------- | ---------------------------- |
| `titleLg`  | `$7`           | 30  | `$7` (700) | letterSpacing -0.5           |
| `titleMd`  | `$6`           | 24  | `$7` (700) | letterSpacing -0.5           |
| `titleSm`  | `$5`           | 20  | `$7` (700) |                              |
| `subtitle` | `$4`           | 18  | `$7` (700) |                              |
| `bodyLg`   | `$4`           | 18  | `$5` (500) |                              |
| `bodyMd`   | `$3`           | 16  | `$4` (400) |                              |
| `bodySm`   | `$2`           | 14  | `$4` (400) |                              |
| `label`    | `$1`           | 12  | `$7` (700) | letterSpacing 0.5, UPPERCASE |

### Colores del Tema (light / dark) — Temper v2

| Token               | Light                         | Dark                     |
| ------------------- | ----------------------------- | ------------------------ |
| `$background`       | `#F5F2EC` (coal50)            | `#0D0C0A` (coal950)      |
| `$surface`          | `#FFFFFF`                     | `#161410` (coal900)      |
| `$surfaceSecondary` | `#EAE6DF` (coal100)           | `#1E1B16` (coal850)      |
| `$color` (texto)    | `#161410` (coal900)           | `#F5F2EC` (coal50)       |
| `$textSecondary`    | `#4A4337`                     | `#B0A899` (coal300)      |
| `$textTertiary`     | `#8C8374` (coal400)           | `#6B6352` (coal500)      |
| `$primary`          | `#D4621A` (copper400)         | `#E8762E` (copper350)    |
| `$primarySubtle`    | `rgba(212,98,26,0.08)`        | `rgba(232,118,46,0.12)`  |
| `$gold`             | `#9A7A1A` (emberText — texto) | `#E8B84B` (ember400)     |
| `$goldSubtle`       | `rgba(232,184,75,0.15)`       | `rgba(232,184,75,0.15)`  |
| `$info`             | `#3A6494` (steel500)          | `#4F80B8` (steel400)     |
| `$infoSubtle`       | `rgba(58,100,148,0.08)`       | `rgba(79,128,184,0.12)`  |
| `$success`          | `#2A9E65`                     | `#3DB87A`                |
| `$successSubtle`    | `rgba(42,158,101,0.10)`       | `rgba(61,184,122,0.12)`  |
| `$danger`           | `#C04040`                     | `#E05252`                |
| `$dangerSubtle`     | `rgba(192,64,64,0.10)`        | `rgba(224,82,82,0.12)`   |
| `$warning`          | `#A06020`                     | `#D4882A`                |
| `$borderColor`      | `rgba(0,0,0,0.08)`            | `rgba(255,255,255,0.07)` |

### Espaciado (`space` tokens)

`$xs`=4 · `$sm`=8 · `$md`=12 · `$lg`=16 · `$xl`=20 · `$2xl`=24 · `$3xl`=32 · `$4xl`=40

### Border-radius (`radius` tokens)

`$sm`=6 · `$md`=8 · `$lg`=12 · `$xl`=16 · `$2xl`=24 · `$full`=9999

### Alturas fijas estándar

`buttonHeight`=52 · `iconButton`=40 · `inputHeight`=44 · `setRowHeight`=48 · `miniPlayerHeight`=56

### `CardBase` (componente base de tarjeta)

- `backgroundColor`: `$surface`
- `borderRadius`: `$lg` (12)
- `borderCurve`: `continuous`
- Sombra via token `elevation.card` (ver tabla abajo)

### Elevation Tokens (`@/constants/elevation`)

| Token                | `shadowOpacity` | `shadowRadius` | `shadowOffset` | Android `elevation` | Uso                               |
| -------------------- | --------------- | -------------- | -------------- | ------------------- | --------------------------------- |
| `elevation.flat`     | 0               | 0              | {0,0}          | 0                   | Tarjetas con borde, inline        |
| `elevation.card`     | 0.05            | 8              | {0,2}          | 2                   | `CardBase` variant default        |
| `elevation.floating` | 0.15            | 12             | {0,4}          | 6                   | Mini-player, FAB, chips flotantes |
| `elevation.modal`    | 0.25            | 20             | {0,8}          | 12                  | Bottom sheets, modales, overlays  |

### Motion Tokens (`@/constants/motion`)

| Token                     | Valor                       | Uso                                        |
| ------------------------- | --------------------------- | ------------------------------------------ |
| `motion.duration.instant` | 80ms                        | Micro-feedback, iconos                     |
| `motion.duration.fast`    | 150ms                       | Dismiss, cierre, salida rápida             |
| `motion.duration.normal`  | 220ms                       | Toggle, transiciones de entrada estándar   |
| `motion.duration.slow`    | 320ms                       | Mini-player, fades largos                  |
| `motion.duration.hero`    | 520ms                       | Hourglass, summary, animaciones narrativas |
| `motion.spring.snappy`    | d:14 s:240 m:0.9            | Drag-to-reorder, escala cards              |
| `motion.spring.heavy`     | d:18 s:180 m:1.1            | Rest timer card, sheets                    |
| `motion.spring.sheet`     | d:20 s:160 m:1.2            | Bottom sheets                              |
| `motion.spring.bounce`    | d:12 s:200 m:0.8            | Barra de progreso workout                  |
| `motion.spring.subtle`    | d:20 s:120 m:1.0            | RIR selector                               |
| `motion.scale.press`      | 0.96                        | Tap feedback (reemplaza hardcoded 0.9)     |
| `motion.scale.micro`      | 1.03                        | Drag-to-reorder lift                       |
| `motion.scale.pop`        | 1.08                        | PR badge, reward                           |
| `motion.easing.symmetric` | `Easing.inOut(Easing.ease)` | Skeleton loader, pulso suave               |

### `AppButton` variantes

| Variante  | bg                  | color texto | height (lg) | borderRadius (lg)             |
| --------- | ------------------- | ----------- | ----------- | ----------------------------- |
| `primary` | `$primary`          | `white`     | 56          | 16                            |
| `outline` | `transparent`       | `primary`   | 56          | 16 · borde 1px `$borderColor` |
| `ghost`   | `$surfaceSecondary` | `color`     | 56          | 16                            |
| `danger`  | `$danger`           | `color`     | 56          | 16                            |

**Sizes disponibles:** `sm` (height 44, radius 10, fontSize 14) · `md` (height 44, radius 12, fontSize 16) · `lg` (height 56, radius 16, fontSize 18)

### `Badge` variantes

| Variante  | bg                  | color texto      | padding                      |
| --------- | ------------------- | ---------------- | ---------------------------- |
| `primary` | `$primarySubtle`    | `$primary`       | 8h · 4v (sm) / 12h · 4v (md) |
| `success` | `$successSubtle`    | `$success`       | igual                        |
| `warning` | `$warningSubtle`    | `$warning`       | igual                        |
| `danger`  | `$dangerSubtle`     | `$danger`        | igual                        |
| `ghost`   | `$surfaceSecondary` | `$textSecondary` | igual                        |

---

## Pestañas Principales (Tab Bar)

- **Ruta Base:** `app/(tabs)/`
- **Fondo del Tab Bar:** `$tabBar` (light: `rgba(255,255,255,0.8)` / dark: `rgba(26,26,36,0.9)`) con blur
- **"Mini-Player" Flotante:** Posición `absolute`, `bottom` = SafeAreaInsets.bottom + 60, `left`/`right` 12px. Fondo `$surfaceSecondary`, borde 1px `$borderColor`, `borderRadius $xl` (16), `height` 56, `elevation.floating`. Icono `Activity` 20px `$primary` sobre fondo `$primarySubtle` 40×40 `$md` radius. Texto ejercicio: `bodyMd` `$color` `fontWeight 600`. Timer descanso (condicional): `titleSm` `$success` `tabularNums`. Botón "Retomar": `AppButton ghost sm` `height 32`.

---

### 1. Inicio / Dashboard (`app/(tabs)/index.tsx`)

**Fondo de pantalla:** `$background` (SafeAreaView)

#### Header

- **Contenedor:** `paddingHorizontal $xl` (20) · `paddingTop $xl` (20) · `paddingBottom $lg` (16)
- **Botón Perfil (Pressable):** Redirige a `/settings/profile`
  - Texto "Bienvenido": `bodyLg` (18px/500) · color `$textSecondary`
  - Texto nombre: `titleLg` (30px/700/ls-0.5) · color `$color`
- **Icono Dumbbell (IconButton):** `Dumbbell` 24px `$primary` · fondo `$surfaceSecondary` · 40×40 · `borderRadius` 20

#### CTA Principal

- **Contenedor:** `paddingHorizontal $xl` · `paddingBottom $xl`
- **Tarjeta "Entrenamiento en curso" (Condicional):** `backgroundColor $primary` · `height` 80 · `borderRadius $lg` (12) · `paddingHorizontal $lg` (16) · animación `FadeInUp.springify()`
  - Icono `Activity` 20px color `surface`
  - Texto "ENTRENAMIENTO EN CURSO": `bodySm` (14px/400) · color `surface` · `opacity` 0.8 · `fontWeight 700`
  - Texto rutina: `titleSm` (20px/700) · color `surface` · `marginTop $xs` (4)
- **Botón "Nueva Sesión" (Si no hay activo):** `AppButton primary` · 56px alto · `borderRadius` 16 · bg `$primary` · icono `Play` 24px color `surface`

#### Stats Row

- **Contenedor:** `paddingHorizontal $xl` · `gap $md` (12)
- **Tarjeta cadena de racha:**
  - `CardBase`: fondo `$surface` · `borderRadius $lg` · padding `$md` (12) · `flex 1`
  - Icono `Flame` 16px `$primary` · texto "RACHA": `label` (12px/700/uppercase) `$textSecondary`
  - Valor: `titleMd` (24px/700) · texto "días": `bodySm` (14px/400) · color `$textTertiary`
- **Tarjeta semana:** idéntica · icono `Activity`

#### Último Entrenamiento

- **Sección:** `marginBottom $xl` · `paddingHorizontal $xl` · `marginTop $xl`
- **Título:** `titleSm` (20px/700) · enlace "Ver todo" `bodyMd` (16px/400) · color `$primary` · `fontWeight $6`(600)
- **CardBase:** padding `$none`
  - Header de la card: `padding $md` · borde bottom 1px `$borderColor`
    - Título "Sesión de Entrenamiento": `fontSize $4` (18px) · `fontWeight $7` (700)
    - Fecha relativa: `fontSize $2` (14px) · color `$textTertiary` · `marginTop $xs`
    - `Badge success`: bg `$successSubtle` · texto "ENTRENADO" · color `$success`
  - Body: `padding $md`
    - Icono `Clock` 16px `$textSecondary` · duración: `bodySm` `$textSecondary`
    - Icono `Dumbbell` 16px `$textSecondary` · ejercicios: `bodySm` `$textSecondary`

#### Carrusel de Rutinas

- **Sección:** `marginTop $xl`
- **Título:** `titleSm` · enlace "Ver todas" `bodyMd` `$primary` `fontWeight $6`
- **Estado vacío:** padding `$xl` · `borderRadius $lg` · borde 1px `$borderColor` · fondo `$surfaceSecondary` · mensaje `bodyMd` `$textSecondary`; botón `AppButton primary` "Crear primera rutina"
- **Tarjeta de rutina (CardBase):** `width` 280 · padding `$md` · `snapToInterval` 292 · `gap` 12 · `paddingHorizontal` 20
  - Nombre rutina: `titleSm` (20px/700) `fontWeight $7` `flex 1` `numberOfLines 1`
  - Botón ⋯ (IconButton): icono `MoreHorizontal` 25px `$darkText` · 44×44 · fondo `transparent`
  - Ejercicios: `bodySm` (14px/400) color `$textSecondary` · `marginBottom $md` · `numberOfLines 2`
  - Contador: `label` (12px/700/uppercase) color `$textTertiary`
  - Botón Play (IconButton): icono `Play` 22px `$primary` `strokeWidth 3` · 44×44 · fondo `transparent`

---

### 2. Biblioteca de Rutinas (`app/(tabs)/routines.tsx`)

**Fondo de pantalla:** `Screen` → `$background`

#### Header

- **Contenedor:** `paddingHorizontal $lg` (16) · `paddingTop $lg` · `paddingBottom $md` (12)
- **Título:** `titleLg` (30px/700/ls-0.5) · color `$color`
- **Botón "+" (IconButton):** icono `Plus` 24px color `background` · 44×44 · bg `$primary` · `borderRadius` 22

#### Barra de Búsqueda

- **Contenedor:** `paddingHorizontal $lg` · `paddingBottom $md`
- **XStack:** `height` 48 · `borderRadius $lg` (12) · `borderWidth` 1 · `paddingHorizontal $md` · bg `$surface` · `borderColor $borderColor`
- **Icono** `Search` 20px `$textTertiary`
- **TextInput:** `flex 1` · `fontSize` 16 · `fontWeight 500` · color `$color`; placeholder color `$textTertiary`

#### Lista de Rutinas

- **Scroll:** `paddingHorizontal` 16 · `gap` 16 · `paddingBottom` 100
- **Skeleton:** 3× `RoutineCardSkeleton` pulsante durante carga
- **Tarjeta de Rutina (CardBase):** `gap $md` · `padding $md` · animación `FadeInDown.delay(i*100).springify()`
  - Fila superior: texto timestamp `label` color `$textTertiary`
  - **Botón Play ▶ (IconButton):** icono `Play` 20px `fill $primary` · bg `$primarySubtle`
  - Nombre: `titleMd` (24px/700/ls-0.5)
  - Ejercicios: `bodyMd` (16px/400) color `$textSecondary` · `numberOfLines 2` — ejercicios en el mismo superset se muestran unidos con " + " (ej: "Press Banca + Aperturas"), grupos separados con ", "
  - Badges músculos: `Badge primary` automáticos si `routine.muscles` tiene datos

#### Estado Vacío

- **Contenedor:** `padding $4xl` (40) · `alignItems center` · `marginTop $xl`
- **Mensaje:** `bodyMd` color `$textSecondary`

---

### 3. Historial de Sesiones (`app/(tabs)/history.tsx`)

**Fondo de pantalla:** `Screen` → `$background`

#### Header

- **Contenedor:** `paddingHorizontal $lg` · `paddingTop $lg` · `paddingBottom $sm` (8)
- **Título:** `titleLg` (30px/700/ls-0.5)

#### Barra de Búsqueda

- **XStack:** `height` 48 · `borderRadius $lg` · borde 1px `$borderColor` · `paddingHorizontal $md` · bg `$surface`
- **Icono** `Search` 20px `$textTertiary`
- **AppInput:** `flex 1` · `borderWidth 0` · bg `transparent` · `paddingHorizontal 0`; placeholder "Buscar por fecha o ejercicio..."

#### Lista de Entrenamientos

- **Skeleton:** 4× `HistoryCardSkeleton` durante carga · `paddingHorizontal $lg` · `gap $md`
- **FlatList:** `paddingHorizontal` 16 · `paddingBottom` 100 · `ItemSeparatorComponent` `View height $md`
- **CardBase (por entrenamiento):** `gap $lg` · `padding $md` · animación `FadeInDown.delay(i*50).springify()`
  - Nombre: `bodyMd` (16px/400) `fontWeight 700`
  - Fecha: icono `Calendar` 12px `$textTertiary` + texto `bodySm` `$textTertiary`
  - Icono `ChevronRight` 20px `$textTertiary`
  - Métricas en fila (`gap $lg` `marginTop $sm`): icono 14px `$primary` + texto `bodySm` `$textSecondary` para duración (Clock), volumen (Dumbbell), nº ejercicios (History)

#### Swipe-to-Delete

- **Swipeable (react-navigation-gesture-handler):** `overshootRight false`
- **Botón de borrado (reveal):** `width` 80 · `height 100%` · YStack `backgroundColor $danger` · `borderRadius $lg` · `marginLeft $sm`
  - Icono `Trash2` 24px color `background`

#### Estado Vacío

- **Icono** `History` 48px `$textTertiary` + texto `bodyMd` `$textTertiary` `marginTop $md`

### 3b. Detalle de Entrenamiento (`app/history/[id].tsx`)

**Fondo de pantalla:** `Screen` → `$background`

#### Header

- **Back:** `ChevronLeft` 24px → `router.back()`
- **Título:** `titleSm` — nombre de rutina o "Entrenamiento"
- **Delete:** `Trash2` 20px `$danger` → Alerta nativa de confirmación

#### Summary Card (CardBase)

- Fecha + hora (`Calendar` 16px `$textTertiary`) y duración (`bodySm` `$textTertiary`)
- Métricas: VOLUMEN y SETS (`label` `$textTertiary` + `titleSm`)

#### Exercises List

- **Superset visual:** Ejercicios con mismo `supersetGroup` se agrupan con barra vertical izquierda (`View width=3 bg=$primary`) y etiqueta `SUPERSET` (`label` color `$primary` + icono `Link2` 12px) sobre el primer ejercicio. Separación reducida entre ejercicios del mismo grupo (`$sm` vs `$2xl`).
- **Nombre ejercicio:** `subtitle` color `$primary`
- **Filas set:** `bodyMd` `$textSecondary` (SET N) + `bodyMd` (peso × reps)

---

### 4. Estadísticas y Progreso (`app/(tabs)/stats.tsx`)

**Fondo de pantalla:** `Screen` → `$background`

#### Header

- **Contenedor:** `paddingHorizontal $xl` · `paddingTop $lg` · `paddingBottom $md`
- **Título:** `titleLg`
- **Botón Share:** icono `Share` 20px `$textTertiary` · padding 8px; redirige a `/stats/weight`

#### Grid de Resumen (4 métricas)

- **Layout:** `XStack flexWrap` · `justifyContent space-between` · `rowGap $md`
- **Cada CardBase:** `width 47%` · `padding $md`
  - Icono genérico 16px `$primary` + texto `label` `$textTertiary`
  - Valor: `titleMd` (24px/700)

#### Tarjeta Peso Corporal (CardBase `padding $md`)

- Icono `Scale` 20px `$primary` + texto `titleSm`
- **Botón "+" (IconButton):** `Plus` 16px `$primary` · 32×32 · bg `$primarySubtle`; redirige a `/stats/weight`
- Valor: `titleLg` `fontSize` 40 + "kg" `bodyMd` `$textSecondary` `marginLeft $xs` `marginTop $sm`
- Label "ÚLTIMOS 30 DÍAS": `label` `$textTertiary` `marginBottom $md`
- **Gráfico:** `StatsLineChart` si ≥2 registros; si no, `height` 120 · texto `bodyMd` `$textTertiary`

#### Tarjeta Volumen Semanal (CardBase `padding $none`)

- Título: `bodyMd` `$textTertiary` `fontWeight 600` · `padding $md`
- **Gráfico:** `WeeklyVolumeBarChart` debajo

---

### 5. Ajustes e Inventario (`app/(tabs)/settings.tsx`)

**Fondo de pantalla:** `Screen` → `$background`

#### Header

- **Contenedor:** `paddingHorizontal $xl` · `paddingTop $lg` · `paddingBottom $md`
- **Título:** `titleLg`

#### `SettingItem` (componente interno)

- **Layout:** `paddingVertical $sm` (8) · `justifyContent space-between`
- **Icono container:** 40×40 · `borderRadius` 20 · bg `$surfaceSecondary`; icono 18px `$primary`
- **Texto label:** `bodyMd` (16px/400) `fontWeight 500`
- **Flecha ChevronRight:** 18px `$textTertiary` (tipo `link`)
- **Switch:** `trackColor.false $surfaceSecondary` · `trackColor.true $primary` · `thumbColor #FFF`

#### Sección PERFIL

- **Etiqueta de sección:** `label` `$textTertiary` `marginBottom $xs`
- **CardBase:** `padding $md` · 3× `SettingItem` (Perfil, Notificaciones, Privacidad) con íconos `User`, `Bell`, `Lock`

#### Sección EQUIPAMIENTO

- **Etiqueta de sección:** `label` `$textTertiary`
- **Sub-etiquetas:** `bodySm` `$textSecondary` `marginBottom $xs` `marginLeft $xs`
- **Chips de discos (CardBase `padding $md` `marginBottom $md`):** `XStack flexWrap` `gap $sm`
  - **Chip inactivo:** `paddingHorizontal $md` · `paddingVertical $xs` · `borderRadius $full` · borde 1px `$borderColor` · bg `$surfaceSecondary` · texto `bodyMd` `$textSecondary` `fontWeight 400`
  - **Chip activo:** borde `$primary` · bg `$primarySubtle` · texto `$primary` `fontWeight 700`
- **Chips de barra (CardBase `padding $md`):** `XStack justifyContent space-between` `gap $xs`
  - **Chip inactivo:** `paddingVertical $sm` · `borderRadius $md` · borde `$borderColor` · bg `$surfaceSecondary` · texto `bodyMd` `$textSecondary` `fontWeight 500` `flex 1`
  - **Chip activo:** borde `$primary` · bg `$primarySubtle` · texto `$primary` `fontWeight 700`

#### Sección APLICACIÓN

- **CardBase `padding $md` `marginBottom $md`:** Switch Modo Oscuro (`Moon`), Ayuda (`CircleHelp`), Info (`Info`)
- **Sub-sección Timer:** `AppInput` numérico · texto `bodyMd` "Duración actual: X seg"

#### Cerrar Sesión

- **Fila:** `padding $md` · `gap $sm` · centrada
- **Icono** `LogOut` 20px `$danger` + texto `bodyMd` `fontWeight 700` color `$danger`

#### Versión

- **Texto:** `bodySm` `$textTertiary` · `marginTop $xl` · centrado

---

## Vistas Operativas (Modo Entrenamiento)

### 6. Entrenamiento Activo (`app/(workouts)/[active].tsx`)

**Fondo de pantalla:** `Screen scroll=false` → `$background`

#### Header (`WorkoutHeader`)

- **Contenedor:** `backgroundColor $background` · `zIndex` 10
- **Layout interno:** `paddingHorizontal $xl` · `paddingVertical $sm`
- **Botón X (IconButton):** icono `X` 24px `$color` · 40×40 · bg `$surfaceSecondary` · `borderRadius` 20
- **Centro (YStack):**
  - Tiempo: `bodySm` (14px/400) `$textTertiary` `tabularNums` `fontWeight 600`
  - Nombre rutina: `titleSm` (20px/700) · `maxWidth` 180 · `numberOfLines 1`
  - Contador ejercicio: `label` (12px/700/uppercase) `$primary` · `marginTop` 2
- **Botón "Finalizar":** `paddingHorizontal $md` · `paddingVertical $sm` · `borderRadius $lg` · bg `$primarySubtle` · texto `bodySm` `$primary` `fontWeight 700`
- **Barra de progreso (debajo del header):** `height` 4 · bg `$borderColor`; relleno bg `$primary` · width `(currentIndex+1)/total * 100%`

#### Chip de Descanso (condicional bajo el header)

- **YStack:** `borderRadius $xl` (16) · bg `$primarySubtle` · borde 1px `$primary` · `paddingHorizontal $sm` · `paddingVertical $xs` · `alignSelf center` · `marginTop $sm`
- **Texto:** `label` (12px/700/uppercase) · color `$primary` · contenido "DESCANSO: Xs"

#### Cuerpo — Cabecera de ejercicio individual

- **Contenedor:** `paddingHorizontal $xl` · `paddingTop $lg` · `paddingBottom $sm`
- **Nombre:** `titleMd` (24px/700/ls-0.5) · `numberOfLines 2`
- **Progreso sets:** `bodySm` (14px/400) color `$textSecondary` · `marginTop $xs`
- **Botón "Saltar":** `paddingHorizontal $sm` · `paddingVertical $xs` · `borderRadius $md` · bg `$surfaceSecondary`; icono `SkipForward` 14px `$textTertiary` + texto `label` `$textTertiary`
- **Badge "OMITIDO":** `Badge danger sm`
- **Icono MoreVertical:** 20px `$textTertiary` · `padding $xs`

#### Cuerpo — Tarjetas peso anterior / sugerido

- **Layout:** `XStack gap $sm` · `paddingHorizontal $xl` · `marginBottom $lg`
- **Tarjeta "PESO ANTERIOR":** `flex 1` · bg `$surface` · `borderRadius $lg` · borde 1px `$borderColor` · `padding $md`
  - Etiqueta: `label` `$textTertiary` `marginBottom $xs`
  - Valor: `titleSm` (20px/700) `tabularNums`
- **Tarjeta "SUGERIDO":** `flex 1` · bg `$primarySubtle` · `borderRadius $lg` · borde 1px `$primary` · `padding $md`
  - Etiqueta: `label` `$primary` `marginBottom $xs`
  - Valor: `titleSm` color `$primary` `tabularNums`
  - Mensaje deload/recovery: `label` `$warning` `marginTop $xs` `numberOfLines 2`

#### Cuerpo — Tabla de Sets

- **Contenedor:** `paddingHorizontal $xl`
- **Cabecera de columnas:** `marginBottom $xs` `paddingHorizontal 4`; textos `label` `$textTertiary` (SET width 32 center · KG flex 1.2 center · REPS flex 1 center · columna check width 44)
- **Filas:** `YStack gap $xs`
- **Botón "+ Añadir set":** `borderWidth` 1.5 · `borderStyle dashed` · `borderColor $borderColor` · `borderRadius $lg` · `paddingVertical $md` · `marginTop $md`; icono `Plus` 16px `$textTertiary` + texto `bodyMd` `$textTertiary` `fontWeight 600`

#### Fila de Set (`set-row.tsx`)

- **Contenedor externo:** `YStack width 100%` · `borderRadius $lg` · `overflow hidden` · `height` 52
- **Estado normal:** fondo heredado del padre
- **Estado completado:** bg `$successSubtle` · borde `$success`
- **Columna número/tipo (Pressable · width 32):**
  - Normal: texto `bodySm` `$textSecondary` `fontWeight 700`
  - Warmup: icono `Flame` 16px `$warning`
- **Input Peso (flex 1.2):** bg `$surfaceSecondary` (normal) / `$successSubtle` (completado) · `borderRadius` 8 · `fontSize` 16 · `fontWeight 700` · color `$color`/`$success`; placeholder `$textTertiary`; icono `Info` 14px `$textTertiary` al extremo derecho
- **Input Reps (flex 1):** mismo estilo sin icono info
- **Botón Check (44×40):** `borderRadius` 8 · bg interpolado: `$surfaceSecondary` → `$successSubtle` (Reanimated); icono `Check` 22px `$textTertiary`/`$success` `strokeWidth 3`
- **Botón Trash (fallback accesible · 38×38):** `borderRadius` 19 · bg `$surfaceSecondary`; icono `Trash2` 18px `$danger`
- **Capa delete (absolute):** right 0 · `width` 80 · bg `#EF4444` · `borderRadius` 12; icono `Trash2` 20px `background`; opacity 0→1 interpolada con translateX
- **RIR Pills (animación Reanimated):** 5× `Button size $2 circular`; activo bg `$primary` txt `background`, inactivo bg `$surfaceSecondary` txt `$color`; `fontSize` 12 `fontWeight 700`; botón X `14px $textTertiary`

#### Cuerpo — Modo Superset (Carrusel)

- **Tabs horizontales:** `ScrollView horizontal` · `paddingHorizontal` 16 · `paddingVertical` 8 · `gap` 8
  - **Tab inactivo:** `paddingHorizontal` 12 · `paddingVertical` 6 · `borderRadius` 20 · bg `$surfaceSecondary` · borde 1px `$borderColor`; texto `label` `$textSecondary` `fontWeight 500`
  - **Tab activo:** bg `$primary` · borde `$primary`; texto `label` color `background` `fontWeight 700`
- **Carrusel:** `ScrollView pagingEnabled horizontal scrollEnabled=false` · `flex 1`; cada página `YStack width={screenWidth}`

#### Bottom Navigation Bar

- **Contenedor:** `position absolute` · `bottom 0` · `backgroundColor $surface` · borde top 1px `$borderColor` · `paddingBottom $xl` · `paddingTop $md` · `paddingHorizontal $xl`
- **Botón ← Anterior:** 52×52 · `borderRadius $lg` · bg `$surfaceSecondary`; icono `ChevronLeft` 22px `$color`; `opacity` 0.3 si es el primero
- **Botón + Ejercicio:** 52×52 · `borderRadius $lg` · bg `$surfaceSecondary`; icono `Plus` 22px `$color`
- **Botón Hourglass:**
  - **Inactivo:** 52×52 · `borderRadius $lg` · bg `$surfaceSecondary` · borde 1px `$borderColor`; icono `Hourglass` 22px `$color`; sin animación
  - **Activo (restTimerIsActive):** bg `$successSubtle` · borde 1px `$success`; icono `Hourglass` 22px `$success`; rotación 0→180° loop `withRepeat(withTiming(180,1000),-1,true)`
- **Botón Sig. Ejercicio/Finalizar (flex 1):** `height` 52 · `borderRadius $lg`
  - **Normal:** bg `$primary`; texto `bodyMd` color `background` `fontWeight 700`; icono `ChevronRight` 20px `background`
  - **Guardando...:** bg `$surfaceSecondary`; texto `bodyMd` color `$textTertiary` `fontWeight 700`; sin icono; `disabled`

#### Exercise Picker BottomSheet

- **BottomSheet:** `snapPoints ['50%','90%']` · bg `$surfaceSecondary` · handle `$textTertiary`
- **Header:** `padding` 12 · título `titleSm` + icono `X` 24px `$textSecondary`
- **Search bar:** `height` 48 · `borderRadius $lg` · `paddingHorizontal $md` · bg `$surface`; icono `Search` 20px `$textTertiary`; `BottomSheetTextInput fontSize` 16 color `$color`; placeholder `$textTertiary`
- **Fila de ejercicio:** `paddingVertical $md` · borde bottom 1px `$borderColor`; nombre `subtitle` · músculos/equipo `label` `$textSecondary`; icono `Check` 20px `$primary`

#### Exercise Options BottomSheet

- **BottomSheet:** `snapPoints [300]` · mismo estilo
- **Filas de opciones:** `paddingVertical $md` · borde bottom 1px `$borderColor`; texto `bodyMd`
  - "Eliminar Ejercicio": texto `danger` `fontWeight 700`; sin borde bottom
- **ChevronRight:** 20px `$textTertiary`

---

### 7. Timer de Descanso (`app/(workouts)/rest-timer.tsx`)

**Modal sobre pantalla anterior — no navega a pantalla nueva**

- **Backdrop:** `position absolute top/left/right/bottom 0` · bg `rgba(0,0,0,0.6)` · tap → `router.back()`
- **Sheet YStack:** `backgroundColor $surface` · `borderTopLeftRadius $xl` (16) · `borderTopRightRadius $xl` · `paddingBottom $xl`
- **Barra de progreso (top de la sheet):** `height` 6 · bg `$surfaceSecondary`; relleno bg `$primary` · Reanimated `scaleX` (0→1)
- **Etiqueta "DESCANSO":** `label` `$textTertiary` · `letterSpacing` 2
- **Tiempo:** `titleLg` con override `fontSize` a `FONT_SCALE.sizes.hero` (72px) · `fontVariant tabular-nums`
- **Botón -10s:** 60×60 · `borderRadius` 30 · bg `$surfaceSecondary`; icono `Minus` 24px `$color`; sub-etiqueta `label` `$textSecondary` `fontSize` 10
- **Botón Stop (activo):** 84×84 · `borderRadius` 42 · bg `$dangerSubtle`; icono `Square` 32px `fill $danger` color `$danger`
- **Botón Play (inactivo):** 84×84 · `borderRadius` 42 · bg `$primary`; icono `Play` 32px `fill background` color `background`
- **Botón +10s:** idéntico a -10s con icono `Plus`

---

### 8. Gestor / Creador de Rutinas (`app/routine/[id].tsx` y `create.tsx`)

**Fondo de pantalla:** `Screen` → `$background`

#### Header

- **Contenedor:** `paddingHorizontal $lg` · `height` 56 · `justifyContent space-between`
- **Botón X (IconButton):** icono `X` 24px `$color` · 40×40 · bg `$surfaceSecondary`
- **Nombre rutina:** `titleSm` `numberOfLines 1` `flex 1` `textAlign center` `paddingHorizontal $md`
- **Botón Share (IconButton):** icono `Share2` 20px color `background` · bg `$secondary`
- **Botón Guardar (IconButton):** icono `Save` 20px color `background` · bg `$primary`

#### Campos de formulario

- **Etiquetas:** `label` `$textSecondary` `marginBottom $xs`
- **AppInput nombre:** estándar · `borderRadius $lg` · `height` 44
- **AppInput notas:** `multiline` · `minHeight` 80 · `maxHeight` 160 · `textAlignVertical top`

#### Sección Ejercicios

- **Título sección:** `titleSm` · Botón "Agregar": icono `Plus` 18px `$primary` + texto `bodyMd` `$primary` `fontWeight 600`

#### Lista drag & drop (`NestableDraggableFlatList`)

- **ScaleDecorator** envuelve cada `RoutineExerciseRow`

#### Botón "Eliminar Rutina" (footer, solo `[id].tsx`)

- **Fila centrada:** `padding $md` `gap $sm`
- Icono `Trash2` 18px `$danger` + texto `bodyMd` `$danger` `fontWeight 600`

---

### 9. Explorador de Ejercicios (`app/(workouts)/exercise-browser.tsx`)

_(Sin cambios estructurales visuales desde la versión anterior — retoma los tokens del BottomSheet del punto 6)_

---

### 10. Detalle Anatómico (`app/exercise/[id].tsx`)

_(Pantalla de consulta, sin interacción compleja — tokens base: fondo `$background`, tarjetas `CardBase`, texto `$color`)_

---

### 11. Resumen de Post-Sesión (`app/(workouts)/summary.tsx`)

**Fondo de pantalla:** `Screen` → `$background`

#### Trophy Section

- **Animación:** `FadeInDown.delay(200).duration(800)`
- **Círculo trofeo:** 120×120 · `borderRadius $circle` · bg `$goldSubtle`; icono `Trophy` 60px `$gold`
- **Título:** `titleLg` (30px/700) `marginTop $lg`
- **Subtítulo:** `bodyMd` color `$textSecondary` `marginTop $sm`

#### Métricas (2 tarjetas)

- **Animación:** `FadeInUp.delay(400/600)`
- **Cada CardBase:** `flex 1` · `padding $md` · `alignItems center`
  - Icono 20px `$primary`
  - Valor: `titleMd` (24px/700) `marginTop $sm`
  - Etiqueta: `label` `$textTertiary` (DURACIÓN / VOLUMEN TOTAL)

#### Resumen por ejercicio

- **Título sección:** `titleSm` `marginBottom $md`; animación `FadeIn.delay(800)`
- **Superset visual:** Ejercicios con mismo `supersetGroup` se agrupan con barra vertical izquierda (`View width=3 bg=$primary`) y etiqueta `SUPERSET` (`label` color `$primary` + icono `Link2` 12px) sobre el primer ejercicio del grupo.
- **CardBase por ejercicio:** `padding $md`; animación `FadeInDown.delay(900+i*100).springify()`
  - Nombre: `titleSm` `flex 1`
  - **Badge PR:** XStack bg `$goldSubtle` · `paddingHorizontal $sm` · `paddingVertical $xs` · `borderRadius $md`; icono `Star` 12px `$gold` + texto `label` `$gold` `fontWeight 700`
  - Cabecera tabla: `label` `$textTertiary` con borde bottom 1px `$borderColor` (SET flex1 · REPS flex2 · PESO flex2 · VOL flex2)
  - Filas: `paddingVertical $xs`; nº set `bodySm` `$textSecondary` `fontWeight 700` · reps/peso `bodySm` · volumen `bodySm` `$textSecondary`

#### Footer

- **AppButton outline** "Compartir Progreso" (icono `Share2` 20px `$color`) + **AppButton primary** "Listo" (→ `router.replace('/(tabs)')`)
- **Contenedor:** `gap $md` · `marginVertical $3xl`

---

## Modales de Confort Global

- **Modal Alert (Alerts):** Nativo del sistema para casos destructivos (Salir sin guardar, Borrar Routine, Borrar Set).

- **Toasts (React-Native-Toast-Message):** Duración 3s · posición top.
  - `type: 'success'`: borde/icono verde — al romper PR o guardar con éxito.
  - `type: 'error'`: borde/icono rojo — en fallas de persistencia.

---

## Catálogo de Animaciones

Referencia exhaustiva de todas las animaciones implementadas. Motor: **React Native Reanimated 3** (no se usan animaciones legacy de RN).

---

### Configuraciones Spring Recurrentes

Todas las configs spring se leen desde `motion.spring.*` en `@/constants/motion`.

| Token motion           | `damping` | `stiffness` | `mass`  | Uso                               |
| ---------------------- | --------- | ----------- | ------- | --------------------------------- |
| `motion.spring.snappy` | 14        | 240         | 0.9     | Drag-to-reorder, escala cards     |
| `motion.spring.bounce` | 12        | 200         | 0.8     | Barra de progreso del workout     |
| `motion.spring.heavy`  | 18        | 180         | 1.1     | Entrada de la card del rest timer |
| `motion.spring.subtle` | 20        | 120         | 1.0     | Apertura/cierre del selector RIR  |
| `motion.spring.sheet`  | 20        | 160         | 1.2     | Bottom sheets                     |
| Spring Default         | default   | default     | default | `.springify()` sin parámetros     |

### Easing Functions

| Token motion                  | Implementación              | Uso                                      |
| ----------------------------- | --------------------------- | ---------------------------------------- |
| `motion.easing.symmetric`     | `Easing.inOut(Easing.ease)` | Skeleton loader (pulso suave, simétrico) |
| `motion.easing.standard`      | `Easing.bezier(0.2,0,0,1)`  | Transiciones informativas generales      |
| `motion.easing.decelerate`    | `Easing.out(Easing.ease)`   | Entradas de elementos                    |
| `motion.easing.accelerate`    | `Easing.in(Easing.ease)`    | Salidas de elementos                     |
| Linear (default `withTiming`) | —                           | Resto de animaciones `withTiming`        |

### Animaciones por Pantalla

#### Dashboard (`index.tsx`)

| Elemento                       | Tipo    | Animación              | Duración | Delay | Easing / Config |
| ------------------------------ | ------- | ---------------------- | -------- | ----- | --------------- |
| Botón "Entrenamiento en curso" | Entrada | `FadeInUp.springify()` | Spring   | 0     | Spring default  |

> **Planeado (ver Next-Plan.md D.3):** ContentReveal skeleton→crossfade, stagger de bloques (0/80/160/240/320ms), PressableCard en stats y routine cards.

#### Rutinas (`routines.tsx`)

| Elemento                  | Tipo      | Animación                                         | Duración | Delay                       | Easing / Config          |
| ------------------------- | --------- | ------------------------------------------------- | -------- | --------------------------- | ------------------------ |
| Tarjeta de rutina (lista) | Entrada   | `FadeInDown.delay(i*100).springify()`             | Spring   | 100ms × índice (máx 1300ms) | Spring default           |
| Skeleton → contenido      | Crossfade | `ContentReveal` opacity content 0→1, skeleton 1→0 | 220ms    | skeleton: 50ms delay        | `motion.easing.standard` |

#### Historial (`history.tsx`)

| Elemento                   | Tipo              | Animación                                                                    | Duración | Delay                | Easing / Config                   |
| -------------------------- | ----------------- | ---------------------------------------------------------------------------- | -------- | -------------------- | --------------------------------- |
| Barra de búsqueda (abrir)  | Expandir          | `withTiming(1, { duration: motion.duration.normal })`                        | 220ms    | 0                    | Linear (`motion.duration.normal`) |
| Barra de búsqueda (cerrar) | Colapsar          | `withTiming(0, { duration: motion.duration.fast })`                          | 150ms    | 0                    | Linear (`motion.duration.fast`)   |
| Búsqueda — altura          | Interpolación     | `interpolate([0,1], [0, 56])`                                                | —        | —                    | Sigue `searchAnim`                |
| Búsqueda — opacidad        | Interpolación     | `interpolate([0,1], [0, 1])`                                                 | —        | —                    | Sigue `searchAnim`                |
| Tarjeta de entrenamiento   | Entrada           | `FadeInDown.delay(i*50).springify()`                                         | Spring   | 50ms × índice        | Spring default                    |
| Swipe delete — fondo       | Color interpolado | `interpolateColor(dragX, [-80,-48,0], [danger, dangerSubtle, dangerSubtle])` | —        | —                    | Sigue gesto                       |
| Skeleton → contenido       | Crossfade         | `ContentReveal` opacity content 0→1, skeleton 1→0                            | 220ms    | skeleton: 50ms delay | `motion.easing.standard`          |

#### Estadísticas (`stats.tsx`)

| Elemento             | Tipo      | Animación                               | Duración | Delay                | Easing / Config          |
| -------------------- | --------- | --------------------------------------- | -------- | -------------------- | ------------------------ |
| Skeleton → contenido | Crossfade | `ContentReveal` con `StatsPageSkeleton` | 220ms    | skeleton: 50ms delay | `motion.easing.standard` |

Los gráficos (`StatsLineChart`, `WeeklyVolumeBarChart`) usan animaciones internas de la librería de charting.

#### Ajustes (`settings.tsx`)

Sin animaciones propias.

---

#### Entrenamiento Activo (`[active].tsx`)

| Elemento                          | Tipo            | Animación                                      | Duración | Delay | Easing / Config                           |
| --------------------------------- | --------------- | ---------------------------------------------- | -------- | ----- | ----------------------------------------- |
| Transición ejercicio (→ adelante) | Entrada         | `FadeInRight.duration(motion.duration.normal)` | 220ms    | 0     | `motion.duration.normal`                  |
| Transición ejercicio (→ adelante) | Salida          | `FadeOutLeft.duration(motion.duration.fast)`   | 150ms    | 0     | `motion.duration.fast`                    |
| Transición ejercicio (← atrás)    | Entrada         | `FadeInLeft.duration(motion.duration.normal)`  | 220ms    | 0     | `motion.duration.normal`                  |
| Transición ejercicio (← atrás)    | Salida          | `FadeOutRight.duration(motion.duration.fast)`  | 150ms    | 0     | `motion.duration.fast`                    |
| Divider superset                  | Entrada         | `FadeInDown.duration(250)`                     | 250ms    | 0     | Linear                                    |
| Divider superset                  | Salida          | `FadeOutUp.duration(200)`                      | 200ms    | 0     | Linear                                    |
| Barra de progreso global (header) | Cambio de ancho | `withSpring(value, motion.spring.bounce)`      | Spring   | 0     | `motion.spring.bounce` (d:12 s:200 m:0.8) |

#### Fila de Set (`set-row.tsx`)

| Elemento                        | Tipo              | Animación                                                                                       | Duración | Config                                    |
| ------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------- | -------- | ----------------------------------------- |
| Indicador de completado         | Toggle opacidad   | `withTiming(isCompleted ? 1 : 0, { duration: motion.duration.normal })`                         | 220ms    | `motion.duration.normal`                  |
| Checkbox — color de fondo       | Color interpolado | `interpolateColor(completionAnim, [0,1], [surfaceSecondary, successSubtle])`                    | —        | Sigue `completionAnim`                    |
| Botón check (press)             | Secuencia escala  | `withSequence(withSpring(motion.scale.press), withSpring(1))`                                   | Spring   | scale: 0.96 (`motion.scale.press`)        |
| Swipe delete — translateX       | Gesto → timing    | `withTiming(-SCREEN_WIDTH, { duration: motion.duration.normal })`                               | 220ms    | `motion.duration.normal`                  |
| Swipe delete — cancelar         | Gesto → spring    | `withSpring(0)`                                                                                 | Spring   | Spring default (retorno)                  |
| Swipe delete — fondo color      | Color interpolado | `interpolateColor(translateX, [-threshold, -btn*0.3, 0], [danger, dangerSubtle, dangerSubtle])` | —        | Sigue gesto                               |
| Swipe delete — opacidad botón   | Interpolación     | `interpolate(translateX, [-btnWidth, 0], [1, 0])`                                               | —        | Sigue gesto                               |
| Swipe delete — ícono rest       | Interpolación     | `interpolate(translateX, [-threshold, -btn*0.3], [0, 1])`                                       | —        | Sigue gesto                               |
| Swipe delete — ícono activo     | Interpolación     | `interpolate(translateX, [-threshold, -btn*0.3], [1, 0])`                                       | —        | Sigue gesto                               |
| RIR selector (abrir/cerrar)     | Toggle spring     | `withSpring(show ? 1 : 0, { ...motion.spring.subtle })`                                         | Spring   | `motion.spring.subtle` (d:20 s:120 m:1.0) |
| RIR grupo — opacidad            | Interpolación     | `interpolate(rirAnim, [0.2, 1], [0, 1])`                                                        | —        | Sigue `rirAnim`                           |
| RIR grupo — translateX          | Interpolación     | `interpolate(rirAnim, [0, 1], [15, 0])`                                                         | —        | 15px → 0px                                |
| Input grupo — opacidad (sale)   | Interpolación     | `interpolate(rirAnim, [0, 0.8], [1, 0])`                                                        | —        | Sigue `rirAnim`                           |
| Input grupo — translateX (sale) | Interpolación     | `interpolate(rirAnim, [0, 1], [0, -15])`                                                        | —        | 0px → -15px                               |

#### Fila de Ejercicio en Editor (`routine-exercise-row.tsx`)

| Elemento                   | Tipo           | Animación                                                     | Duración | Config                                               |
| -------------------------- | -------------- | ------------------------------------------------------------- | -------- | ---------------------------------------------------- |
| Escala al arrastrar (drag) | Scale up       | `withSpring(motion.scale.micro, { ...motion.spring.snappy })` | Spring   | `motion.scale.micro` (1.03) · `motion.spring.snappy` |
| Escala al soltar           | Scale down     | `withSpring(1, { ...motion.spring.snappy })`                  | Spring   | `motion.spring.snappy` (d:14 s:240 m:0.9)            |
| Elevación al arrastrar     | Elevación up   | `withTiming(10, { duration: motion.duration.normal })`        | 220ms    | `motion.duration.normal`                             |
| Elevación al soltar        | Elevación down | `withTiming(0, { duration: motion.duration.normal })`         | 220ms    | `motion.duration.normal`                             |

---

#### Rest Timer (`rest-timer.tsx`)

| Elemento                   | Tipo     | Animación                                                                                             | Duración | Delay | Config                             |
| -------------------------- | -------- | ----------------------------------------------------------------------------------------------------- | -------- | ----- | ---------------------------------- |
| Backdrop overlay           | Entrada  | `FadeIn.duration(motion.duration.normal)`                                                             | 220ms    | 0     | `motion.duration.normal`           |
| Backdrop overlay           | Salida   | `FadeOut.duration(motion.duration.fast)`                                                              | 150ms    | 0     | `motion.duration.fast`             |
| Card flotante              | Entrada  | `SlideInUp.springify().damping(motion.spring.heavy.damping).stiffness(motion.spring.heavy.stiffness)` | Spring   | 0     | `motion.spring.heavy` (d:18 s:180) |
| Card flotante              | Salida   | `FadeOut.duration(motion.duration.fast)`                                                              | 150ms    | 0     | `motion.duration.fast`             |
| Barra de progreso (scaleX) | Progreso | Reanimated `scaleX` interpolado 0→1                                                                   | —        | —     | Sigue `progress` value             |

#### Hook Rest Timer Animation (`useRestTimerAnimation.ts`)

| Elemento                    | Tipo                | Animación                                                              | Duración      | Delay  | Config                   |
| --------------------------- | ------------------- | ---------------------------------------------------------------------- | ------------- | ------ | ------------------------ |
| Barra progreso (inicio)     | Fade in             | `withTiming(1, { duration: motion.duration.normal })`                  | 220ms         | 0      | `motion.duration.normal` |
| Hourglass rotación fase 1   | Rotación 0°→180°    | `withTiming(180, { duration: motion.duration.hero })`                  | 520ms         | 0      | `motion.duration.hero`   |
| Hourglass pausa             | Delay               | `withDelay(1500, ...)`                                                 | —             | 1500ms | —                        |
| Hourglass rotación fase 2   | Rotación 180°→360°  | `withTiming(360, { duration: motion.duration.hero })`                  | 520ms         | 1500ms | `motion.duration.hero`   |
| Hourglass reset instantáneo | Reset               | `withTiming(0, { duration: 0 })`                                       | 0ms           | 0      | Instantáneo              |
| Loop completo hourglass     | Repetición infinita | `withRepeat(withSequence(...), -1, false)`                             | ~2560ms/ciclo | —      | Sin reverse              |
| Barra progreso (colapso)    | Fade out            | `withTiming(0, { duration: motion.duration.slow })`                    | 320ms         | 0      | `motion.duration.slow`   |
| Barra progreso (sync)       | Actualización       | `withTiming(remaining/duration, { duration: motion.duration.normal })` | 220ms         | 0      | `motion.duration.normal` |

---

#### Mini Player (`mini-player.tsx`)

| Elemento   | Tipo    | Animación                                    | Duración | Config                 |
| ---------- | ------- | -------------------------------------------- | -------- | ---------------------- |
| Contenedor | Entrada | `FadeInDown.duration(motion.duration.slow)`  | 320ms    | `motion.duration.slow` |
| Contenedor | Salida  | `FadeOutDown.duration(motion.duration.slow)` | 320ms    | `motion.duration.slow` |

#### Collapsible (`collapsible.tsx`)

| Elemento         | Tipo             | Animación                                                          | Duración | Config                              |
| ---------------- | ---------------- | ------------------------------------------------------------------ | -------- | ----------------------------------- |
| Chevron rotación | Rotación         | `withTiming('90deg'/'0deg', { duration: motion.duration.normal })` | 220ms    | `motion.duration.normal`            |
| Contenido        | Entrada          | `FadeIn.duration(motion.duration.normal)`                          | 220ms    | `motion.duration.normal`            |
| Contenido        | Salida           | `FadeOut.duration(motion.duration.normal)`                         | 220ms    | `motion.duration.normal`            |
| Cambio de altura | Layout animation | `Layout.springify().damping(motion.spring.snappy.damping)`         | Spring   | `motion.spring.snappy.damping` (14) |

#### Skeleton Loader (`skeleton-loader.tsx`)

| Elemento | Tipo          | Animación                                               | Duración total | Config                                                           |
| -------- | ------------- | ------------------------------------------------------- | -------------- | ---------------------------------------------------------------- |
| Pulso    | Loop infinito | `withRepeat(withSequence(opacity 0.5→1→0.5), -1, true)` | 1600ms/ciclo   | `motion.easing.symmetric` (`Easing.inOut(Easing.ease)`), reverse |

#### ContentReveal (`ContentReveal.tsx`)

| Elemento          | Tipo         | Animación                                            | Duración | Delay | Config                   |
| ----------------- | ------------ | ---------------------------------------------------- | -------- | ----- | ------------------------ |
| Content fade-in   | Opacity 0→1  | `withTiming(1, { duration: 220, easing: standard })` | 220ms    | 0     | `motion.easing.standard` |
| Skeleton fade-out | Opacity 1→0  | `withDelay(50, withTiming(0, { duration: 220 }))`    | 220ms    | 50ms  | `motion.easing.standard` |
| Skeleton unmount  | Callback     | `runOnJS(setShowSkeleton)(false)` on finish          | —        | —     | Desmonta tras fade-out   |
| Reduced motion    | Instant swap | Sin animación, swap directo                          | 0ms      | 0     | —                        |

---

#### Resumen Post-Sesión (`summary.tsx`)

| Elemento                       | Tipo    | Animación                                         | Duración       | Delay                               | Config         |
| ------------------------------ | ------- | ------------------------------------------------- | -------------- | ----------------------------------- | -------------- |
| Contenedor trofeo              | Entrada | `FadeInDown.delay(200).duration(800)`             | 800ms          | 200ms                               | Linear         |
| Ícono trofeo + anillo          | Entrada | `FadeInDown.delay(300).duration(600).springify()` | 600ms + spring | 300ms                               | Spring default |
| Tarjeta duración               | Entrada | `FadeInUp.delay(400)`                             | default        | 400ms                               | Linear         |
| Tarjeta volumen                | Entrada | `FadeInUp.delay(600)`                             | default        | 600ms                               | Linear         |
| Sección comparación            | Entrada | `FadeIn.delay(700)`                               | default        | 700ms                               | Linear         |
| Título "Resumen por ejercicio" | Entrada | `FadeIn.delay(800)`                               | default        | 800ms                               | Linear         |
| Tarjeta ejercicio (lista)      | Entrada | `FadeInDown.delay(900+i*100).springify()`         | Spring         | 900ms + 100ms × índice (máx 1300ms) | Spring default |

---

### Resumen de Duraciones Estándar

Todas las duraciones se leen desde `motion.duration.*` en `@/constants/motion`.

| Propósito                         | Token                    | ms                                                  | Patrón                                  |
| --------------------------------- | ------------------------ | --------------------------------------------------- | --------------------------------------- |
| Toggle rápido (opacidad, color)   | `motion.duration.normal` | **220ms**                                           | `withTiming` linear                     |
| Cierre / dismiss                  | `motion.duration.fast`   | **150ms**                                           | `withTiming` linear                     |
| Transición de ejercicio (entrada) | `motion.duration.normal` | **220ms**                                           | `FadeInRight/Left`                      |
| Transición de ejercicio (salida)  | `motion.duration.fast`   | **150ms**                                           | `FadeOutLeft/Right`                     |
| Mini player (entrada/salida)      | `motion.duration.slow`   | **320ms**                                           | `FadeInDown/FadeOutDown`                |
| Hourglass rotación (por fase)     | `motion.duration.hero`   | **520ms**                                           | `withTiming` linear                     |
| Hourglass (ciclo completo)        | —                        | **~2560ms**                                         | 520ms giro + 1500ms pausa + 520ms giro  |
| Skeleton pulse (ciclo completo)   | —                        | **1600ms**                                          | `motion.easing.symmetric`, reverse      |
| Rebote interactivo (press)        | `motion.scale.press`     | Spring                                              | `withSequence(spring(0.96), spring(1))` |
| Cascada de lista                  | —                        | 50–100ms × índice                                   | Máximo 1300ms de delay                  |
| Summary — secuencia narrativa     | —                        | 200–900ms delays                                    | Escalonado cada 200ms                   |
| Skeleton→Content crossfade        | `ContentReveal`          | **220ms** content + **220ms** skeleton (50ms delay) | `motion.easing.standard`                |

---

### Animaciones Planeadas (ver `Next-Plan.md`)

| Feature                                  | Componente                   | Estado       |
| ---------------------------------------- | ---------------------------- | ------------ |
| AppButton press scale (0.96)             | `AppButton.tsx`              | Planeado D.2 |
| PressableCard (scale + elevation morph)  | `PressableCard.tsx` (nuevo)  | Planeado D.1 |
| Dashboard stagger + ContentReveal        | `index.tsx`                  | Planeado D.3 |
| AnimatedNumber (count-up)                | `AnimatedNumber.tsx` (nuevo) | Planeado D.4 |
| Set completion celebration (pop + flash) | `set-row.tsx`                | Planeado D.5 |
| Empty state ambient motion               | `EmptyStateIcon.tsx` (nuevo) | Planeado D.6 |
| Progress bar color flash                 | `WorkoutHeader.tsx`          | Planeado D.7 |

---

## Changelog — PLAN-G: Motion Tokens (Abril 2026)

- **`@/constants/motion`** (nuevo): fuente única de verdad para duraciones (`instant/fast/normal/slow/hero`), springs (`snappy/heavy/sheet/bounce/subtle`), escalas (`press/micro/pop`) y easings (`standard/decelerate/accelerate/symmetric`).
- **`@/constants/elevation`** (nuevo): tokens de sombra en 4 niveles (`flat/card/floating/modal`). `CardBase` usa `elevation.card` (spread) en lugar de props inline.
- Todas las duraciones mágicas migradas: `200ms` → `motion.duration.normal` (220ms), `150ms` → `motion.duration.fast`, `300ms` → `motion.duration.slow` (320ms), `600ms` → `motion.duration.hero` (520ms), `250ms` → `motion.duration.normal`.
- Todos los springs hardcoded migrados a preset: `{damping:15,stiffness:120,mass:0.8}` → `motion.spring.bounce`, `{damping:18,stiffness:200}` → `motion.spring.heavy`, `{damping:20}` → `motion.spring.subtle`, `{damping:15}` → `motion.spring.snappy`.
- `withSpring(0.9)` → `withSpring(motion.scale.press)` (0.96) en `set-row.tsx`.
- `Easing.inOut(Easing.ease)` → `motion.easing.symmetric` en `skeleton-loader.tsx`.
- Archivos modificados: `useRestTimerAnimation.ts`, `mini-player.tsx`, `card.tsx`, `set-row.tsx`, `collapsible.tsx`, `skeleton-loader.tsx`, `WorkoutHeader.tsx`, `history.tsx`, `rest-timer.tsx`, `[active].tsx`, `routine-exercise-row.tsx`.

---

## Changelog UX — Temper v2 (Marzo 2026)

Resumen de todos los cambios de UX/diseño aplicados en el refactor completo.

### Sistema de diseño

- **Paleta**: Azul (#3B99F7) reemplazado por **Cobre** (#D4621A light / #E8762E dark). Fondos warm-coal en reemplazo de neutrales fríos. PRs/récords usan **Brasa/Ember** (#E8B84B). Descanso usa **Acero/Steel** (#4F80B8).
- **Alturas**: `buttonHeight` 56→52 · `setRowHeight` 56→48. Más densidad de contenido.
- **Nuevos tokens**: `$gold`, `$goldSubtle`, `$info`, `$infoSubtle`.

### Componentes base

- **`set-row.tsx`**: Flechas ChevronUp/Down con `withTiming` opacity en foco. Swipe delete con animación `dangerSubtle→danger` (umbral 20%). Incremento de peso desde `useSettings.weightIncrement`.
- **`routine-exercise-row.tsx`**: Colapsable por defecto (52px). Expand/collapse con ChevronDown/Up.
- **`WorkoutHeader.tsx`**: Botón `PenLine` (nota de sesión), activo cobre si hay nota. Botón "Finalizar" con fondo condicional `$primarySubtle`/`$surfaceSecondary`.
- **`mini-player.tsx`**: Countdown del rest timer en `$success`. Botón "Retomar" ghost sm.

### Pantallas tab

- **`index.tsx`**: Sin botón Dumbbell en header. FlatList vertical de rutinas con zona-play: `[YStack flex1 info][YStack w=64 borderLeft Play copper]`.
- **`routines.tsx`**: Chips de filtro horizontales (`Todos · Recientes · Push · Pull · Piernas · Full Body`). Zona-play idéntica a index.
- **`history.tsx`**: SectionList agrupado por semana. Búsqueda colapsable animada (RNAnimated height 0→56). Swipe delete con reveal rojo. Label "Mayor volumen" al pie de cada tarjeta.
- **`stats.tsx`**: Grid 2×2 con `flex={1}` (sin width fijo). Share2 + Plus en header de tarjeta peso corporal. Sección "Fuerza" con selector de ejercicio (BottomSheet) y gráfico de 1RM estimado (Epley).
- **`settings.tsx`**: Plate chips con `fontWeight="700"` constante. Dark mode como 3 chips (Sistema/Claro/Oscuro). "Próximamente" items con `opacity=0.4 pointerEvents=none`. Logout debajo de versión con `opacity=0.6`.

### Pantalla de entrenamiento activo (`[active].tsx`)

- **Nota de sesión**: Botón `PenLine` en barra inferior (cobre si hay nota), abre BottomSheet con `BottomSheetTextInput` multiline. Estado `sessionNote` en `useActiveWorkout`.
- **Chip de descanso**: Barra de progreso animada 112px (`RNAnimated.Value`) con botones ±15s. Badge circular 18×18 `$success` con segundos restantes.
- **Sugerencia de peso**: Línea compacta "Anterior: X · Sugerido: Y" en lugar de 2 tarjetas.
- **"Añadir ejercicio"**: Opción en Options BottomSheet que abre el exercise browser.
- **`allSetsCompleted`**: Computed bool; cambia texto botón Finalizar entre "Finalizar"/"Cerrar".

### Temporizador de descanso (`rest-timer.tsx`)

- **Preset chips**: `[30s][60s][90s][2m][3m]`. Chip activo: `$primarySubtle/$primary fontWeight700`. Tap: `stopTimer()` + `startTimer(preset.value)`.
- **±15s**: Cambiado de ±10s a ±15s.

### Creación/edición de rutinas (`create.tsx`, `[id].tsx`)

- **Botón Guardar**: Reemplaza IconButton(Save) por `AppButton primary size="sm" label="Guardar" fullWidth=false`.
- **Header `[id].tsx`**: Eliminado botón Share2 del header (función `handleShare` removida).
- **Agregar ejercicio**: Pressable inline → `AppButton outline size="md" label="Agregar ejercicio" width=100%` al final de la lista.
- **`create.tsx`**: Label estimado `~N min · M ejercicios` debajo del nombre (visible cuando hay ≥1 ejercicio).

### Resumen post-entrenamiento (`summary.tsx`)

- **Header**: Icono `Share2` en esquina superior derecha (reemplaza footer "Compartir Progreso").
- **Trophy ring**: Outer ring `Animated.View 140×140 borderRadius=70 borderWidth=2 borderColor=$gold` con `FadeInDown.springify().delay(300)`.
- **Comparación**: Si existe sesión anterior, muestra `TrendingUp/Down + "vs sesión anterior: +X kg · +Y min"` entre los stats y el resumen de ejercicios.
- **PR badges**: Valor del récord `+{value} kg` debajo del badge PR.
- **Footer**: "Listo" (primary) + "Repetir este entrenamiento →" (ghost). Sin "Compartir Progreso".
