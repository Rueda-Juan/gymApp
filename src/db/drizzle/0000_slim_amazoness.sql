CREATE TABLE `body_weight_log` (
	`id` text PRIMARY KEY NOT NULL,
	`weight` real NOT NULL,
	`date` text DEFAULT (datetime('now')) NOT NULL,
	`notes` text
);
--> statement-breakpoint
CREATE TABLE `daily_stats` (
	`date` text PRIMARY KEY NOT NULL,
	`total_volume` real DEFAULT 0,
	`total_sets` integer DEFAULT 0,
	`total_reps` integer DEFAULT 0,
	`workout_count` integer DEFAULT 0,
	`total_duration` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `exercise_load_cache` (
	`exercise_id` text PRIMARY KEY NOT NULL,
	`recommended_weight` real NOT NULL,
	`basis` text NOT NULL,
	`last_weight` real,
	`last_reps` integer,
	`sessions_analyzed` integer DEFAULT 0 NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `exercise_stats` (
	`exercise_id` text PRIMARY KEY NOT NULL,
	`max_weight` real DEFAULT 0,
	`max_volume` real DEFAULT 0,
	`estimated_1rm` real DEFAULT 0,
	`total_sets` integer DEFAULT 0,
	`total_reps` integer DEFAULT 0,
	`total_volume` real DEFAULT 0,
	`last_performed` text,
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`name_es` text,
	`primary_muscle` text NOT NULL,
	`primary_muscles` text,
	`secondary_muscles` text,
	`equipment` text,
	`weight_increment` real DEFAULT 2.5,
	`animation_path` text,
	`description` text,
	`is_custom` integer DEFAULT false NOT NULL,
	`created_by` text,
	`load_type` text DEFAULT 'weighted' NOT NULL,
	`type` text DEFAULT 'compound' NOT NULL,
	`is_archived` integer DEFAULT false NOT NULL,
	`exercise_key` text,
	`anatomical_svg` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exercises_exercise_key_unique` ON `exercises` (`exercise_key`);--> statement-breakpoint
CREATE TABLE `personal_records` (
	`id` text PRIMARY KEY NOT NULL,
	`exercise_id` text NOT NULL,
	`record_type` text NOT NULL,
	`value` real NOT NULL,
	`set_id` text,
	`date` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`set_id`) REFERENCES `sets`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `routine_exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`routine_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`order_index` integer DEFAULT 0 NOT NULL,
	`target_sets` integer,
	`target_reps` integer,
	`superset_group` text,
	FOREIGN KEY (`routine_id`) REFERENCES `routines`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `routines` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`notes` text,
	`created_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE TABLE `sets` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`set_number` integer NOT NULL,
	`weight` real DEFAULT 0,
	`reps` integer DEFAULT 0,
	`duration_seconds` integer DEFAULT 0,
	`completed` integer DEFAULT false,
	`skipped` integer DEFAULT false,
	`set_type` text DEFAULT 'normal',
	`rir` integer,
	`rest_seconds` integer,
	`partial_reps` integer,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `user_preferences` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE TABLE `workout_exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`order_index` integer DEFAULT 0 NOT NULL,
	`skipped` integer DEFAULT false,
	`notes` text,
	`superset_group` text,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `workouts` (
	`id` text PRIMARY KEY NOT NULL,
	`routine_id` text,
	`date` text DEFAULT (datetime('now')) NOT NULL,
	`duration_seconds` integer DEFAULT 0,
	`notes` text,
	FOREIGN KEY (`routine_id`) REFERENCES `routines`(`id`) ON UPDATE no action ON DELETE set null
);
