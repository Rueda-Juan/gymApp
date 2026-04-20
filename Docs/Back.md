# Backend – Especificación Técnica (MVP)

Backend embebido local dentro de la app React Native + Expo.

## Objetivo

Responsable de:

- lógica de negocio
- acceso a SQLite
- estadísticas
- progresión de peso
- backups
- servicios consumidos por frontend

> No existe servidor remoto. Todo corre offline en el dispositivo.

---

## Principios

- **offline-first**
- **clean architecture**
- **alta cohesión**
- **bajo acoplamiento**
- **type-first**
- **testable**

Frontend nunca accede directo a SQLite.

---

## Stack

- TypeScript
- Expo / React Native
- SQLite (`expo-sqlite`)
- Zod
- Jest

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

---

## Arquitectura

```text
Frontend
   ↓
Hooks / Services
   ↓
Use Cases
   ↓
Domain
   ↓
Repositories
   ↓
SQLite
```

### Capas

### Domain

- entities
- value objects
- repository interfaces
- reglas de negocio

### Application

- use cases
- stats calculator
- algoritmos de progresión

### Infrastructure

- sqlite repositories
- migrations
- backups
- dependency container

### Interface

- services
- hooks

---

## Entidades principales

### Exercise

```ts
interface Exercise {
  id: string;
  name: string;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment;
  exerciseType: "compound" | "isolation";
  loadType: "weighted" | "bodyweight" | "assisted" | "timed";
  description?: string | null;
  isCustom: boolean;
}
```

### Routine

```ts
interface Routine {
  id: string;
  name: string;
  exercises: RoutineExercise[];
  createdAt: Date;
}
```

### Workout

```ts
interface Workout {
  id: string;
  routineId?: string | null;
  date: Date;
  durationSeconds: number;
  exercises: WorkoutExercise[];
}
```

### WorkoutSet

```ts
interface WorkoutSet {
  id: string;
  exerciseId: string;
  setNumber: number;
  weight: number;
  reps: number;
  rir?: number | null;
  setType: SetType;
  completed: boolean;
}
```

---

## Value Objects

```ts
type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "forearms"
  | "quadriceps"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "abs"
  | "traps";

type Equipment =
  | "barbell"
  | "dumbbell"
  | "machine"
  | "cable"
  | "bodyweight"
  | "band"
  | "other";

type SetType = "normal" | "warmup" | "dropset" | "failure";
```

---

## Repositories

Interfaces del dominio:

```ts
interface ExerciseRepository {
  getAll(): Promise<Exercise[]>;
  getById(id: string): Promise<Exercise | null>;
  save(exercise: Exercise): Promise<void>;
  delete(id: string): Promise<void>;
}
```

```ts
interface WorkoutRepository {
  getById(id: string): Promise<Workout | null>;
  save(workout: Workout): Promise<void>;
  addSet(workoutId: string, set: WorkoutSet): Promise<void>;
}
```

---

## Use Cases

### Workouts

- start workout
- finish workout
- record set
- update set
- delete set
- skip exercise
- reorder exercises

### Exercises

- create
- update
- delete
- history
- suggest weight
- suggest warmup

### Routines

- create
- update
- duplicate
- delete

### Stats

- weekly stats
- muscle balance
- PRs
- body weight history

### Backup

- create backup
- restore backup
- export csv

---

## Validación

Toda entrada runtime se valida con Zod.

```ts
export const WorkoutSetSchema = z.object({
  exerciseId: z.string(),
  setNumber: z.number().int().positive(),
  weight: z.number().min(0),
  reps: z.number().int().min(0),
});
```

---

## Estadísticas

Se calculan **en escritura**, no en lectura.

```text
recordSet()
   ↓
updateExerciseStats()
   ↓
updateDailyStats()
   ↓
checkPR()
```

Esto mantiene lecturas instantáneas.

---

## Transacciones

Operaciones multi-tabla deben usar transacción.

```ts
await db.withTransactionAsync(async () => {
  await insertSet();
  await updateStats();
  await savePR();
});
```

---

## Dependency Injection

```ts
export interface AppContainer {
  workoutService: WorkoutService;
  exerciseService: ExerciseService;
  routineService: RoutineService;
}
```

Container manual:

```ts
export function createContainer(db: SQLiteDatabase) {
  const workoutRepo = new SQLiteWorkoutRepository(db);

  return {
    workoutService: new WorkoutService(workoutRepo),
  };
}
```

---

## Estructura

```text
src/
├── domain/
├── application/
├── infrastructure/
├── interface/
└── shared/
```

---

## Testing

Objetivo mínimo:

```text
80% cobertura
```

Prioridad:

- use cases
- stats
- validators
- repositories

---

## Backups

MVP:

```text
SQLite → JSON
```

Futuro:

```text
Google Drive OAuth
```

---

## Logging

```ts
log.info();
log.warn();
log.error();
```

