# Diccionario de Vistas y Navegación Maestro - GymApp

Este documento detalla exhaustivamente cada pantalla, su propósito, todos los botones interactivos, su comportamiento, a qué vista redirigen y todas las especificaciones visuales (color, tipografía, tamaño, fondo, borde, etc.).

---

## Sistema de Design Tokens (Referencia Rápida)

### Tipografía — `AppText` variantes
| Variante   | fontSize token | px  | fontWeight | Notas                          |
|------------|---------------|-----|------------|-------------------------------|
| `titleLg`  | `$7`          | 34  | `$7` (700) | letterSpacing -0.5            |
| `titleMd`  | `$6`          | 26  | `$7` (700) | letterSpacing -0.5            |
| `titleSm`  | `$5`          | 24  | `$7` (700) |                               |
| `subtitle` | `$4`          | 22  | `$7` (700) |                               |
| `bodyLg`   | `$4`          | 22  | `$5` (500) |                               |
| `bodyMd`   | `$3`          | 20  | `$4` (400) |                               |
| `bodySm`   | `$2`          | 18  | `$4` (400) |                               |
| `label`    | `$1`          | 16  | `$7` (700) | letterSpacing 0.5, UPPERCASE  |

### Colores del Tema (light / dark) — Iron Log v2
| Token               | Light                               | Dark                              |
|---------------------|-------------------------------------|-----------------------------------|
| `$background`       | `#F5F2EC` (coal50)                  | `#0D0C0A` (coal950)               |
| `$surface`          | `#FFFFFF`                           | `#161410` (coal900)               |
| `$surfaceSecondary` | `#EAE6DF` (coal100)                 | `#1E1B16` (coal850)               |
| `$color` (texto)    | `#161410` (coal900)                 | `#F5F2EC` (coal50)                |
| `$textSecondary`    | `#4A4337`                           | `#B0A899` (coal300)               |
| `$textTertiary`     | `#8C8374` (coal400)                 | `#6B6352` (coal500)               |
| `$primary`          | `#D4621A` (copper400)               | `#E8762E` (copper350)             |
| `$primarySubtle`    | `rgba(212,98,26,0.08)`              | `rgba(232,118,46,0.12)`           |
| `$gold`             | `#9A7A1A` (emberText — texto)       | `#E8B84B` (ember400)              |
| `$goldSubtle`       | `rgba(232,184,75,0.15)`             | `rgba(232,184,75,0.15)`           |
| `$info`             | `#3A6494` (steel500)                | `#4F80B8` (steel400)              |
| `$infoSubtle`       | `rgba(58,100,148,0.08)`             | `rgba(79,128,184,0.12)`           |
| `$success`          | `#2A9E65`                           | `#3DB87A`                         |
| `$successSubtle`    | `rgba(42,158,101,0.10)`             | `rgba(61,184,122,0.12)`           |
| `$danger`           | `#C04040`                           | `#E05252`                         |
| `$dangerSubtle`     | `rgba(192,64,64,0.10)`              | `rgba(224,82,82,0.12)`            |
| `$warning`          | `#A06020`                           | `#D4882A`                         |
| `$borderColor`      | `rgba(0,0,0,0.08)`                  | `rgba(255,255,255,0.07)`          |

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
- `shadowColor`: `$overlay` · `shadowOpacity`: 0.05 · `shadowRadius`: 8 · `shadowOffset`: {0, 2}

### `AppButton` variantes
| Variante  | bg              | color texto   | height | borderRadius |
|-----------|-----------------|---------------|--------|--------------|
| `primary` | `$primary`      | `color`       | 56     | 16           |
| `outline` | `transparent`   | `primary`     | 56     | 16 · borde 1px `$borderColor` |
| `ghost`   | `$surfaceSecondary` | `color`   | 56     | 16           |
| `danger`  | `$danger`       | `color`       | 56     | 16           |

