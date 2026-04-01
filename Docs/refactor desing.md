# Iron Log — Decisiones de Diseño UX v2
*Basado en el Diccionario de Vistas v2 + tamagui.config.ts. Cambios con tokens reales.*

---

## Observaciones sobre el sistema de tokens actual

Antes de los cambios, hay tres cosas del config que vale la pena revisar:

**1. Los `lineHeight` están mal calibrados para los tamaños de fuente grandes.**
`titleLg` es 34px pero tiene `lineHeight: 40`. Eso está bien. Pero `bodySm` es 18px con `lineHeight: 16` — el lineHeight es *menor* que el fontSize, lo que va a cortar descenders en iOS. Corrección: mínimo `lineHeight = fontSize * 1.2`.

**2. Los tokens de `space` tienen valores extraños en los numéricos (1: 10, 2: 16, 3: 17, 4: 19...).**
Los valores 17 y 19 no tienen origen claro — parecen resultado de ajustes manuales que se colaron en los tokens. Si nadie los usa a propósito, limpiarlos y dejar solo los aliases nombrados (xs/sm/md/lg/xl/2xl/3xl/4xl).

**3. `setRowHeight` = 56 es el mismo valor que `buttonHeight`.**
Un set row y un botón primario tienen la misma altura. Visualmente se van a "competir" en jerarquía. Propuesta: bajar `setRowHeight` a 48px, lo que además permite ver más sets en pantalla sin scroll.

---

## Cambios por pantalla con tokens específicos

---

### Tab Bar y Mini-Player

**Mini-Player — cambio de contenido:**

El mini-player actual muestra: icono Activity + nombre rutina (`bodySm $textSecondary`) + nombre ejercicio (`subtitle $color`).

Propuesta: reemplazar el nombre de rutina por el **timer de descanso activo** cuando `restTimerIsActive = true`. Layout:

```
[icono Activity $primarySubtle]  [nombre ejercicio $color bodyMd]  [00:47 $success titleSm]  [▶ Retomar]
```

Cuando no hay timer activo, el número desaparece y el nombre de ejercicio toma más espacio. El botón "Retomar" pasa de ser toda la card tocable a ser un `AppButton ghost` de altura 32px en el lado derecho. Esto hace la acción más explícita.

Medidas sin cambio: `height 56` · `borderRadius $xl` · `left/right 12` · sombra existente.

---

### 1. Inicio / Dashboard

**Eliminar: Botón Dumbbell (IconButton) en header.**
Actualmente es un icono decorativo que no navega a ningún lugar útil. Ocupa 40×40 en el header junto al nombre del usuario y no tiene función clara. Sacar.

