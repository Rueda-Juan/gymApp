import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';

// --- Exercises ---
export const exercises = sqliteTable('exercises', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  nameEs: text('name_es'),
  primaryMuscle: text('primary_muscle').notNull(),
  primaryMuscles: text('primary_muscles', { mode: 'json' }).$type<string[]>(),
  secondaryMuscles: text('secondary_muscles', { mode: 'json' }).$type<string[]>(),
  equipment: text('equipment'),
  weightIncrement: real('weight_increment').default(2.5),
  animationPath: text('animation_path'),
  description: text('description'),
  isCustom: integer('is_custom', { mode: 'boolean' }).notNull().default(false),
  createdBy: text('created_by'),
  loadType: text('load_type', { enum: ['weighted', 'bodyweight', 'assisted', 'timed'] }).notNull().default('weighted'),
  type: text('type', { enum: ['compound', 'isolation'] }).notNull().default('compound'),
  isArchived: integer('is_archived', { mode: 'boolean' }).notNull().default(false),
  exerciseKey: text('exercise_key').unique(),
  anatomicalSvg: text('anatomical_svg'),
});

// --- Routines ---
export const routines = sqliteTable('routines', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  notes: text('notes'),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
});

export const routineExercises = sqliteTable('routine_exercises', {
  id: text('id').primaryKey(),
  routineId: text('routine_id').notNull().references(() => routines.id, { onDelete: 'cascade' }),
  exerciseId: text('exercise_id').notNull().references(() => exercises.id, { onDelete: 'restrict' }),
  orderIndex: integer('order_index').notNull().default(0),
  targetSets: integer('target_sets'),
  targetReps: integer('target_reps'),
  supersetGroup: text('superset_group'),
});

// --- Workouts ---
export const workouts = sqliteTable('workouts', {
  id: text('id').primaryKey(),
  routineId: text('routine_id').references(() => routines.id, { onDelete: 'set null' }),
  date: text('date').notNull().default(sql`(datetime('now'))`),
  durationSeconds: integer('duration_seconds').default(0),
  notes: text('notes'),
});

export const workoutExercises = sqliteTable('workout_exercises', {
  id: text('id').primaryKey(),
  workoutId: text('workout_id').notNull().references(() => workouts.id, { onDelete: 'cascade' }),
  exerciseId: text('exercise_id').notNull().references(() => exercises.id, { onDelete: 'restrict' }),
  orderIndex: integer('order_index').notNull().default(0),
  skipped: integer('skipped', { mode: 'boolean' }).default(false),
  notes: text('notes'),
  supersetGroup: text('superset_group'),
});

// --- Sets ---
export const sets = sqliteTable('sets', {
  id: text('id').primaryKey(),
  workoutId: text('workout_id').notNull().references(() => workouts.id, { onDelete: 'cascade' }),
  exerciseId: text('exercise_id').notNull().references(() => exercises.id, { onDelete: 'restrict' }),
  setNumber: integer('set_number').notNull(),
  weight: real('weight').default(0),
  reps: integer('reps').default(0),
  durationSeconds: integer('duration_seconds').default(0),
  completed: integer('completed', { mode: 'boolean' }).default(false),
  skipped: integer('skipped', { mode: 'boolean' }).default(false),
  setType: text('set_type', { enum: ['warmup', 'normal', 'failure', 'dropset'] }).default('normal'),
  rir: integer('rir'),
  restSeconds: integer('rest_seconds'),
  partialReps: integer('partial_reps'),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
});

// --- Relations ---
export const routineRelations = relations(routines, ({ many }) => ({
  routineExercises: many(routineExercises),
}));

export const routineExerciseRelations = relations(routineExercises, ({ one }) => ({
  routine: one(routines, {
    fields: [routineExercises.routineId],
    references: [routines.id],
  }),
  exercise: one(exercises, {
    fields: [routineExercises.exerciseId],
    references: [exercises.id],
  }),
}));

export const workoutRelations = relations(workouts, ({ many, one }) => ({
  workoutExercises: many(workoutExercises),
  sets: many(sets),
  routine: one(routines, {
    fields: [workouts.routineId],
    references: [routines.id],
  }),
}));

export const workoutExerciseRelations = relations(workoutExercises, ({ one }) => ({
  workout: one(workouts, {
    fields: [workoutExercises.workoutId],
    references: [workouts.id],
  }),
  exercise: one(exercises, {
    fields: [workoutExercises.exerciseId],
    references: [exercises.id],
  }),
}));

export const setRelations = relations(sets, ({ one }) => ({
  workout: one(workouts, {
    fields: [sets.workoutId],
    references: [workouts.id],
  }),
  exercise: one(exercises, {
    fields: [sets.exerciseId],
    references: [exercises.id],
  }),
}));

// --- Stats & Records ---
export const exerciseStats = sqliteTable('exercise_stats', {
  exerciseId: text('exercise_id').primaryKey().references(() => exercises.id, { onDelete: 'cascade' }),
  maxWeight: real('max_weight').default(0),
  maxVolume: real('max_volume').default(0),
  estimated1rm: real('estimated_1rm').default(0),
  totalSets: integer('total_sets').default(0),
  totalReps: integer('total_reps').default(0),
  totalVolume: real('total_volume').default(0),
  lastPerformed: text('last_performed'),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`),
});

export const personalRecords = sqliteTable('personal_records', {
  id: text('id').primaryKey(),
  exerciseId: text('exercise_id').notNull().references(() => exercises.id, { onDelete: 'cascade' }),
  recordType: text('record_type', { enum: ['max_weight', 'max_reps', 'max_volume', 'estimated_1rm'] }).notNull(),
  value: real('value').notNull(),
  setId: text('set_id').references(() => sets.id, { onDelete: 'set null' }),
  date: text('date').notNull().default(sql`(datetime('now'))`),
});

export const dailyStats = sqliteTable('daily_stats', {
  date: text('date').primaryKey(),
  totalVolume: real('total_volume').default(0),
  totalSets: integer('total_sets').default(0),
  totalReps: integer('total_reps').default(0),
  workoutCount: integer('workout_count').default(0),
  totalDuration: integer('total_duration').default(0),
});

// --- User Preferences ---
export const userPreferences = sqliteTable('user_preferences', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`),
});

// --- Body Weight ---
export const bodyWeightLog = sqliteTable('body_weight_log', {
  id: text('id').primaryKey(),
  weight: real('weight').notNull(),
  date: text('date').notNull().default(sql`(datetime('now'))`),
  notes: text('notes'),
});

// --- Cache ---
export const exerciseLoadCache = sqliteTable('exercise_load_cache', {
  exerciseId: text('exercise_id').primaryKey().references(() => exercises.id, { onDelete: 'cascade' }),
  recommendedWeight: real('recommended_weight').notNull(),
  basis: text('basis', { enum: ['progressive_overload', 'last_set', 'deload', 'failure_recovery', 'default'] }).notNull(),
  lastWeight: real('last_weight'),
  lastReps: integer('last_reps'),
  sessionsAnalyzed: integer('sessions_analyzed').notNull().default(0),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
});
