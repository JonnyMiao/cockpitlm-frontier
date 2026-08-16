import { index, integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const papers = sqliteTable(
  "papers",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    normalizedTitle: text("normalized_title").notNull(),
    abstract: text("abstract").notNull(),
    publishedAt: text("published_at").notNull(),
    updatedAt: text("updated_at").notNull(),
    venue: text("venue"),
    primaryCategory: text("primary_category").notNull(),
    doi: text("doi"),
    arxivId: text("arxiv_id"),
    openReviewId: text("openreview_id"),
    aclId: text("acl_id"),
    semanticScholarId: text("semantic_scholar_id"),
    sourceUrl: text("source_url").notNull(),
    pdfUrl: text("pdf_url"),
    sourceProvider: text("source_provider").notNull(),
    sourceRecordId: text("source_record_id").notNull(),
    sourceUpdatedAt: text("source_updated_at").notNull(),
    retrievedAt: text("retrieved_at").notNull(),
    rawJson: text("raw_json").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    uniqueIndex("idx_papers_arxiv_id").on(table.arxivId),
    uniqueIndex("idx_papers_doi").on(table.doi),
    index("idx_papers_published_at").on(table.publishedAt),
    index("idx_papers_category_published").on(table.primaryCategory, table.publishedAt),
    index("idx_papers_normalized_title").on(table.normalizedTitle),
  ],
);

export const paperAuthors = sqliteTable(
  "paper_authors",
  {
    paperId: text("paper_id").notNull().references(() => papers.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    position: integer("position").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.paperId, table.position] }),
    index("idx_paper_authors_name").on(table.name),
  ],
);

export const topics = sqliteTable("topics", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
});

export const methods = sqliteTable("methods", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  family: text("family").notNull(),
});

export const cockpitTasks = sqliteTable("cockpit_tasks", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  group: text("group_name").notNull(),
});

export const paperTopics = sqliteTable(
  "paper_topics",
  {
    paperId: text("paper_id").notNull().references(() => papers.id, { onDelete: "cascade" }),
    topicId: text("topic_id").notNull().references(() => topics.id, { onDelete: "cascade" }),
    confidence: integer("confidence").notNull(),
    classifierVersion: text("classifier_version").notNull(),
  },
  (table) => [primaryKey({ columns: [table.paperId, table.topicId] }), index("idx_paper_topics_topic").on(table.topicId)],
);

export const paperMethods = sqliteTable(
  "paper_methods",
  {
    paperId: text("paper_id").notNull().references(() => papers.id, { onDelete: "cascade" }),
    methodId: text("method_id").notNull().references(() => methods.id, { onDelete: "cascade" }),
    confidence: integer("confidence").notNull(),
  },
  (table) => [primaryKey({ columns: [table.paperId, table.methodId] }), index("idx_paper_methods_method").on(table.methodId)],
);

export const paperCockpitTasks = sqliteTable(
  "paper_cockpit_tasks",
  {
    paperId: text("paper_id").notNull().references(() => papers.id, { onDelete: "cascade" }),
    cockpitTaskId: text("cockpit_task_id").notNull().references(() => cockpitTasks.id, { onDelete: "cascade" }),
    confidence: integer("confidence").notNull(),
    rationale: text("rationale").notNull(),
  },
  (table) => [primaryKey({ columns: [table.paperId, table.cockpitTaskId] }), index("idx_paper_cockpit_task").on(table.cockpitTaskId)],
);

export const researchIntelligence = sqliteTable(
  "research_intelligence",
  {
    paperId: text("paper_id").primaryKey().references(() => papers.id, { onDelete: "cascade" }),
    summary: text("summary").notNull(),
    problem: text("problem").notNull(),
    contribution: text("contribution").notNull(),
    cockpitTransfer: text("cockpit_transfer").notNull(),
    recommendedExperiment: text("recommended_experiment").notNull(),
    frontierScore: integer("frontier_score").notNull(),
    cockpitScore: integer("cockpit_score").notNull(),
    engineeringScore: integer("engineering_score").notNull(),
    scoringVersion: text("scoring_version").notNull(),
    generatedAt: text("generated_at").notNull(),
  },
  (table) => [
    index("idx_intelligence_frontier").on(table.frontierScore),
    index("idx_intelligence_cockpit").on(table.cockpitScore),
    index("idx_intelligence_engineering").on(table.engineeringScore),
  ],
);