### `Badge` variantes
| Variante  | bg               | color texto    | padding     |
|-----------|------------------|----------------|-------------|
| `primary` | `$primarySubtle` | `$primary`     | 8h · 2v (sm) / 12h · 4v (md) |
| `success` | `$successSubtle` | `$success`     | igual       |
| `warning` | `$warningSubtle` | `$warning`     | igual       |
| `danger`  | `$dangerSubtle`  | `$danger`      | igual       |
| `ghost`   | `$surfaceSecondary` | `$textSecondary` | igual    |

---

## Pestañas Principales (Tab Bar)

- **Ruta Base:** `app/(tabs)/`
- **Fondo del Tab Bar:** `$tabBar` (light: `rgba(255,255,255,0.8)` / dark: `rgba(26,26,36,0.9)`) con blur
- **"Mini-Player" Flotante:** Posición `absolute`, `bottom` = SafeAreaInsets.bottom + 60, `left`/`right` 12px. Fondo `$surfaceSecondary`, borde 1px `$borderColor`, `borderRadius $xl` (16), `height` 56, `shadowOpacity` 0.15, `shadowRadius` 12. Icono `Activity` 20px `$primary` sobre fondo `$primarySubtle` 40×40 `$md` radius. Texto rutina: `bodySm` `$textSecondary`. Texto ejercicio: `subtitle` `$color`.

---

### 1. Inicio / Dashboard (`app/(tabs)/index.tsx`)

**Fondo de pantalla:** `$background` (SafeAreaView)

#### Header
- **Contenedor:** `paddingHorizontal $xl` (20) · `paddingTop $xl` (20) · `paddingBottom $lg` (16)
- **Botón Perfil (Pressable):** Redirige a `/settings/profile`
  - Texto "Bienvenido": `bodyLg` (22px/500) · color `$textSecondary`
  - Texto nombre: `titleLg` (34px/700/ls-0.5) · color `$color`
- **Icono Dumbbell (IconButton):** `Dumbbell` 24px `$primary` · fondo `$surfaceSecondary` · 40×40 · `borderRadius` 20

#### CTA Principal
- **Contenedor:** `paddingHorizontal $xl` · `paddingBottom $xl`
- **Tarjeta "Entrenamiento en curso" (Condicional):** `backgroundColor $primary` · `height` 80 · `borderRadius $lg` (12) · `paddingHorizontal $lg` (16) · animación `FadeInUp.springify()`
  - Icono `Activity` 20px color `surface`
  - Texto "ENTRENAMIENTO EN CURSO": `bodySm` (18px/400) · color `surface` · `opacity` 0.8 · `fontWeight 700`
  - Texto rutina: `titleSm` (24px/700) · color `surface` · `marginTop $xs` (4)
- **Botón "Nueva Sesión" (Si no hay activo):** `AppButton primary` · 56px alto · `borderRadius` 16 · bg `$primary` · icono `Play` 24px color `surface`

#### Stats Row
- **Contenedor:** `paddingHorizontal $xl` · `gap $md` (12)
- **Tarjeta cadena de racha:**
  - `CardBase`: fondo `$surface` · `borderRadius $lg` · padding `$md` (12) · `flex 1`
  - Icono `Flame` 16px `$primary` · texto "RACHA": `label` (16px/700/uppercase) `$textSecondary`
  - Valor: `titleMd` (26px/700) · texto "días": `bodySm` (18px/400) · color `$textTertiary`
- **Tarjeta semana:** idéntica · icono `Activity`

