Frontend
├── app/                # routing (expo-router) → se queda
│
├── features/
│   ├── exercise/
│   │   ├── screens/
│   │   │   ├── ExerciseBrowserScreen.tsx
│   │   │   ├── ExerciseDetailScreen.tsx
│   │   │   └── CreateExerciseScreen.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── CreateExerciseForm.tsx
│   │   │   ├── MuscleSelectorSheet.tsx
│   │   │   └── ExerciseCard.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useExercises.ts
│   │   │   ├── useExerciseFiltering.ts
│   │   │   └── useMuscleSelection.ts
│   │   │
│   │   ├── utils/
│   │   │   └── exercise.ts
│   │   │
│   │   └── index.ts
│
│   ├── workout/
│   │   ├── screens/
│   │   │   ├── ActiveWorkoutScreen.tsx
│   │   │   └── SummaryScreen.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── ActiveWorkoutBottomBar.tsx
│   │   │   ├── WorkoutHeader.tsx
│   │   │   ├── SetRow.tsx
│   │   │   └── ...
│   │   │
│   │   ├── hooks/
│   │   │   ├── useWorkout.ts
│   │   │   ├── useWorkoutTimer.ts
│   │   │   └── useSetCompletion.ts
│   │   │
│   │   ├── store/
│   │   │   └── useActiveWorkout.ts
│   │   │
│   │   └── index.ts
│
│   ├── routine/
│   ├── stats/
│   ├── settings/
│   └── history/
│
├── shared/             # 🔑 SOLO lo reutilizable global
│   ├── ui/
│   │   ├── AppButton.tsx
│   │   ├── AppText.tsx
│   │   ├── Screen.tsx
│   │   └── ToggleChip.tsx
│   │
│   ├── components/
│   │   ├── EmptyState.tsx
│   │   ├── ErrorState.tsx
│   │   └── LoadingSkeleton.tsx
│   │
│   ├── hooks/
│   │   ├── useTheme.ts
│   │   └── useNetworkState.ts
│   │
│   ├── utils/
│   │   ├── formatters.ts
│   │   └── time.ts
│   │
│   └── constants/
│
├── core/               # 🔧 infraestructura global
│   ├── di/
│   ├── context/
│   ├── config/
│   └── navigation/

Qué se mueve exactamente (mapping real)
🔄 De esto:
components/workout/activeWorkout/*
hooks/domain/useWorkout.ts
store/useActiveWorkout.ts
👉 A esto:
features/workout/components/*
features/workout/hooks/*
features/workout/store/*
🔄 De esto:
components/ui/*
👉 A:
shared/ui/*

(SOLO si es reutilizable global)

🔄 De esto:
utils/exercise.ts
hooks/useExercises.ts
👉 A:
features/exercise/utils/
features/exercise/hooks/
⚠️ Reglas clave (esto es lo que define si tu arquitectura es buena o no)
1. 🔒 Regla de oro

Si solo lo usa un feature → VA DENTRO DEL FEATURE

2. 🌍 Shared NO es dumping ground

Solo cosas:

genéricas
sin lógica de negocio
reutilizadas mínimo 2–3 features
3. 🚫 Evitá esto
features/exercise → importa de → features/workout

Si pasa:
👉 mover a shared/

4. 🧠 Screens ≠ lógica

Tu app/ queda como:

routing puro
delega todo a features

Tal como recomiendan las arquitecturas modernas

💡 Insight importante (nivel senior)

Vos ya estás en una arquitectura casi clean + feature hybrid.

Tu backend está:

core/
features/

👉 replicar eso en frontend es PERFECTO

Te queda una arquitectura simétrica:

Backend:  core + features
Frontend: core + features + shared

Eso es arquitectura enterprise real, no tutorial.

🚀 Plan de migración (sin romper todo)

No lo hagas de golpe.

Crear /features
Migrar SOLO exercise
Ajustar imports
Testear
Repetir con workout, etc.
🧠 Conclusión clara

Tu proyecto ya está:

bien pensado
modular
listo para escalar

Lo único que te falta es:

👉 colapsar horizontal → vertical por dominio

Y con eso pasás de:

proyecto prolijo

a:

proyecto escalable de verdad