export const models = sqliteTable(
  "models",
  {
    id: text("id").primaryKey(), name: text("name").notNull(), family: text("family"), organization: text("organization"), releaseDate: text("release_date"),
    modalitiesJson: text("modalities_json").notNull(), parameters: text("parameters"), visionEncoder: text("vision_encoder"), connector: text("connector"), llm: text("llm"),
    architecture: text("architecture"), contextLength: text("context_length"), trainingStagesJson: text("training_stages_json").notNull(), openWeights: integer("open_weights", { mode: "boolean" }),
    license: text("license"), strengths: text("strengths"), limitations: text("limitations"), cockpitSuitability: text("cockpit_suitability"), deploymentSuitability: text("deployment_suitability"), sourceUrl: text("source_url").notNull(),
  },
  (table) => [index("idx_models_family_release").on(table.family, table.releaseDate)],
);

export const datasets = sqliteTable(
  "datasets",
  {
    id: text("id").primaryKey(), name: text("name").notNull(), category: text("category").notNull(), scale: text("scale"), modalitiesJson: text("modalities_json").notNull(),
    annotation: text("annotation"), temporalProperties: text("temporal_properties"), multiCamera: integer("multi_camera", { mode: "boolean" }), license: text("license"),
    availability: text("availability"), fineTuningSuitability: text("fine_tuning_suitability"), sourceUrl: text("source_url").notNull(),
  },
  (table) => [index("idx_datasets_category").on(table.category)],
);

export const benchmarks = sqliteTable(
  "benchmarks",
  {
    id: text("id").primaryKey(), name: text("name").notNull(), category: text("category").notNull(), modalitiesJson: text("modalities_json").notNull(),
    capabilities: text("capabilities").notNull(), limitations: text("limitations").notNull(), cockpitBoundary: text("cockpit_boundary"), sourceUrl: text("source_url").notNull(),
  },
  (table) => [index("idx_benchmarks_category").on(table.category)],
);

export const paperModels = sqliteTable(
  "paper_models",
  { paperId: text("paper_id").notNull().references(() => papers.id, { onDelete: "cascade" }), modelId: text("model_id").notNull().references(() => models.id, { onDelete: "cascade" }), relation: text("relation").notNull() },
  (table) => [primaryKey({ columns: [table.paperId, table.modelId, table.relation] }), index("idx_paper_models_model").on(table.modelId)],
);

export const paperDatasets = sqliteTable(
  "paper_datasets",
  { paperId: text("paper_id").notNull().references(() => papers.id, { onDelete: "cascade" }), datasetId: text("dataset_id").notNull().references(() => datasets.id, { onDelete: "cascade" }), relation: text("relation").notNull() },
  (table) => [primaryKey({ columns: [table.paperId, table.datasetId, table.relation] }), index("idx_paper_datasets_dataset").on(table.datasetId)],
);

export const paperBenchmarks = sqliteTable(
  "paper_benchmarks",
  { paperId: text("paper_id").notNull().references(() => papers.id, { onDelete: "cascade" }), benchmarkId: text("benchmark_id").notNull().references(() => benchmarks.id, { onDelete: "cascade" }), relation: text("relation").notNull() },
  (table) => [primaryKey({ columns: [table.paperId, table.benchmarkId, table.relation] }), index("idx_paper_benchmarks_benchmark").on(table.benchmarkId)],
);

export const ingestionRuns = sqliteTable(
  "ingestion_runs",
  {
    id: text("id").primaryKey(),
    provider: text("provider").notNull(),
    status: text("status").notNull(),
    fetched: integer("fetched").notNull().default(0),
    inserted: integer("inserted").notNull().default(0),
    updated: integer("updated").notNull().default(0),
    skipped: integer("skipped").notNull().default(0),
    error: text("error"),
    startedAt: text("started_at").notNull(),
    completedAt: text("completed_at"),
  },
  (table) => [index("idx_ingestion_runs_provider_started").on(table.provider, table.startedAt)],
);