#### Último Entrenamiento
- **Sección:** `marginBottom $xl` · `paddingHorizontal $xl` · `marginTop $xl`
- **Título:** `titleSm` (24px/700) · enlace "Ver todo" `bodyMd` (20px/400) · color `$primary` · `fontWeight $6`(600)
- **CardBase:** padding `$none`
  - Header de la card: `padding $md` · borde bottom 1px `$borderColor`
    - Título "Sesión de Entrenamiento": `fontSize $4` (22px) · `fontWeight $7` (700)
    - Fecha relativa: `fontSize $2` (18px) · color `$textTertiary` · `marginTop $xs`
    - `Badge success`: bg `$successSubtle` · texto "ENTRENADO" · color `$success`
  - Body: `padding $md`
    - Icono `Clock` 16px `$textSecondary` · duración: `bodySm` `$textSecondary`
    - Icono `Dumbbell` 16px `$textSecondary` · ejercicios: `bodySm` `$textSecondary`

#### Carrusel de Rutinas
- **Sección:** `marginTop $xl`
- **Título:** `titleSm` · enlace "Ver todas" `bodyMd` `$primary` `fontWeight $6`
- **Estado vacío:** padding `$xl` · `borderRadius $lg` · borde 1px `$borderColor` · fondo `$surfaceSecondary` · mensaje `bodyMd` `$textSecondary`; botón `AppButton primary` "Crear primera rutina"
- **Tarjeta de rutina (CardBase):** `width` 280 · padding `$md` · `snapToInterval` 292 · `gap` 12 · `paddingHorizontal` 20
  - Nombre rutina: `titleSm` (24px/700) `fontWeight $7` `flex 1` `numberOfLines 1`
  - Botón ⋯ (IconButton): icono `MoreHorizontal` 25px `$darkText` · 44×44 · fondo `transparent`
  - Ejercicios: `bodySm` (18px/400) color `$textSecondary` · `marginBottom $md` · `numberOfLines 2`
  - Contador: `label` (16px/700/uppercase) color `$textTertiary`
  - Botón Play (IconButton): icono `Play` 22px `$primary` `strokeWidth 3` · 44×44 · fondo `transparent`

---

### 2. Biblioteca de Rutinas (`app/(tabs)/routines.tsx`)

**Fondo de pantalla:** `Screen` → `$background`

#### Header
- **Contenedor:** `paddingHorizontal $lg` (16) · `paddingTop $lg` · `paddingBottom $md` (12)
- **Título:** `titleLg` (34px/700/ls-0.5) · color `$color`
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
  - Nombre: `titleMd` (26px/700/ls-0.5)
  - Ejercicios: `bodyMd` (20px/400) color `$textSecondary` · `numberOfLines 2` — ejercicios en el mismo superset se muestran unidos con " + " (ej: "Press Banca + Aperturas"), grupos separados con ", "
  - Badges músculos: `Badge primary` automáticos si `routine.muscles` tiene datos

#### Estado Vacío
- **Contenedor:** `padding $4xl` (40) · `alignItems center` · `marginTop $xl`
- **Mensaje:** `bodyMd` color `$textSecondary`

---

### 3. Historial de Sesiones (`app/(tabs)/history.tsx`)

**Fondo de pantalla:** `Screen` → `$background`

#### Header
- **Contenedor:** `paddingHorizontal $lg` · `paddingTop $lg` · `paddingBottom $sm` (8)
- **Título:** `titleLg` (34px/700/ls-0.5)

#### Barra de Búsqueda
- **XStack:** `height` 48 · `borderRadius $lg` · borde 1px `$borderColor` · `paddingHorizontal $md` · bg `$surface`
- **Icono** `Search` 20px `$textTertiary`
- **AppInput:** `flex 1` · `borderWidth 0` · bg `transparent` · `paddingHorizontal 0`; placeholder "Buscar por fecha o ejercicio..."

