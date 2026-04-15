````md
# Base de Datos (BD) — Versión Simplificada

## Objetivo
Base de datos local **offline-first** para registrar entrenamientos, rutinas, progreso y estadísticas rápidas.

**Motor:** SQLite (`expo-sqlite`)

---

## Configuración inicial

```sql
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;
````

* `foreign_keys`: asegura integridad referencial
* `WAL`: mejora rendimiento de lectura/escritura

---

## Tablas principales

### exercises

Catálogo de ejercicios.

```sql
CREATE TABLE exercises (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  primary_muscles TEXT NOT NULL,
  secondary_muscles TEXT,
  equipment TEXT,
  exercise_type TEXT DEFAULT 'compound',
  load_type TEXT DEFAULT 'weighted',
  description TEXT,
  animation_path TEXT,
  is_custom BOOLEAN DEFAULT 0,
  is_archived BOOLEAN DEFAULT 0
);
```

---

### routines

Rutinas guardadas.

```sql
CREATE TABLE routines (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  notes TEXT,
  created_at DATETIME DEFAULT (datetime('now'))
);
```

---

### routine_exercises

Ejercicios dentro de una rutina.

```sql
CREATE TABLE routine_exercises (
  id TEXT PRIMARY KEY,
  routine_id TEXT NOT NULL,
  exercise_id TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  target_sets INTEGER,
  min_reps INTEGER,
  max_reps INTEGER,
  rest_seconds INTEGER DEFAULT 90,

  FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE RESTRICT
);
```

---

### workouts

Sesiones realizadas.

```sql
CREATE TABLE workouts (
  id TEXT PRIMARY KEY,
  routine_id TEXT,
  date DATETIME DEFAULT (datetime('now')),
  duration_seconds INTEGER DEFAULT 0,
  notes TEXT,

  FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE SET NULL
);
```

---

### workout_exercises

Ejercicios ejecutados en una sesión.

```sql
CREATE TABLE workout_exercises (
  id TEXT PRIMARY KEY,
  workout_id TEXT NOT NULL,
  exercise_id TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  skipped BOOLEAN DEFAULT 0,

  FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE RESTRICT
);
```

---

### sets

Unidad principal del sistema.

```sql
CREATE TABLE sets (
  id TEXT PRIMARY KEY,
  workout_id TEXT NOT NULL,
  exercise_id TEXT NOT NULL,
  set_number INTEGER NOT NULL,
  weight REAL DEFAULT 0,
  reps INTEGER DEFAULT 0,
  rir INTEGER,
  duration_seconds INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT (datetime('now')),

  FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE RESTRICT
);
```

---

## Tablas de estadísticas

### exercise_stats

Cache rápida por ejercicio.

```sql
CREATE TABLE exercise_stats (
  exercise_id TEXT PRIMARY KEY,
  max_weight REAL DEFAULT 0,
  estimated_1rm REAL DEFAULT 0,
  total_sets INTEGER DEFAULT 0,
  total_reps INTEGER DEFAULT 0,
  total_volume REAL DEFAULT 0,
  last_performed DATETIME,

  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);
```

---

### personal_records

```sql
CREATE TABLE personal_records (
  id TEXT PRIMARY KEY,
  exercise_id TEXT NOT NULL,
  record_type TEXT NOT NULL,
  value REAL NOT NULL,
  date DATETIME DEFAULT (datetime('now')),

  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);
```

---

### daily_stats

```sql
CREATE TABLE daily_stats (
  date DATE PRIMARY KEY,
  total_volume REAL DEFAULT 0,
  total_sets INTEGER DEFAULT 0,
  total_reps INTEGER DEFAULT 0,
  workout_count INTEGER DEFAULT 0,
  total_duration INTEGER DEFAULT 0
);
```

---

## Tablas auxiliares

### user_preferences

```sql
CREATE TABLE user_preferences (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
```

---

### body_weight_log

```sql
CREATE TABLE body_weight_log (
  id TEXT PRIMARY KEY,
  weight REAL NOT NULL,
  date DATE NOT NULL,
  notes TEXT
);
```

---

## Índices importantes

```sql
CREATE INDEX idx_sets_exercise ON sets(exercise_id);
CREATE INDEX idx_sets_workout ON sets(workout_id);
CREATE INDEX idx_workouts_date ON workouts(date);
CREATE INDEX idx_routine_exercises_routine ON routine_exercises(routine_id);
```

---

## Flujo de guardado

```text
Guardar set
   ↓
INSERT sets
   ↓
UPDATE exercise_stats
   ↓
Verificar PR
   ↓
UPSERT daily_stats
```

Todo dentro de **una transacción**.

---

## Tamaño estimado

```text
exercises:      < 100 KB
routines:       < 10 KB
workouts:       ~ 200 KB
sets:           ~ 5 MB
stats + PRs:    ~ 1 MB

TOTAL:          10–30 MB
```

SQLite maneja este tamaño sin problemas.

---

## Backups

Formato JSON:

```json
{
  "version": 1,
  "data": {
    "exercises": [],
    "routines": [],
    "workouts": [],
    "sets": [],
    "exercise_stats": [],
    "personal_records": [],
    "daily_stats": []
  }
}
```

---

## Idea clave

La tabla más importante es:

```text
sets
```

Todo lo demás deriva de ahí:

* historial
* progreso
* PRs
* estadísticas
* gráficos
* sugerencia de peso

```
```
