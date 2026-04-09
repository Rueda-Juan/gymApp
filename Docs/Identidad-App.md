# Temper — Identidad Visual y Sistema de Diseño

---

## Nombre y Concepto

**Temper** — del temple del acero. Forjar, endurecer, resistir. La identidad visual traduce la experiencia sensorial de un garage gym: metales cálidos, superficies industriales, el brillo del esfuerzo.

---

## Filosofía de Paleta

### Carbón Forjado + Cobre + Brasa

**Dark (modo principal):** Fragua oscura. Fondo casi negro cálido, nunca azulado. El negro de una app de gym tiene calor, no frialdad clínica. Referencia visual: interior de un garage gym a las 6am.

**Light (modo secundario):** Papel industrial. Cremas cálidas, no blanco clínico. Referencia visual: cuaderno de entrenamiento manchado de tiza.

**Acento primario → COBRE** (`#E8762E` dark / `#D4621A` light)
El cobre es el metal del esfuerzo: barras usadas, plates oxidados. Warm, orgánico, memorable. No lo usa ninguna app mainstream de fitness.

**Acento secundario → BRASA** (`#E8B84B`)
Exclusivo para PRs y récords. Más cálido que un dorado genérico. Cuando aparece, significa que algo importante pasó.

**Info / Descanso → ACERO AZUL** (`#4F80B8` dark / `#3A6494` light)
Rol semántico específico: descanso y datos informativos neutros.

**Success → VERDE FORJA** (`#3DB87A` dark / `#2A9E65` light)
Ligeramente más cálido que un verde neón estándar.

---

## Tipografía

- Familia: `System` (fuente nativa de cada plataforma)
- `lineHeight` siempre ≥ `fontSize × 1.2` para evitar corte de descenders en iOS
- `letterSpacing: -0.5` en tamaños ≥ 26px para mantener cohesión visual en títulos

| Alias    | fontSize | lineHeight | Uso                            |
| -------- | -------- | ---------- | ------------------------------ |
| bodySm   | 16       | 20         | Texto secundario, labels       |
| bodyMd   | 18       | 22         | Texto principal, descripciones |
| bodyLg   | 20       | 26         | Texto destacado                |
| subtitle | 22       | 28         | Subtítulos de sección          |
| titleSm  | 24       | 30         | Títulos de tarjeta             |
| titleMd  | 26       | 36         | Títulos de pantalla            |
| titleLg  | 34       | 42         | Headlines, pantallas hero      |

Pesos: `400` (regular) · `500` (medium) · `600` (semibold) · `700` (bold)

---

## Escala de Espaciado

Aliases semánticos, sin valores numéricos arbitrarios.

| Token | Valor | Uso típico                                    |
| ----- | ----- | --------------------------------------------- |
| xs    | 4     | Micro separaciones, margenes internos mínimos |
| sm    | 8     | Gaps entre chips, padding interno compacto    |
| md    | 12    | Padding de inputs, gaps de filas              |
| lg    | 16    | Padding estándar de secciones                 |
| xl    | 20    | Márgenes horizontales de pantalla             |
| 2xl   | 24    | Separación entre bloques                      |
| 3xl   | 32    | Separación entre secciones                    |
| 4xl   | 40    | Espaciado de hero sections                    |
| 5xl   | 48    | Espaciado máximo                              |

---

## Tamaños de Componente

| Token            | Valor | Descripción                  |
| ---------------- | ----- | ---------------------------- |
| buttonHeight     | 52    | Altura de botones primarios  |
| iconButton       | 40    | Botones de solo ícono        |
| inputHeight      | 44    | Campos de texto              |
| setRowHeight     | 48    | Fila de set en entrenamiento |
| miniPlayerHeight | 56    | Mini-player flotante         |

---

## Radio de Bordes

| Token | Valor | Uso                           |
| ----- | ----- | ----------------------------- |
| sm    | 6     | Badges, chips pequeños        |
| md    | 8     | Inputs, botones secundarios   |
| lg    | 12    | Cards, modales                |
| xl    | 16    | Contenedores grandes          |
| 2xl   | 24    | Bottom sheets                 |
| full  | 9999  | Píldoras, avatares circulares |

