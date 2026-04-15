Temper — Master Views & Navigation (Clean Spec)
1. Sistema de Design Tokens
Tipografía
titleLg
titleMd
titleSm
subtitle
bodyLg
bodyMd
bodySm
label
Colores del Tema
$background
$surface
$surfaceSecondary
$color
$textSecondary
$textTertiary
$primary
$primarySubtle
$gold
$goldSubtle
$info
$infoSubtle
$success
$successSubtle
$danger
$dangerSubtle
$warning
$borderColor
Espaciado
$xs
$sm
$md
$lg
$xl
$2xl
$3xl
$4xl
Border Radius
$sm
$md
$lg
$xl
$2xl
$full
Alturas Estándar
buttonHeight
iconButton
inputHeight
setRowHeight
miniPlayerHeight
2. Reglas Globales de Layout
Grid System
base 8pt
subgrid 4pt
padding horizontal estándar: $lg
separación vertical entre secciones: $xl
spacing entre componentes relacionados: $md
Touch Targets
mínimo 44x44
separación mínima 8
3. Motion System
Microinteracciones
feedback táctil: 100ms
hover/press: 80–120ms
Transiciones
navegación: 250–300ms
modales / sheets: 300–350ms
Easing
entrada: ease-out
salida: ease-in
Accessibility
soporte reduce motion
4. Navegación Maestra
Tabs principales
Home
Workout
Library
Analytics
Profile
Stacks secundarios
Exercise Flow
Session Flow
Settings Flow
5. Diccionario de Vistas
Home

Objetivo:
estado general del usuario, acceso rápido a sesión y progreso.

Componentes:

hero stats
quick start
recent workout
streak card
CTA principal
Create Exercise

Objetivo:
crear ejercicio personalizado.

Componentes:

selector de músculos por categoría
músculo primario
músculo secundario
SVG interactivo
tipo de ejercicio
tipo de carga
descripción
Workout Session

Objetivo:
registro activo de sets y progreso.

Componentes:

header de ejercicio
rows de sets
timer descanso
CTA siguiente ejercicio
mini player persistente
Exercise Library

Objetivo:
búsqueda, filtrado y exploración.

Componentes:

search
filtros
categorías
cards de ejercicios
Analytics

Objetivo:
progreso, volumen y tendencias.

Componentes:

charts
KPIs
historial
PR tracking
6. Estados Globales UX

Cada pantalla debe incluir:

loading
empty
success
error
offline
skeleton state

Esto es una práctica crítica para evitar documentación incompleta.

7. Componentes Compartidos
Button
Input
Select
BottomSheet
Modal
Card
StatBlock
ExerciseRow
TimerPill
ProgressChart
8. Naming Convention
vistas: PascalCase
componentes: PascalCase
tokens: camelCase
rutas: kebab-case