Persistencia local:

```text
app_logs.txt
```

Rotación:

```text
1 MB
```

---

## Migraciones

Sistema incremental:

```text
001 → 022
```

Ordenadas e idempotentes.

´´´text
Backend/
└── src/
├── features/
│
│ ├── backup/
│ │ ├── backup.service.ts
│ │ ├── backup.repository.ts
│ │ ├── sqlite-backup.repository.ts
│ │ ├── export-csv.strategy.ts
│ │ ├── export-txt.strategy.ts
│ │ ├── backup.schemas.ts
│ │
│ ├── exercises/
│ │ ├── exercise-load-cache.repository.ts
│ │ ├── exercise.entity.ts
│ │ ├── exercise.repository.ts
│ │ ├── exercise.schemas.ts
│ │ ├── exercise.service.ts
│ │ ├── sqlite-exercise-load-cache.repository.ts
│ │ ├── sqlite-exercise.repository.ts
│ │ ├── suggest-weight.ts
│ │ ├── suggest-warmup.ts
│ │
│ ├── routines/
│ │ ├── routine.entity.ts
│ │ ├── routine.repository.ts
│ │ ├── sqlite-routine.repository.ts
│ │ ├── routine.service.ts
│ │
│ ├── workouts/
│ │ ├── workout.entity.ts
│ │ ├── workout-set.entity.ts
│ │ ├── workout.repository.ts
│ │ ├── sqlite-workout.repository.ts
│ │ ├── workout.service.ts
│ │
│ ├── stats/
│ │ ├── stats.service.ts
│ │ ├── stats.repository.ts
│ │ ├── sqlite-stats.repository.ts
│ │ ├── stats-calculator.ts
│ │ ├── daily-stats.entity.ts
│ │ ├── exercise-stats.entity.ts
│ │ ├── personal-record.entity.ts
│ │ ├── stats.schemas.ts
│ │
│ ├── bodyWeight/
│ │ ├── body-weight.entity.ts
│ │ ├── body-weight.repository.ts
│ │ ├── sqlite-body-weight.repository.ts
│ │ ├── body-weight.service.ts
│ │ ├── body-weight.schemas.ts
│ │
│ ├── settings/
│ │ ├── user-preferences.entity.ts
│ │ ├── user-preferences.repository.ts
│ │ ├── sqlite-user-preferences.repository.ts
│ │ ├── settings.service.ts
│ │ ├── preferences.schemas.ts
│ │
│
├── core/
│ ├── database/
│ │ ├── connection.ts
│ │ └── migrations/
│ │ ├── 001_schema_migrations.ts
│ │ ├── 002_exercises.ts
│ │ ├── 003_routines.ts
│ │ ├── 004_routine_exercises.ts
│ │ ├── 005_workouts.ts
│ │ ├── 006_workout_exercises.ts
│ │ ├── 007_sets.ts
│ │ ├── 008_exercise_stats.ts
│ │ ├── 009_personal_records.ts
│ │ ├── 010_daily_stats.ts
│ │ ├── 011_add_rir_and_rep_range.ts
│ │ ├── 012_add_anatomical_svg_to_exercises.ts
│ │ ├── 014_add_set_type.ts
│ │ ├── 015_add_workout_exercise_notes.ts
│ │ ├── 016_add_rest_seconds.ts
│ │ ├── 017_user_preferences.ts
│ │ ├── 018_body_weight_log.ts
│ │ ├── 019_superset_groups.ts
│ │ ├── 020_add_max_reps.ts
│ │ ├── 021_primary_muscles_array.ts
│ │ ├── 027_add_exercise_key.ts
│ │ ├── 029_add_custom_exercise_fields.ts
│ │ ├── 030_add_exercise_load_cache.ts
│ │ ├── 031_remove_wger_seed_exercises.ts
│ │ ├── 032_add_partial_reps.ts
│ │ └── index.ts
│
│ ├── logger/
│ │ ├── logger.interface.ts
│ │ ├── console.logger.ts
│ │
│ ├── utils/
│ │ ├── date.ts
│ │ ├── generate-id.ts
│ │ ├── math.ts
│ │ ├── safe-json.ts
│ │
│ ├── errors/
│ │ └── errors.ts
│ │
│ ├── di/
│ │ └── container.ts
│
│ ├── types/
│ │ ├── equipment.ts
│ │ ├── muscle-group.ts
│ │ ├── set-type.ts
│ │ ├── session-context.ts
│
│
├── api/
│ ├── hooks/
│ │ ├── useBackup.ts
│ │ ├── useBodyWeight.ts
│ │ ├── useContainer.ts
│ │ ├── useExercises.ts
│ │ ├── usePreferences.ts
│ │ ├── useRoutines.ts
│ │ ├── useStats.ts
│ │ ├── useWorkout.ts
│ │ └── index.ts
│
└── index.ts
´´´