---

## Paleta de Colores — Tokens Raw

### Carbón (reemplaza grises genéricos — temperatura ~2700K)

| Token   | Hex       | Rol                        |
| ------- | --------- | -------------------------- |
| coal950 | `#0D0C0A` | Background dark principal  |
| coal900 | `#161410` | Surface dark               |
| coal850 | `#1E1B16` | Surface secondary dark     |
| coal800 | `#28241C` | Surface tertiary dark      |
| coal750 | `#332E24` | —                          |
| coal700 | `#3E382B` | Área de bordes             |
| coal500 | `#6B6352` | Text tertiary dark         |
| coal400 | `#8C8374` | —                          |
| coal300 | `#B0A899` | Text secondary dark        |
| coal200 | `#D4CFC5` | Bordes light               |
| coal100 | `#EAE6DF` | Surface secondary light    |
| coal50  | `#F5F2EC` | Background light principal |

### Cobre (acento principal)

| Token          | Hex / Valor                | Rol                        |
| -------------- | -------------------------- | -------------------------- |
| copper600      | `#8B3D07`                  | —                          |
| copper500      | `#B5530A`                  | Primary dark (light theme) |
| copper400      | `#D4621A`                  | Primary light theme        |
| copper350      | `#E8762E`                  | Primary dark theme         |
| copper300      | `#F28C4E`                  | Primary light variant      |
| copper200      | `#F9B88A`                  | —                          |
| copper100      | `#FCDFC6`                  | —                          |
| copperSubtle   | `rgba(212, 98, 26, 0.10)`  | Fondo sutil light          |
| copperSubtleDk | `rgba(232, 118, 46, 0.12)` | Fondo sutil dark           |

### Brasa (PR / récords)

| Token       | Hex / Valor                |
| ----------- | -------------------------- |
| ember400    | `#E8B84B`                  |
| ember300    | `#F0CC7A`                  |
| ember200    | `#F8E4B0`                  |
| emberSubtle | `rgba(232, 184, 75, 0.15)` |

### Acero (info / descanso)

| Token         | Hex / Valor                |
| ------------- | -------------------------- |
| steel600      | `#2A4A6B`                  |
| steel500      | `#3A6494`                  |
| steel400      | `#4F80B8`                  |
| steel300      | `#7AA3CC`                  |
| steel200      | `#B0C8E0`                  |
| steelSubtle   | `rgba(79, 128, 184, 0.12)` |
| steelSubtleLt | `rgba(58, 100, 148, 0.08)` |

### Estados

| Rol     | Dark      | Light     | Subtle dark                | Subtle light               |
| ------- | --------- | --------- | -------------------------- | -------------------------- |
| Success | `#3DB87A` | `#2A9E65` | `rgba(61, 184, 122, 0.12)` | `rgba(42, 158, 101, 0.10)` |
| Danger  | `#E05252` | `#C04040` | `rgba(224, 82, 82, 0.12)`  | `rgba(192, 64, 64, 0.10)`  |
| Warning | `#D4882A` | `#A06020` | `rgba(212, 136, 42, 0.12)` | `rgba(160, 96, 32, 0.10)`  |

### Overlays y Tab Bar

| Token        | Valor                       |
| ------------ | --------------------------- |
| overlayDark  | `rgba(0, 0, 0, 0.70)`       |
| overlayLight | `rgba(0, 0, 0, 0.45)`       |
| tabBarDark   | `rgba(22, 20, 16, 0.92)`    |
| tabBarLight  | `rgba(255, 255, 255, 0.90)` |

---

## Temas Semánticos

### Dark — Carbón Forjado

