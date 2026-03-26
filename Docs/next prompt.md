# prompt

Analiza el proyecto React Native con Expo Router y refactoriza la capa de UI utilizando Tamagui.

OBJETIVO:
Migrar el sistema de diseño actual a Tamagui cumpliendo estándares de arquitectura frontend:

- Component-Based Architecture
- Separation of Concerns
- DRY (no duplicación)
- Component Reusability
- Clean Code

---

FASE 0 — RESTRICCIONES GLOBALES

- NO modificar:
  - Zustand (estado)
  - hooks (lógica)
  - services (datos)
  - navegación (Expo Router)

- Mantener separación de responsabilidades:
  - UI → components/
  - lógica → hooks/
  - estado → stores/

---

FASE 1 — DESIGN SYSTEM (CRÍTICO)

- Migrar theme/ a tamagui.config.ts
- Definir tokens consistentes:
  - $color
  - $space
  - $size
  - $radius
  - $font

REGLA:

- Prohibido usar valores hardcodeados
- Todo debe salir de tokens

---

FASE 2 — COMPONENTES BASE (components/ui)

Crear un sistema de componentes reutilizables:

- Screen
- Stack (wrapper de XStack/YStack)
- Text
- Button
- Input
- CardBase

REGLAS:

- Cada componente debe tener responsabilidad única (SRP)
- Componentes deben ser pequeños (<200 líneas)
- Props tipadas explícitamente
- Prohibido usar StyleSheet o inline styles

---

FASE 3 — COMPOSICIÓN (IMPORTANTE)

- Componentes complejos deben construirse por composición
- Evitar lógica dentro de componentes UI
- Reutilizar components/ui en:
  - feedback/
  - cards/
  - charts/

---

FASE 4 — MIGRACIÓN POR DOMINIO

Orden obligatorio:

1. components/ui
2. components/feedback
3. components/cards
4. components/charts
5. components/workout (solo estilos, no estructura)

REGLA:

- No duplicar código
- Si aparece duplicación → crear componente reusable

---

FASE 5 — WORKOUT (ZONA CRÍTICA)

- NO modificar estructura interna
- NO alterar animaciones
- NO romper gesture-handler o reanimated

Solo:

- reemplazar estilos por tokens Tamagui

---

FASE 6 — PANTALLAS (app/)

- Mantenerlas livianas
- Solo usar composición de componentes
- NO lógica de UI compleja

---

FASE 7 — PERFORMANCE

- No agregar wrappers innecesarios
- Mantener FlashList intacto
- Evitar re-renders innecesarios
- Respetar memoización existente

---

FASE 8 — CALIDAD DE CÓDIGO

- Nombres descriptivos
- Funciones pequeñas
- Evitar comentarios innecesarios
- Código autoexplicativo

---

FASE 9 — VALIDACIÓN

El refactor es válido si:

- No se rompe:
  - navegación
  - animaciones
  - gestures
- UI consistente en toda la app
- No hay estilos inline
- No hay duplicación de componentes
- Todos los estilos usan tokens

---

SALIDA:

- Código refactorizado
- Lista de cambios por carpeta
- Componentes nuevos creados
- Problemas detectados
