CREATE TABLE `cockpit_tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`group_name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cockpit_tasks_slug_unique` ON `cockpit_tasks` (`slug`);--> statement-breakpoint
CREATE TABLE `ingestion_runs` (
	`id` text PRIMARY KEY NOT NULL,
	`provider` text NOT NULL,
	`status` text NOT NULL,
	`fetched` integer DEFAULT 0 NOT NULL,
	`inserted` integer DEFAULT 0 NOT NULL,
	`updated` integer DEFAULT 0 NOT NULL,
	`skipped` integer DEFAULT 0 NOT NULL,
	`error` text,
	`started_at` text NOT NULL,
	`completed_at` text
);
--> statement-breakpoint
CREATE INDEX `idx_ingestion_runs_provider_started` ON `ingestion_runs` (`provider`,`started_at`);--> statement-breakpoint
CREATE TABLE `methods` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`family` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `methods_slug_unique` ON `methods` (`slug`);--> statement-breakpoint
CREATE TABLE `paper_authors` (
	`paper_id` text NOT NULL,
	`name` text NOT NULL,
	`position` integer NOT NULL,
	PRIMARY KEY(`paper_id`, `position`),
	FOREIGN KEY (`paper_id`) REFERENCES `papers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_paper_authors_name` ON `paper_authors` (`name`);--> statement-breakpoint
CREATE TABLE `paper_cockpit_tasks` (
	`paper_id` text NOT NULL,
	`cockpit_task_id` text NOT NULL,
	`confidence` integer NOT NULL,
	`rationale` text NOT NULL,
	PRIMARY KEY(`paper_id`, `cockpit_task_id`),
	FOREIGN KEY (`paper_id`) REFERENCES `papers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`cockpit_task_id`) REFERENCES `cockpit_tasks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_paper_cockpit_task` ON `paper_cockpit_tasks` (`cockpit_task_id`);--> statement-breakpoint
CREATE TABLE `paper_methods` (
	`paper_id` text NOT NULL,
	`method_id` text NOT NULL,
	`confidence` integer NOT NULL,
	PRIMARY KEY(`paper_id`, `method_id`),
	FOREIGN KEY (`paper_id`) REFERENCES `papers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`method_id`) REFERENCES `methods`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_paper_methods_method` ON `paper_methods` (`method_id`);--> statement-breakpoint
CREATE TABLE `paper_topics` (
	`paper_id` text NOT NULL,
	`topic_id` text NOT NULL,
	`confidence` integer NOT NULL,
	`classifier_version` text NOT NULL,
	PRIMARY KEY(`paper_id`, `topic_id`),
	FOREIGN KEY (`paper_id`) REFERENCES `papers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_paper_topics_topic` ON `paper_topics` (`topic_id`);--> statement-breakpoint
CREATE TABLE `papers` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`normalized_title` text NOT NULL,
	`abstract` text NOT NULL,
	`published_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`venue` text,
	`primary_category` text NOT NULL,
	`doi` text,
	`arxiv_id` text,
	`openreview_id` text,
	`acl_id` text,
	`semantic_scholar_id` text,
	`source_url` text NOT NULL,
	`pdf_url` text,
	`source_provider` text NOT NULL,
	`source_record_id` text NOT NULL,
	`source_updated_at` text NOT NULL,
	`retrieved_at` text NOT NULL,
	`raw_json` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_papers_arxiv_id` ON `papers` (`arxiv_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_papers_doi` ON `papers` (`doi`);--> statement-breakpoint
CREATE INDEX `idx_papers_published_at` ON `papers` (`published_at`);--> statement-breakpoint
CREATE INDEX `idx_papers_category_published` ON `papers` (`primary_category`,`published_at`);--> statement-breakpoint
CREATE INDEX `idx_papers_normalized_title` ON `papers` (`normalized_title`);--> statement-breakpoint
CREATE TABLE `research_intelligence` (
	`paper_id` text PRIMARY KEY NOT NULL,
	`summary` text NOT NULL,
	`problem` text NOT NULL,
	`contribution` text NOT NULL,
	`cockpit_transfer` text NOT NULL,
	`recommended_experiment` text NOT NULL,
	`frontier_score` integer NOT NULL,
	`cockpit_score` integer NOT NULL,
	`engineering_score` integer NOT NULL,
	`scoring_version` text NOT NULL,
	`generated_at` text NOT NULL,
	FOREIGN KEY (`paper_id`) REFERENCES `papers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_intelligence_frontier` ON `research_intelligence` (`frontier_score`);--> statement-breakpoint
CREATE INDEX `idx_intelligence_cockpit` ON `research_intelligence` (`cockpit_score`);--> statement-breakpoint
CREATE INDEX `idx_intelligence_engineering` ON `research_intelligence` (`engineering_score`);--> statement-breakpoint
CREATE TABLE `topics` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `topics_slug_unique` ON `topics` (`slug`);