| Token semántico  | Valor                       | Origen    |
| ---------------- | --------------------------- | --------- |
| background       | `#0D0C0A`                   | coal950   |
| surface          | `#161410`                   | coal900   |
| surfaceSecondary | `#1E1B16`                   | coal850   |
| surfaceTertiary  | `#28241C`                   | coal800   |
| color (texto)    | `#F5F2EC`                   | coal50    |
| textSecondary    | `#B0A899`                   | coal300   |
| textTertiary     | `#6B6352`                   | coal500   |
| primary          | `#E8762E`                   | copper350 |
| primaryDark      | `#D4621A`                   | copper400 |
| primaryLight     | `#F28C4E`                   | copper300 |
| primarySubtle    | `rgba(232, 118, 46, 0.12)`  | —         |
| gold             | `#E8B84B`                   | ember400  |
| goldLight        | `#F0CC7A`                   | ember300  |
| goldSubtle       | `rgba(232, 184, 75, 0.15)`  | —         |
| info             | `#4F80B8`                   | steel400  |
| infoSubtle       | `rgba(79, 128, 184, 0.12)`  | —         |
| success          | `#3DB87A`                   | —         |
| danger           | `#E05252`                   | —         |
| warning          | `#D4882A`                   | —         |
| borderColor      | `rgba(255, 255, 255, 0.07)` | —         |
| borderStrong     | `rgba(255, 255, 255, 0.12)` | —         |
| icon             | `#6B6352`                   | coal500   |
| overlay          | `rgba(0, 0, 0, 0.70)`       | —         |
| tabBar           | `rgba(22, 20, 16, 0.92)`    | —         |

### Light — Papel Industrial

| Token semántico  | Valor                       | Origen               |
| ---------------- | --------------------------- | -------------------- |
| background       | `#F5F2EC`                   | coal50               |
| surface          | `#FFFFFF`                   | —                    |
| surfaceSecondary | `#EAE6DF`                   | coal100              |
| surfaceTertiary  | `#D4CFC5`                   | coal200              |
| color (texto)    | `#161410`                   | coal900              |
| textSecondary    | `#4A4337`                   | 4.5:1 sobre blanco   |
| textTertiary     | `#8C8374`                   | coal400              |
| primary          | `#D4621A`                   | copper400            |
| primaryDark      | `#B5530A`                   | copper500            |
| primaryLight     | `#E8762E`                   | copper350            |
| primarySubtle    | `rgba(212, 98, 26, 0.08)`   | —                    |
| gold             | `#9A7A1A`                   | brasa oscuro (texto) |
| goldDisplay      | `#E8B84B`                   | fills y bordes       |
| goldSubtle       | `rgba(232, 184, 75, 0.12)`  | —                    |
| info             | `#3A6494`                   | steel500             |
| infoSubtle       | `rgba(58, 100, 148, 0.08)`  | —                    |
| success          | `#2A9E65`                   | —                    |
| danger           | `#C04040`                   | —                    |
| warning          | `#A06020`                   | —                    |
| borderColor      | `rgba(0, 0, 0, 0.08)`       | —                    |
| borderStrong     | `rgba(0, 0, 0, 0.14)`       | —                    |
| icon             | `#8C8374`                   | coal400              |
| overlay          | `rgba(0, 0, 0, 0.45)`       | —                    |
| tabBar           | `rgba(255, 255, 255, 0.90)` | —                    |

---

## Roles Semánticos de Color

| Token               | Significado                                                |
| ------------------- | ---------------------------------------------------------- |
| `$primary`          | Acciones principales: CTA, botón play, tabs activos        |
| `$gold`             | SOLO para PRs y récords. Nunca decorativo.                 |
| `$info`             | SOLO para timer de descanso y datos informativos neutros   |
| `$success`          | Sets completados, checkmarks, streaks positivos            |
| `$danger`           | Destructivos (borrar, cancelar). Inactivo: `$textTertiary` |
| `$warning`          | Advertencias de técnica, deload, mensajes de atención      |
| `$surface`          | Tarjetas principales (CardBase)                            |
| `$surfaceSecondary` | Inputs, chips inactivos, botones ghost                     |
| `$surfaceTertiary`  | Hover states, fondos de tabla de sets                      |

---

## Regla de Oro — Elementos Destructivos