**Modificar: Tarjeta "Entrenamiento en curso".**
Color actual: `backgroundColor $primary` sólido con texto en `surface`.
Problema: un bloque de `$primary` (#3B99F7) sólido como CTA principal en el Dashboard compite demasiado fuerte con todo lo demás. En una sesión activa queremos urgencia pero no ansiedad.

Propuesta: cambiar a `backgroundColor $primarySubtle` + borde 1.5px `$primary` + texto `$primary`. Más sutil, misma legibilidad, menor ruido visual. El fondo azul sólido se reserva para el botón "Sig. Ejercicio" dentro del workout activo, donde sí necesita ser el CTA dominante.

**Modificar: Stats Row.**
Las dos tarjetas (racha + semana) usan `CardBase` con `shadow`. Con el fondo `$background` (#F5F7F8 / #0F0F14), las shadows sutiles del CardBase casi no se ven.

Propuesta: reemplazar el shadow por `borderWidth 1` `borderColor $borderColor`. Más consistente con el resto del sistema que usa bordes, no sombras, para delimitar cards.

**Modificar: Carrusel de Rutinas → Lista vertical.**
`snapToInterval 292` + `width 280` en tarjetas = scroll horizontal. Problema ya discutido: solo se ve la primera tarjeta, el usuario no descubre las demás.

Propuesta: cambiar a `FlatList vertical` con `paddingHorizontal $xl`. Las tarjetas pasan de `width 280` a `width 100%`. Altura de cada tarjeta: `minHeight 88`. Se muestran 2-3 rutinas visibles directamente, con botón "Ver todas →" al pie de la sección.

El botón ⋯ (`MoreHorizontal`) de la tarjeta de rutina en dashboard no tiene acciones definidas en el diccionario. **Eliminar** de esta vista — las acciones de edición van en `routines.tsx`. Acá solo tiene sentido el botón Play.

**Agregar: Indicador "última vez" en tarjeta de rutina del dashboard.**
Bajo el nombre de la rutina: `label $textTertiary` con texto "Hace 3 días" o "Nunca". Calculado desde el historial. Sin navegación. Una línea, `marginTop $xs`.

**Agregar: 7 círculos de racha semanal.**
Reemplaza (o se coloca bajo) la tarjeta de racha actual. 7 círculos `size 28` en `XStack gap $sm` centrado. Días entrenados: `backgroundColor $primary`. Días vacíos: `backgroundColor $surfaceSecondary` + `borderWidth 1 borderColor $borderColor`. Etiquetas L M M J V S D en `label $textTertiary fontSize 10` debajo de cada círculo. Sin tap action. `marginBottom $lg`.

---

### 2. Rutinas

**Modificar: Tarjeta de Rutina.**

Estructura actual:
```
[timestamp label]          [▶ Play IconButton]
[Nombre titleMd]
[ejercicios bodyMd]
[badges músculos]
```

Propuesta de estructura:
```
[Nombre titleMd flex1]     [▶ zona derecha 25% del ancho]
[ejercicios bodyMd]        [separador vertical 1px $borderColor]
[badges + "Hace X días"]
```

El Play deja de ser un `IconButton` de 44×44 flotante en la esquina y se convierte en una **zona táctil vertical** que ocupa el lado derecho de la card, separada por una línea `borderLeftWidth 1 borderColor $borderColor`. Dentro: icono `Play 24px fill $primary`. Área táctil: `width 64 height 100% borderRadius 0 0 $lg $lg`. Esto resuelve el problema de área táctil pequeña sin cambiar la jerarquía visual.

**Modificar: Chips de filtro rápido (nuevo, bajo la barra de búsqueda).**
`ScrollView horizontal showsHorizontalScrollIndicator=false paddingHorizontal $lg paddingVertical $sm gap $sm`.

Chips: "Todos" · "Recientes" · "Push" · "Pull" · "Piernas" · "Full Body".

- Chip inactivo: `paddingHorizontal $md paddingVertical $xs borderRadius $full borderWidth 1 borderColor $borderColor backgroundColor $surfaceSecondary` · texto `label $textSecondary fontWeight 500`
- Chip activo: `backgroundColor $primarySubtle borderColor $primary` · texto `label $primary fontWeight 700`

Estos son filtros locales sobre la lista ya cargada — sin llamadas extra.

**Modificar: Estado vacío.**
Actualmente: solo texto `bodyMd $textSecondary`. Añadir `AppButton primary` "Crear primera rutina" con `marginTop $lg`. El estado vacío debe tener un CTA, no solo un mensaje.

---

### 3. Historial

**Modificar: Barra de búsqueda → colapsable.**
La search bar actual es siempre visible. Propuesta: header con título `titleLg` + icono `Search 20px $textTertiary` a la derecha. Tap en el icono → `Animated` expansión del input con `autoFocus`. Esto libera ~48px de espacio vertical que en historial son valiosos.

**Modificar: Tarjeta de entrenamiento.**
Estructura actual: nombre + fecha + ChevronRight + métricas en fila.

Añadir bajo las métricas: texto `label $textTertiary` con el ejercicio de mayor volumen de esa sesión. Ejemplo: "Mayor volumen: Sentadilla — 3.200 kg". Una línea, solo si el dato existe. `marginTop $xs`.

**Modificar: Swipe-to-delete.**
El botón reveal actual: `width 80 backgroundColor $danger borderRadius $lg`. El color `$danger` (#F87171) es muy saturado en reposo — está gritando "bórralo" antes de que el usuario decida hacer swipe.

Propuesta: cambiar el botón reveal a `backgroundColor $dangerSubtle` con icono `Trash2 24px $danger`. Solo cuando el swipe supera el 60% del ancho, el fondo hace transición a `$danger` sólido y el icono cambia a color `background`. Esto es más consistente con el principio de que los destructivos no deben robar foco.

**Agregar: Agrupación por semana.**
`SectionList` en lugar de `FlatList`. Headers de sección: `label $textTertiary marginVertical $sm marginLeft $lg`. Textos: "Esta semana" · "Semana pasada" · "Marzo 2025" · etc. Los headers de sección no tienen acción.

---

### 4. Estadísticas

**Modificar: Botón Share del header.**
Actualmente redirige a `/stats/weight` — eso parece un error de routing, un Share no debería llevar al logger de peso. Clarificar intención: si es Share de stats generales, usar `Share` nativo del OS. Si es navegar al logger, cambiar el icono a `Plus` o `Scale`.

Mientras tanto, moverlo fuera del header y colocarlo como acción secundaria dentro de la tarjeta de Peso Corporal (ya tiene su propio contexto).

**Modificar: Grid de resumen (4 métricas).**
`width 47%` en cada tarjeta + `flexWrap` puede romper en pantallas de menos de 375px de ancho. Cambiar a `XStack gap $md` con `flex 1` en cada card. 2 columnas garantizadas sin riesgo de overflow.

**Agregar: Sección de Fuerza con selector de ejercicio.**
Actualmente el gráfico de 1RM no está especificado en el diccionario de esta pantalla (aparece solo en el dropdown/selector de la descripción funcional pero sin tokens). Añadir:

```
[CardBase padding $none]
  [header padding $md borderBottomWidth 1 borderColor $borderColor]
    [texto "FUERZA" label $textTertiary]
    [Selector ejercicio: bodyMd $primary → BottomSheet de selección]
  [gráfico StatsLineChart height 160 padding $md]
  [fila bottom: "1RM estimado: 132 kg" titleSm + fecha label $textTertiary]
```

---

### 5. Ajustes

**Modificar: Chips de discos.**
Estado activo actual: `borderColor $primary bg $primarySubtle texto $primary`.
Estado inactivo: `borderColor $borderColor bg $surfaceSecondary texto $textSecondary fontWeight 400`.

El contraste entre activo e inactivo es suficiente pero el `fontWeight` cambia entre 400 y 700 — esto hace que los chips cambien de ancho al togglear, lo que mueve los chips adyacentes. Fix: usar `fontWeight 700` siempre, solo cambiar color.

**Modificar: Items "Próximamente" (Perfil, Notificaciones, Privacidad).**
Actualmente disparan Alert "Próximamente". Cambio: `opacity 0.4` en el `SettingItem` + remover el `onPress`. Sin feedback al tap. El usuario entiende que está deshabilitado sin necesitar un alert.

Si se quiere mantener algún feedback: `onPress` → Toast `type: 'info'` "Próximamente disponible" sin Alert nativo.

**Modificar: Switch Modo Oscuro → 3 opciones.**
El Switch binario no cubre "Sistema". Reemplazar con 3 chips horizontales igual al patrón de chips de barra en equipamiento:

"Sistema" · "Claro" · "Oscuro"

- Inactivo: `bg $surfaceSecondary borderColor $borderColor texto $textSecondary flex 1`
- Activo: `bg $primarySubtle borderColor $primary texto $primary flex 1`

Mismo componente, misma lógica, cero overhead visual nuevo.

**Modificar: Botón "Cerrar Sesión".**
Actualmente: fila con icono `LogOut $danger` + texto `bodyMd $danger fontWeight 700`. Este tratamiento lo hace muy prominente — visualmente al mismo nivel que las acciones de settings importantes.

Propuesta: moverlo al final absoluto de la pantalla, bajo la versión, con `opacity 0.6`. Al hacer tap: Alert de confirmación con `destructiveButtonIndex`. Mismo comportamiento, menor peso visual en reposo.

---

### 6. Entrenamiento Activo `[active].tsx`

Esta es la pantalla con más cambios importantes.

**Modificar: setRowHeight 56 → 48.**
Actualmente cada fila de set ocupa 56px (igual que `buttonHeight`). Con 5 sets + cabecera + botón añadir, el área de sets ocupa ~340px — en un iPhone SE (667px de alto) ya requiere scroll antes de llegar al footer de navegación.

Con 48px por fila: 5 sets = 240px. Se gana ~40px. Suficiente para ver 5-6 sets sin scroll en la mayoría de dispositivos.

Ajustes derivados del cambio de altura:
- Input peso e input reps: `height 36` (era implícitamente parte de los 56)
- Botón Check: `44×36` (mantener 44 de ancho para área táctil horizontal, reducir alto a 36)
- Padding vertical interno: `paddingVertical $xs` (4px) en lugar del implícito actual

**Modificar: Chip de Descanso → Barra de progreso visual.**

Actual:
```
YStack bg $primarySubtle border $primary borderRadius $xl
  texto "DESCANSO: Xs" label $primary uppercase
```

Propuesta:
```
XStack bg $primarySubtle border $primary borderRadius $xl height 36
  paddingHorizontal $lg paddingVertical $xs marginTop $sm marginHorizontal $xl
  
  [barra de progreso absolute inset-0 bg $primary borderRadius $xl opacity 0.15
   width interpolada: restRemaining/restTotal * 100%  ← Reanimated withTiming]
  
  [texto "00:47" titleSm $primary tabularNums flex1 textAlign center]
  
  [XStack gap $sm]
    ["-15s" Pressable paddingHorizontal $sm: label $primary]
    ["+15s" Pressable paddingHorizontal $sm: label $primary]
```

Tap en el chip completo → navega a `rest-timer.tsx` (para configuración avanzada). Los botones ±15s funcionan inline sin navegar. El chip muestra cuánto queda de un vistazo sin ocupar más espacio vertical que el actual.

**Modificar: Tarjetas "Peso Anterior / Sugerido".**
Estas dos tarjetas en `XStack gap $sm paddingHorizontal $xl marginBottom $lg` ocupan ~80px de altura. En pantallas pequeñas esto es un lujo.

Propuesta: colapsar a **una sola línea** bajo el nombre del ejercicio:

```
XStack gap $lg paddingHorizontal $xl marginBottom $sm
  [texto "Anterior: 80 kg × 10" bodySm $textTertiary]
  [separador · $textTertiary]  
  [texto "Sugerido: 82.5 kg" bodySm $primary fontWeight 700]
```

Se liberan ~64px de espacio vertical. La info sigue presente y scannable. Si hay mensaje de deload (`$warning`), aparece como línea adicional en `label $warning` bajo este row.

**Modificar: Botón "Finalizar" en header.**
Actual: `bg $primarySubtle texto $primary bodySm fontWeight 700 paddingHorizontal $md paddingVertical $sm borderRadius $lg`.

Propuesta: cambiar texto a **"Cerrar"** con `bg $surfaceSecondary texto $textSecondary` cuando hay sets sin completar. Solo cambia a `bg $primarySubtle texto $primary` cuando todos los sets están marcados. El cambio de estado es feedback visual de que "el entrenamiento está listo para finalizar".

**Modificar: Íconos de basura en set-row.**
El botón Trash fallback (`38×38 bg $surfaceSecondary icono Trash2 18px $danger`) está visible en reposo como acción destructiva. En una pantalla donde el usuario está en medio de un esfuerzo físico, un botón rojo visible aumenta el riesgo de tap accidental.

Propuesta: `icono Trash2 18px $textTertiary` en reposo. Solo se vuelve `$danger` cuando el swipe está activo (>20% del ancho). La capa delete absoluta mantiene su comportamiento actual.

**Modificar: Botón Hourglass en Bottom Bar con badge numérico.**
Actual: cuando `restTimerIsActive`, el icono rota en loop.

Propuesta: mantener la rotación + añadir un badge sobre el icono:
```
View position absolute top -4 right -4
  width 18 height 18 borderRadius 9
  backgroundColor $success
  texto label $background fontSize 10 fontWeight 700
  contenido: segundos restantes (actualizado cada segundo)
```
El usuario ve cuánto queda sin hacer tap. Si los segundos son >99, mostrar "99+".

**Modificar: Botón + Ejercicio en Bottom Bar → al menú ···.**
El bottom bar tiene actualmente 4 botones: ← + ⏳ →. Agregar un 5to sería demasiado denso para `paddingHorizontal $xl`.

El "+" de añadir ejercicio se mueve a una opción dentro del `Exercise Options BottomSheet` (que abre el ···). La opción se llama "Añadir ejercicio a la sesión" y navega al `exercise-browser`. Esto libera espacio en la bottom bar sin perder la funcionalidad.

**Agregar: Línea de progreso global.**
Bajo el header (`WorkoutHeader`), ya existe una `height 4 bg $borderColor` con relleno `$primary`. Está bien. Solo añadir una animación `withSpring` al cambio de width para que la transición sea suave en lugar de instantánea.

**Agregar: Nota de sesión.**
Nuevo `IconButton` en el header entre el botón X y el bloque central:
- Icono `PenLine 20px $textTertiary` · `40×40 bg transparent`
- Tap → `BottomSheet snapPoints ['40%']`
  - Título `titleSm` "Nota de sesión" · icono X cierra
  - `BottomSheetTextInput` multiline · `minHeight 80` · `bg $surface borderRadius $lg borderWidth 1 borderColor $borderColor padding $md fontSize 16 color $color`
  - Botón `AppButton primary` "Guardar nota" · guarda en el store Zustand junto al workout activo
- Si ya hay nota guardada: icono `PenLine` cambia a `$primary` como indicador visual

**Agregar: Flechitas ↑↓ en inputs de sets.**
Este es el cambio de mayor impacto en el flujo de entrenamiento.

Cuando un input (`peso` o `reps`) **no está en foco**, mostrar dos `Pressable` a sus lados:

```
XStack alignItems center gap $xs flex 1.2  [para el input de peso]

  [Pressable width 24 height 36 justifyContent center alignItems center
   onPress: decrementar -2.5kg / -1rep
   icono ChevronDown 14px $textTertiary]
  
  [TextInput flex 1 height 36 ...]
  
  [Pressable width 24 height 36 justifyContent center alignItems center
   onPress: incrementar +2.5kg / +1rep
   icono ChevronUp 14px $textTertiary]
```

Cuando el input está en foco (`isFocused = true`): las flechitas tienen `opacity 0` (desaparecen, el teclado toma el control). Transición `Animated opacity 200ms`.

Incrementos: peso +2.5 (o el disco más pequeño disponible en inventario de Ajustes) / reps +1.

---

### 7. Rest Timer

**Modificar: estructura de pantalla.**
La pantalla pasa a ser de uso secundario (configuración avanzada), no flujo principal. El layout actual es bueno — solo dos cambios:

Añadir **presets de tiempo** sobre los controles principales:
```
XStack gap $sm justifyContent center marginBottom $xl
  [5 chips: "30s" "60s" "90s" "2m" "3m"]
  chip: paddingHorizontal $md paddingVertical $xs borderRadius $full
        borderWidth 1 borderColor $borderColor bg $surfaceSecondary
        texto label $textSecondary
  chip activo (= tiempo actual): bg $primarySubtle borderColor $primary texto $primary
```
Tap en chip → salta al tiempo indicado (no suma, reemplaza el restante).

Cambiar botones de `-10s / +10s` a `-15s / +15s` (más útil en contexto de gym donde los descansos son de 60-120s típicamente, un ajuste de 15s es más relevante que 10s).

---

### 8. Editor de Rutinas

**Modificar: Header.**
Botón Share2 actual → **eliminar**. El Share de una rutina en edición no tiene un caso de uso claro en este punto del flujo. Si se quiere compartir rutinas, es una funcionalidad separada a pensar después.

Resultado: header queda con X (izquierda) + nombre centrado + Guardar (derecha). Más limpio.

Reemplazar icono `Save` del botón Guardar por **texto "Guardar"** (`label $background fontWeight 700`). Mismo `bg $primary 40×40 borderRadius $lg`. Los íconos de disquete tienen bajísimo reconocimiento en usuarios menores de 25 años.

**Modificar: Ejercicios colapsados por defecto.**
La densidad del editor viene de mostrar todas las opciones de cada ejercicio simultáneamente. 

Propuesta: cada `RoutineExerciseRow` tiene dos estados:

**Colapsado (default):**
```
XStack height 52 paddingHorizontal $md gap $md alignItems center
  [ícono ☰ handle drag 20px $textTertiary]
  [nombre ejercicio bodyMd $color fontWeight 600 flex 1]
  [texto "4×8-12" label $textSecondary]  ← resumen compacto
  [icono link: $primary si en superset, $borderColor si no]
  [ChevronDown 16px $textTertiary → expandir]
```

**Expandido (tap en la fila):**
```
YStack bg $surface borderRadius $lg borderWidth 1 borderColor $borderColor padding $md gap $md
  [fila header colapsado arriba]
  [separador borderBottomWidth 1 borderColor $borderColor]
  [XStack gap $md: "SERIES" label + botones - número + / XStack gap $md: "REPS" label + input min-max]
  [fila Superset: icono Link + texto "Enlazar con siguiente" bodyMd $primary / "Desenlazar" $danger]
  [fila Eliminar: icono Trash2 $textTertiary (NO $danger en reposo) + texto "Eliminar ejercicio" bodyMd $textTertiary]
```

Esto reduce la altura inicial de cada ejercicio de ~120px a 52px. Con 5 ejercicios: antes 600px, después 260px. El usuario expande solo lo que necesita editar.

**Modificar: Botones - y + de sets/reps.**
Área táctil mínima 44×44px. Actualmente no especificada, probablemente menor. Usar `hitSlop={{top:8,bottom:8,left:8,right:8}}` si el tamaño visual tiene que mantenerse pequeño.

**Modificar: CTA principal clarificado.**
El botón "Agregar ejercicio" de la sección ejercicios pasa a ser el elemento visualmente más prominente del cuerpo:

```
AppButton outline width 100% marginTop $lg
  icono Plus 20px $primary
  texto "Agregar ejercicio" bodyMd $primary fontWeight 700
```

El botón "Guardar" del header es la acción final de cierre, no la acción recurrente. La acción recurrente es agregar ejercicios — debe ser la más visible del cuerpo.

**Agregar: Preview de duración estimada.**
Bajo el `AppInput` de nombre de rutina:

```
texto label $textTertiary marginTop $xs
contenido: "~52 min estimados · " + nEjercicios + " ejercicios"
```

Cálculo: `(total_sets_en_rutina * 180 segundos) / 60`. Se recalcula en tiempo real al añadir/quitar ejercicios o cambiar el número de series.

---

### 11. Resumen Post-Sesión

**Modificar: Trophy Section.**
Círculo trofeo actual: `120×120 bg $goldSubtle icono Trophy 60px $gold`.

Propuesta: añadir un anillo exterior animado. Un `View 140×140 borderRadius 70 borderWidth 2 borderColor $gold opacity 0` que hace `FadeIn + scaleFrom(0.8)` con `delay 300 duration 600`. Da sensación de "logro que se expande" sin ser excesivo.

**Modificar: Badges de PR.**
Badge actual: `XStack bg $goldSubtle paddingHorizontal $sm paddingVertical $xs borderRadius $md` con `Star 12px $gold` + texto `label $gold fontWeight 700`.

Añadir el **delta** junto al badge:
```
YStack alignItems flex-end
  [Badge PR existente]
  [texto "+5 kg vs anterior" label $gold fontSize 12 marginTop 2]
```
Si no hay sesión anterior para comparar, solo el badge sin delta.

**Modificar: Footer.**
Orden actual: `AppButton outline "Compartir"` + `AppButton primary "Listo"`.

Propuesta de orden: `AppButton primary "Listo"` arriba + `AppButton ghost "Repetir este entrenamiento →"` abajo.

Repetir el entrenamiento es un caso de uso frecuente para usuarios avanzados. "Compartir" es menos frecuente y se puede mover a un `IconButton Share` en el header (top right) de la pantalla de summary.

**Agregar: Comparación con sesión anterior.**
Bajo las dos tarjetas de métricas (duración + volumen), añadir una fila:
```
XStack justifyContent center gap $sm marginTop $sm
  [icono TrendingUp 14px $success / TrendingDown 14px $danger]
  [texto "vs sesión anterior: +340 kg · +3 min" bodySm $textSecondary]
```
Si es la primera sesión de esa rutina: no mostrar esta fila. Si el volumen bajó: `TrendingDown $warning` con texto neutral ("–120 kg vs sesión anterior").

---

## Resumen de tokens modificados

| Componente | Token actual | Token propuesto | Razón |
|---|---|---|---|
| `setRowHeight` | 56 | 48 | Ver más sets sin scroll |
| Set row trash icon | `$danger` | `$textTertiary` (inactivo) | Destructivos no deben robar foco |
| CTA workout en curso (Dashboard) | `bg $primary` sólido | `bg $primarySubtle border $primary` | Reducir ruido visual |
| Stats cards (Dashboard) | shadow CardBase | `borderWidth 1 $borderColor` | Consistencia con resto del sistema |
| Chip descanso | texto plano | barra progreso + ±15s inline | Info de un vistazo, menos navegación |
| Tarjetas peso anterior/sugerido | 2 cards ~80px | 1 línea ~20px | Liberar espacio vertical |
| Botón Finalizar header | siempre `$primary` | `$textSecondary` hasta completar | Prevenir finales accidentales |
| Editor ejercicio row | siempre expandido ~120px | colapsado 52px por defecto | Reducir densidad cognitiva |
| Ícono Guardar (disquete) | `Save icon` | texto "Guardar" | Mejor reconocimiento |
| Summary footer | Compartir + Listo | Listo + Repetir | Priorizar acción más frecuente |
import { createTamagui, createTokens, createFont } from '@tamagui/core';

// ─────────────────────────────────────────────
// IRON LOG — Sistema de diseño v2
// Identidad: Carbón forjado + Cobre + Brasa
// ─────────────────────────────────────────────
//
// FILOSOFÍA DE PALETA
//
// Dark (primario): fragua oscura. Fondo casi negro cálido, no azulado.
//   El negro de una app de gym debe tener calor, no frialdad clínica.
//   Referencia visual: interior de un garage gym a las 6am.
//
// Light (secundario): papel industrial. Cremas cálidas, no blanco clínico.
//   Referencia visual: cuaderno de entrenamiento manchado de tiza.
//
// Acento primario → COBRE (#E8762E dark / #D4621A light)
//   Reemplaza al azul genérico #3B99F7.
//   El cobre es el metal del esfuerzo: barras usadas, plates oxidados.
//   Warm, orgánico, memorable. No lo usa ninguna app mainstream de fitness.
//
// Acento secundario → BRASA (#E8B84B)
//   Exclusivo para PRs y récords. Más cálido que un dorado genérico.
//   Cuando aparece, significa que algo importante pasó.
//
// Info / Descanso → ACERO AZUL (#4F80B8 dark / #3A6494 light)
//   Reemplaza al mismo azul primario que se usaba para todo.
//   Ahora el azul tiene un rol semántico específico: descanso y datos.
//
// Success → VERDE FORJA (#3DB87A dark / #2A9E65 light)
//   Ligeramente más cálido que el #34D399 anterior. Menos neón.

const systemFont = createFont({
  family: 'System',
  size: {
    1: 16,
    2: 18,
    3: 20,
    4: 22,
    5: 24,
    6: 26,
    7: 34,
  },
  lineHeight: {
    // CORREGIDO: lineHeight siempre >= fontSize * 1.2
    // El config anterior tenía lineHeight: 16 para fontSize: 18 — cortaba descenders
    1: 20,  // era 14 (INCORRECTO: < fontSize)
    2: 22,  // era 16 (INCORRECTO: < fontSize)
    3: 26,  // era 20
    4: 28,  // era 22
    5: 30,  // era 24
    6: 36,  // era 32
    7: 42,  // era 40
  },
  weight: {
    4: '400',
    5: '500',
    6: '600',
    7: '700',
  },
  letterSpacing: {
    4: 0,
    5: 0,
    6: -0.5,
    7: -0.5,
  },
});

const tokens = createTokens({
  color: {
    transparent: '#ffffff00',
    white: '#FFFFFF',
    black: '#000000',

    // ── CARBÓN (reemplaza grises genéricos) ──
    // Grises cálidos con temperatura de ~2700K
    // Cada paso tiene una temperatura visual consistente
    coal950: '#0D0C0A',   // bg dark principal
    coal900: '#161410',   // surface dark
    coal850: '#1E1B16',   // surface secondary dark
    coal800: '#28241C',   // surface tertiary dark
    coal750: '#332E24',
    coal700: '#3E382B',   // border area
    coal500: '#6B6352',   // text tertiary dark / secondary light
    coal400: '#8C8374',
    coal300: '#B0A899',   // text secondary dark
    coal200: '#D4CFC5',   // borders light
    coal100: '#EAE6DF',   // surface secondary light
    coal50:  '#F5F2EC',   // bg light principal

    // ── COBRE (acento principal — reemplaza #3B99F7) ──
    copper600: '#8B3D07',
    copper500: '#B5530A',
    copper400: '#D4621A',  // primario light
    copper350: '#E8762E',  // primario dark
    copper300: '#F28C4E',
    copper200: '#F9B88A',
    copper100: '#FCDFC6',
    copperSubtle: 'rgba(212, 98, 26, 0.10)',   // light subtle
    copperSubtleDark: 'rgba(232, 118, 46, 0.12)', // dark subtle

    // ── BRASA (acento PR/récords — reemplaza $gold) ──
    ember400: '#E8B84B',
    ember300: '#F0CC7A',
    ember200: '#F8E4B0',
    emberSubtle: 'rgba(232, 184, 75, 0.15)',

    // ── ACERO (info/descanso — ahora con rol semántico específico) ──
    steel600: '#2A4A6B',
    steel500: '#3A6494',
    steel400: '#4F80B8',  // dark
    steel300: '#7AA3CC',
    steel200: '#B0C8E0',
    steelSubtle: 'rgba(79, 128, 184, 0.12)',
    steelSubtleLight: 'rgba(58, 100, 148, 0.08)',

    // ── SUCCESS (verde forja — más orgánico que el neón anterior) ──
    forgeSuccess:        '#3DB87A',  // dark
    forgeSuccessLight:   '#2A9E65',  // light (más oscuro, contraste sobre blanco)
    forgeSuccessSubtle:  'rgba(61, 184, 122, 0.12)',
    forgeSuccessSubtleL: 'rgba(42, 158, 101, 0.10)',

    // ── DANGER ──
    forgeDanger:       '#E05252',
    forgeDangerLight:  '#C04040',
    forgeDangerSubtle: 'rgba(224, 82, 82, 0.12)',

    // ── WARNING ──
    forgeWarning:       '#D4882A',
    forgeWarningSubtle: 'rgba(212, 136, 42, 0.12)',

    // ── OVERLAYS ──
    overlayDark:  'rgba(0, 0, 0, 0.70)',
    overlayLight: 'rgba(0, 0, 0, 0.45)',

    // ── TAB BAR ──
    tabBarDark:  'rgba(22, 20, 16, 0.92)',
    tabBarLight: 'rgba(255, 255, 255, 0.90)',
  },

  space: {
    // Limpiar los valores numéricos extraños (3:17, 4:19 no tienen origen claro)
    // Mantener solo aliases semánticos + valores necesarios para Tamagui
    0: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
    true: 16,
  },

  size: {
    0: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
    buttonHeight: 52,     // era 56, reducido para densidad
    iconButton: 40,
    inputHeight: 44,
    setRowHeight: 48,     // era 56, CRÍTICO: permite ver 5-6 sets sin scroll
    miniPlayerHeight: 56,
    true: 16,
  },

  radius: {
    0: 0,
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
    true: 12,
  },

  zIndex: {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
  },
});

// ─────────────────────────────────────────────
// TEMA DARK — Carbón forjado
// ─────────────────────────────────────────────
const darkTheme = {
  background:          '#0D0C0A',   // coal950
  surface:             '#161410',   // coal900
  surfaceSecondary:    '#1E1B16',   // coal850
  surfaceTertiary:     '#28241C',   // coal800

  color:               '#F5F2EC',   // coal50   — texto principal
  textSecondary:       '#B0A899',   // coal300
  textTertiary:        '#6B6352',   // coal500

  // Acento principal: COBRE
  primary:             '#E8762E',   // copper350
  primaryDark:         '#D4621A',   // copper400
  primaryLight:        '#F28C4E',   // copper300
  primarySubtle:       'rgba(232, 118, 46, 0.12)',

  // PR / Récords: BRASA
  gold:                '#E8B84B',   // ember400
  goldLight:           '#F0CC7A',   // ember300
  goldSubtle:          'rgba(232, 184, 75, 0.15)',

  // Info / Descanso: ACERO
  info:                '#4F80B8',   // steel400
  infoSubtle:          'rgba(79, 128, 184, 0.12)',

  // Estados
  success:             '#3DB87A',
  successSubtle:       'rgba(61, 184, 122, 0.12)',
  danger:              '#E05252',
  dangerSubtle:        'rgba(224, 82, 82, 0.12)',
  warning:             '#D4882A',
  warningSubtle:       'rgba(212, 136, 42, 0.12)',

  borderColor:         'rgba(255, 255, 255, 0.07)',
  borderStrong:        'rgba(255, 255, 255, 0.12)',

  icon:                '#6B6352',   // coal500
  overlay:             'rgba(0, 0, 0, 0.70)',
  tabBar:              'rgba(22, 20, 16, 0.92)',
};

// ─────────────────────────────────────────────
// TEMA LIGHT — Papel industrial
// ─────────────────────────────────────────────
const lightTheme = {
  background:          '#F5F2EC',   // coal50
  surface:             '#FFFFFF',
  surfaceSecondary:    '#EAE6DF',   // coal100
  surfaceTertiary:     '#D4CFC5',   // coal200

  color:               '#161410',   // coal900  — texto principal
  textSecondary:       '#4A4337',   // entre coal700 y coal500, contraste 4.5:1 sobre blanco
  textTertiary:        '#8C8374',   // coal400

  // Acento principal: COBRE (más oscuro en light para contraste WCAG)
  primary:             '#D4621A',   // copper400
  primaryDark:         '#B5530A',   // copper500
  primaryLight:        '#E8762E',   // copper350
  primarySubtle:       'rgba(212, 98, 26, 0.08)',

  // PR / Récords: BRASA (con texto oscuro para contraste)
  gold:                '#9A7A1A',   // brasa oscuro para texto sobre fondo claro
  goldDisplay:         '#E8B84B',   // para fills y bordes
  goldSubtle:          'rgba(232, 184, 75, 0.12)',

  // Info / Descanso: ACERO
  info:                '#3A6494',   // steel500
  infoSubtle:          'rgba(58, 100, 148, 0.08)',

  // Estados
  success:             '#2A9E65',
  successSubtle:       'rgba(42, 158, 101, 0.10)',
  danger:              '#C04040',
  dangerSubtle:        'rgba(192, 64, 64, 0.10)',
  warning:             '#A06020',
  warningSubtle:       'rgba(160, 96, 32, 0.10)',

  borderColor:         'rgba(0, 0, 0, 0.08)',
  borderStrong:        'rgba(0, 0, 0, 0.14)',

  icon:                '#8C8374',   // coal400
  overlay:             'rgba(0, 0, 0, 0.45)',
  tabBar:              'rgba(255, 255, 255, 0.90)',
};

const config = createTamagui({
  defaultFont: 'body',
  fonts: {
    body:    systemFont,
    heading: systemFont,
  },
  tokens,
  themes: {
    light: lightTheme,
    dark:  darkTheme,
  },
});

export default config;

export type AppConfig = typeof config;

declare module '@tamagui/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends AppConfig {}
}

// ─────────────────────────────────────────────
// GUÍA DE USO — Resumen de decisiones semánticas
// ─────────────────────────────────────────────
//
// $primary        → Acciones principales (CTA, botón play, tabs activos)
// $gold           → SOLO para PRs y récords. Nunca decorativo.
// $info           → SOLO para timer de descanso y datos informativos neutros
// $success        → Sets completados, checkmarks, streaks positivos
// $danger         → Destructivos (borrar, cancelar). Inactivo: $textTertiary
// $warning        → Advertencias de técnica, deload, mensajes de atención
//
// $surface        → Tarjetas principales (CardBase)
// $surfaceSecondary → Inputs, chips inactivos, botones ghost
// $surfaceTertiary  → Hover states, fondos de tabla de sets
//
// REGLA DE ORO:
// Un elemento destructivo (trash, cancel) NO usa $danger en reposo.
// Usa $textTertiary en reposo → $danger solo en estado activo/confirmación.
// Esto aplica a: íconos de basura, botones de cancelar, swipe-to-delete.