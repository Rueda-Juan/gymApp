# Temper — PLAN-A

## Screen Contracts, State Matrix & Implementation Blueprint

---

# 1. Navigation Map (Source of Truth)

```typescript
export const routes = {
  dashboard: '/(tabs)',
  routines: '/(tabs)/routines',
  history: '/(tabs)/history',
  stats: '/(tabs)/stats',
  settings: '/(tabs)/settings',
  activeWorkout: '/(workouts)/[active]',
  summary: '/(workouts)/summary',
  exerciseDetail: '/exercise/[id]',
}
```

**Validation checklist**

* Ruta ↔ nombre de pantalla 1:1
* Nombre de archivo Expo Router coincide con path
* Deep link soportado
* Parámetros tipados (`[id]`, `[active]`)
* Analytics event name definido

---

# 2. Objective

Formalizar contratos de pantalla, inventario de componentes, matrices de estado, contratos de navegación y criterios QA para todas las vistas principales de Temper.

Este documento es **pre-implementación IA** y sirve como blueprint técnico para frontend, QA y planificación.

---

# 3. Scope

## In scope

* Dashboard
* Rutinas
* Historial
* Estadísticas
* Ajustes
* Entrenamiento Activo
* Explorador de Ejercicios
* Resumen Post Sesión

## Out of scope

* Integraciones externas
* Pantallas legacy
* Features experimentales
* Backend contracts

---

# 4. Architecture Impact

| Layer       | Impact |
| ----------- | ------ |
| Data        | Bajo   |
| Domain      | Medio  |
| Application | Alto   |
| UI          | Alto   |
| Infra       | Bajo   |

---

# 5. Screen Contracts (Mandatory)

## DashboardScreen

```ts
{
  inputs: [user, activeWorkout, streakData, routinesPreview],
  actions: [startWorkout, resumeWorkout, openRoutine, openStats],
  states: [loading, empty, error, success, offline, refreshing],
  dependencies: [useDashboardStore, useWorkoutSession, useNetworkState],
  navigation: {
    routines: routes.routines,
    activeWorkout: routes.activeWorkout,
    stats: routes.stats
  }
}
```

## ActiveWorkoutScreen

```ts
{
  inputs: [session, currentExercise, restTimer, suggestions],
  actions: [completeSet, skipRest, finishWorkout, editWeight],
  states: [loading, success, paused, offline, syncPending, error],
  dependencies: [useWorkoutStore, useRestTimer, useOfflineQueue]
}
```

---

# 6. State Matrix by Screen

## Dashboard

| State      | Expected UI              |
| ---------- | ------------------------ |
| loading    | skeleton cards + shimmer |
| empty      | CTA crear primera rutina |
| error      | retry + cached fallback  |
| offline    | persistent banner        |
| success    | dashboard completo       |
| refreshing | pull-to-refresh spinner  |

## Historial

| State   | Expected UI                |
| ------- | -------------------------- |
| empty   | mensaje sin entrenamientos |
| loading | skeleton list              |
| error   | retry + soporte cache      |
| success | lista agrupada por semana  |

## Active Workout

| State       | Expected UI          |
| ----------- | -------------------- |
| active      | sets interactivos    |
| paused      | overlay + resume CTA |
| syncPending | cloud sync badge     |
| offline     | queue persistente    |
| error       | restore session      |

---

# 7. Navigation Contracts

Cada transición debe definir:

```ts
{
  source: 'dashboard',
  action: 'startWorkout',
  destination: 'activeWorkout',
  params: { active: string },
  fallback: 'restore_previous_session'
}
```

Esto evita ambigüedad para IA y E2E.

---

# 8. Component Inventory

## Global Components

* AppHeader
* ScreenContainer
* PrimaryButton
* SecondaryButton
* StatCard
* ExerciseCard
* RestChip
* NumericDisplay
* BottomSheet
* ErrorState
* EmptyState
* LoadingSkeleton
* OfflineBanner

## Screen-specific

* WorkoutSetRow
* ExerciseMuscleBadge
* SessionProgressBar
* AnimatedTrophyCard

---

# 9. Design Tokens Structure

## Files

```text
src/design/
  tokens/
    primitives.ts
    semantic.ts
    components.ts
    motion.ts
```

## Mapping

* primitives → raw palette
* semantic → theme aliases
* components → presets
* motion → durations, easing, reduced motion

---

# 10. Motion Contracts

Solo Reanimated.

```ts
export const MOTION = {
  micro: 100,
  standard: 220,
  screen: 280,
  sheet: 320,
}
```

## Accessibility

* support reduce motion
* disable non-essential transitions
* preserve layout stability

---

# 11. Accessibility QA Matrix

## Mandatory

* contraste AA 4.5:1
* touch target >= 44x44
* focus visible
* semantic labels
* screen reader order
* reduce motion
* dynamic type resilience
* landscape support

---

# 12. Testing Strategy

## Unit

* state rendering
* component variants
* edge states

## Integration

* store + screen contracts
* navigation params
* offline restore

## E2E

* start workout
* finish workout
* restore interrupted session
* empty states
* retry flows

---

# 13. Risks

* documentation drift
* missing transient states
* duplicated components
* route mismatch
* token mismatch

---

# 14. Acceptance Criteria

* todas las pantallas tienen contrato
* matriz de estados completa
* navegación tipada
* componentes inventariados
* tokens separados
* QA checklist completo
* validación frontend + QA

---

# 15. Next AI Plan (PLAN-B)

Después de este documento, el siguiente paso recomendado es:

**PLAN-B — Implementation Tasks for AI**

* create folders
* scaffold screens
* create shared components
* wire stores
* implement state matrix
* add tests

Este archivo queda como **fuente de verdad previa a implementación**.