Un elemento destructivo (trash, cancel) **NO** usa `$danger` en reposo. Usa `$textTertiary` en estado inactivo → `$danger` solo en estado activo o confirmación. Aplica a: íconos de basura, botones de cancelar, swipe-to-delete.

---

## Principios de Delimitación Visual

- Bordes (`borderWidth 1 $borderColor`) sobre sombras para delimitar cards y contenedores.
- Las sombras se reservan para elementos flotantes (modales, bottom sheets, mini-player).
- Los fondos `$primarySubtle` con borde `$primary` reemplazan bloques sólidos de `$primary` para CTAs secundarios — reducen ruido visual manteniendo legibilidad.

---

## Patrones de Componente Recurrentes

### Chip (filtro / selector)

- **Inactivo:** `bg $surfaceSecondary · borderWidth 1 · borderColor $borderColor · borderRadius $full · texto $textSecondary · fontWeight 700`
- **Activo:** `bg $primarySubtle · borderColor $primary · texto $primary · fontWeight 700`
- `fontWeight` siempre 700 en ambos estados para evitar saltos de ancho al togglear.

### Chip de Estado (toggle 3 opciones tipo "Sistema / Claro / Oscuro")

Igual al chip pero con `flex 1` dentro de un `XStack` para distribución equitativa.

### Botón Primario

`bg $primary · texto $background · fontWeight 700 · height $buttonHeight · borderRadius $lg`

### Botón Outline

`bg transparent · borderWidth 1.5 · borderColor $primary · texto $primary · fontWeight 700 · height $buttonHeight · borderRadius $lg`

### Botón Ghost

`bg transparent · texto $primary · fontWeight 600`

---

## Accesibilidad — Reduced Motion

Gestionado por `useMotion` hook + preferencia `motionPreference` en `useSettings`.

| Preferencia | Comportamiento                                                                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `system`    | Respeta `UIAccessibilityIsReduceMotionEnabled` (iOS) / `Settings.Global.ANIMATOR_DURATION_SCALE` (Android) vía `useReducedMotion()` de Reanimated |
| `full`      | Todas las animaciones activas, ignorando el OS                                                                                                    |
| `reduced`   | Springs → timing lineal 150ms. Hero animations → `FadeIn.duration(100)`. Loops deshabilitados. Skeleton estático en `opacity 0.7`                 |

### Config (`reducedMotionConfig` en `motion.ts`)

| Propiedad               | Valor                  | Descripción                                      |
| ----------------------- | ---------------------- | ------------------------------------------------ |
| `maxDuration`           | `150`                  | Duración máxima permitida en cualquier animación |
| `fallbackEntering`      | `FadeIn.duration(100)` | Fallback para todas las entradas                 |
| `fallbackExiting`       | `FadeOut.duration(80)` | Fallback para todas las salidas                  |
| `disableLoopAnimations` | `true`                 | Skeleton, spinners, etc. → estáticos             |
| `disableHeroAnimations` | `true`                 | Summary screen → fade instantáneo                |

### API de `useMotion()`

```typescript
const m = useMotion();

m.isReduced; // boolean
m.entering(animation); // animation | fallbackEntering
m.exiting(animation); // animation | fallbackExiting
m.spring("snappy"); // SpringConfig | { duration: 150 }
m.timing(duration); // { duration: Math.min(duration, 150) } | { duration }
m.semantic("reward"); // motionSemantics token | reduced fallback
```

### Componentes con soporte reduced motion

| Componente            | Comportamiento reducido                                  |
| --------------------- | -------------------------------------------------------- |
| `summary.tsx`         | Hero fade → `FadeIn.duration(100)` (sin hero 520ms)      |
| `rest-timer.tsx`      | SlideInUp → `FadeIn.duration(100)`                       |
| `skeleton-loader.tsx` | Loop detenido, `opacity` estático `0.7`                  |
| `set-row.tsx`         | Scale spring → timing 150ms                              |
| `[active].tsx`        | Exercise transitions → `FadeIn/FadeOut.duration(80-100)` |
| `mini-player.tsx`     | FadeInDown/FadeOutDown → fade 100/80ms                   |