#### Lista de Entrenamientos
- **Skeleton:** 4× `HistoryCardSkeleton` durante carga · `paddingHorizontal $lg` · `gap $md`
- **FlatList:** `paddingHorizontal` 16 · `paddingBottom` 100 · `ItemSeparatorComponent` `View height $md`
- **CardBase (por entrenamiento):** `gap $lg` · `padding $md` · animación `FadeInDown.delay(i*50).springify()`
  - Nombre: `bodyMd` (20px/400) `fontWeight 700`
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
  - Valor: `titleMd` (26px/700)

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
- **Texto label:** `bodyMd` (20px/400) `fontWeight 500`
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
  - Tiempo: `bodySm` (18px/400) `$textTertiary` `tabularNums` `fontWeight 600`
  - Nombre rutina: `titleSm` (24px/700) · `maxWidth` 180 · `numberOfLines 1`
  - Contador ejercicio: `label` (16px/700/uppercase) `$primary` · `marginTop` 2
- **Botón "Finalizar":** `paddingHorizontal $md` · `paddingVertical $sm` · `borderRadius $lg` · bg `$primarySubtle` · texto `bodySm` `$primary` `fontWeight 700`
- **Barra de progreso (debajo del header):** `height` 4 · bg `$borderColor`; relleno bg `$primary` · width `(currentIndex+1)/total * 100%`

#### Chip de Descanso (condicional bajo el header)
- **YStack:** `borderRadius $xl` (16) · bg `$primarySubtle` · borde 1px `$primary` · `paddingHorizontal $sm` · `paddingVertical $xs` · `alignSelf center` · `marginTop $sm`
- **Texto:** `label` (16px/700/uppercase) · color `$primary` · contenido "DESCANSO: Xs"

#### Cuerpo — Cabecera de ejercicio individual
- **Contenedor:** `paddingHorizontal $xl` · `paddingTop $lg` · `paddingBottom $sm`
- **Nombre:** `titleMd` (26px/700/ls-0.5) · `numberOfLines 2`
- **Progreso sets:** `bodySm` (18px/400) color `$textSecondary` · `marginTop $xs`
- **Botón "Saltar":** `paddingHorizontal $sm` · `paddingVertical $xs` · `borderRadius $md` · bg `$surfaceSecondary`; icono `SkipForward` 14px `$textTertiary` + texto `label` `$textTertiary`
- **Badge "OMITIDO":** `Badge danger sm`
- **Icono MoreVertical:** 20px `$textTertiary` · `padding $xs`

#### Cuerpo — Tarjetas peso anterior / sugerido
- **Layout:** `XStack gap $sm` · `paddingHorizontal $xl` · `marginBottom $lg`
- **Tarjeta "PESO ANTERIOR":** `flex 1` · bg `$surface` · `borderRadius $lg` · borde 1px `$borderColor` · `padding $md`
  - Etiqueta: `label` `$textTertiary` `marginBottom $xs`
  - Valor: `titleSm` (24px/700) `tabularNums`
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
- **Tiempo:** `titleLg` `fontSize` 72 · `fontVariant tabular-nums`
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

*(Sin cambios estructurales visuales desde la versión anterior — retoma los tokens del BottomSheet del punto 6)*

---

### 10. Detalle Anatómico (`app/exercise/[id].tsx`)

*(Pantalla de consulta, sin interacción compleja — tokens base: fondo `$background`, tarjetas `CardBase`, texto `$color`)*

---

### 11. Resumen de Post-Sesión (`app/(workouts)/summary.tsx`)

**Fondo de pantalla:** `Screen` → `$background`

#### Trophy Section
- **Animación:** `FadeInDown.delay(200).duration(800)`
- **Círculo trofeo:** 120×120 · `borderRadius $circle` · bg `$goldSubtle`; icono `Trophy` 60px `$gold`
- **Título:** `titleLg` (34px/700) `marginTop $lg`
- **Subtítulo:** `bodyMd` color `$textSecondary` `marginTop $sm`

#### Métricas (2 tarjetas)
- **Animación:** `FadeInUp.delay(400/600)`
- **Cada CardBase:** `flex 1` · `padding $md` · `alignItems center`
  - Icono 20px `$primary`
  - Valor: `titleMd` (26px/700) `marginTop $sm`
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

## Changelog UX — Iron Log v2 (Marzo 2026)

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
