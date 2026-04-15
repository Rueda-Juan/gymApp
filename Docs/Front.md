# Front.md — Especificación Técnica Frontend (Versión Simplificada)

## 1. Objetivo

El frontend es responsable de:

* Renderizar la interfaz
* Gestionar navegación e interacciones
* Controlar estado visual, animaciones y feedback
* Consumir servicios y stores

> **Regla:** no contiene lógica de negocio. La lógica vive en services / capa de aplicación.

---

## 2. Stack

* **React Native + Expo**
* **TypeScript (strict)**
* **Expo Router**
* **Zustand**
* **Tamagui**
* **Reanimated**
* **Gesture Handler**
* **FlashList**
* **Bottom Sheet**
* **Lucide React Native**
* **expo-haptics**
* **date-fns**
* **zod**

---

## 3. Arquitectura

```text
View (Screens + UI Components)
   ↓
ViewModel (Hooks + Zustand Stores)
   ↓
Services (backend local)
```

### Reglas por capa

* **View:** solo UI + eventos
* **Hooks/Stores:** estado UI y transformación de datos
* **Services:** acceso a persistencia

---

## 4. Navegación

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

### Estructura

```text
app/
├── (tabs)/
├── (workouts)/
├── exercise/
├── history/
├── routine/
├── settings/
└── _layout.tsx
```

---

## 5. Pantallas principales

### Tabs

* Dashboard
* Routines
* History
* Stats
* Settings

### Stack / Modales

* Active Workout
* Workout Summary
* Exercise Browser
* Exercise Detail
* Routine Editor

---

## 6. Contrato estándar por pantalla

Cada screen debe documentar:

```typescript
interface ScreenContract {
  inputs: string[]
  actions: string[]
  states: string[]
  dependencies: string[]
}
```

### Estados mínimos

* loading
* success
* empty
* error
* offline
* refreshing

---

## 7. Stores

### Workout Store

```typescript
interface WorkoutState {
  activeWorkout: Workout | null
  currentExerciseIndex: number
  startWorkout: () => Promise<void>
  finishWorkout: () => Promise<void>
  nextExercise: () => void
}
```

### Exercise Store

```typescript
interface ExerciseState {
  exercises: Exercise[]
  searchQuery: string
  selectedMuscle: MuscleGroup | null
}
```

### Stats Store

```typescript
interface StatsState {
  exerciseStats: Map<string, ExerciseStats>
  loadDailyStats: () => Promise<void>
}
```

---

## 8. Componentes reutilizables

```text
components/
├── ui/
├── cards/
├── workout/
├── charts/
└── feedback/
```

### Core UI

* AppButton
* AppInput
* AppText
* Card
* Badge
* SearchBar
* Screen

### Workout

* SetRow
* WorkoutHeader
* RestTimerChip
* BottomBar

---

## 9. Sistema de diseño

### Tokens

```text
tokens/
├── primitives.ts
├── semantic.ts
└── components.ts
```

### Reglas

* sin hex en JSX
* spacing por tokens
* radios por tokens
* motion presets centralizados

---

## 10. Accesibilidad

Checklist obligatorio:

* contraste ≥ 4.5:1
* touch targets ≥ 44x44
* labels accesibles
* focus visible
* soporte reduce motion

---

## 11. Performance

* selectores específicos en Zustand
* memoización de rows
* FlashList para listas largas
* lazy loading de imágenes
* animaciones en UI thread

---

## 12. Testing

* unit: hooks + stores
* integration: screens
* e2e: flujos principales

Flujos críticos:

* iniciar workout
* completar sets
* finalizar sesión
* crear rutina
* restaurar backup

---

## 13. Principio de mantenimiento

Toda pantalla nueva debe incluir:

1. contrato
2. matriz de estados
3. componentes usados
4. dependencias
5. test plan
