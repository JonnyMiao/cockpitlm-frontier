CREATE TABLE `benchmarks` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`modalities_json` text NOT NULL,
	`capabilities` text NOT NULL,
	`limitations` text NOT NULL,
	`cockpit_boundary` text,
	`source_url` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_benchmarks_category` ON `benchmarks` (`category`);--> statement-breakpoint
CREATE TABLE `datasets` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`scale` text,
	`modalities_json` text NOT NULL,
	`annotation` text,
	`temporal_properties` text,
	`multi_camera` integer,
	`license` text,
	`availability` text,
	`fine_tuning_suitability` text,
	`source_url` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_datasets_category` ON `datasets` (`category`);--> statement-breakpoint
CREATE TABLE `models` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`family` text,
	`organization` text,
	`release_date` text,
	`modalities_json` text NOT NULL,
	`parameters` text,
	`vision_encoder` text,
	`connector` text,
	`llm` text,
	`architecture` text,
	`context_length` text,
	`training_stages_json` text NOT NULL,
	`open_weights` integer,
	`license` text,
	`strengths` text,
	`limitations` text,
	`cockpit_suitability` text,
	`deployment_suitability` text,
	`source_url` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_models_family_release` ON `models` (`family`,`release_date`);--> statement-breakpoint
CREATE TABLE `paper_benchmarks` (
	`paper_id` text NOT NULL,
	`benchmark_id` text NOT NULL,
	`relation` text NOT NULL,
	PRIMARY KEY(`paper_id`, `benchmark_id`, `relation`),
	FOREIGN KEY (`paper_id`) REFERENCES `papers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`benchmark_id`) REFERENCES `benchmarks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_paper_benchmarks_benchmark` ON `paper_benchmarks` (`benchmark_id`);--> statement-breakpoint
CREATE TABLE `paper_datasets` (
	`paper_id` text NOT NULL,
	`dataset_id` text NOT NULL,
	`relation` text NOT NULL,
	PRIMARY KEY(`paper_id`, `dataset_id`, `relation`),
	FOREIGN KEY (`paper_id`) REFERENCES `papers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`dataset_id`) REFERENCES `datasets`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_paper_datasets_dataset` ON `paper_datasets` (`dataset_id`);--> statement-breakpoint
CREATE TABLE `paper_models` (
	`paper_id` text NOT NULL,
	`model_id` text NOT NULL,
	`relation` text NOT NULL,
	PRIMARY KEY(`paper_id`, `model_id`, `relation`),
	FOREIGN KEY (`paper_id`) REFERENCES `papers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`model_id`) REFERENCES `models`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_paper_models_model` ON `paper_models` (`model_id`);