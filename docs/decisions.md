# Engineering Decisions

This document records the decisions that shape the current implementation and the trade-offs an interviewer or contributor should understand.

## Docker Compose as the deployment contract

**Decision:** define the local system as a Compose application.

**Why:** the project contains a database, one-shot migrations, long-running workers, an API, and a frontend. Compose provides reproducible networking, environment injection, persistent volumes, health-based dependencies, and a single developer entry point.

**Trade-off:** Compose is a single-host solution. Production orchestration would require stronger secret management, rolling deployment, autoscaling, and service-level health probes.

## Separate ingestion and enrichment workers

**Decision:** keep feed acquisition and deeper AI enrichment in different services.

**Why:** RSS polling is I/O-bound and time-sensitive, while summarization and ranking are slower and dependent on external model/search APIs. Separate processes prevent enrichment latency from blocking discovery of new articles.

**Trade-off:** both workers currently coordinate through database state and polling. A durable message broker would offer stronger back-pressure and retry semantics at higher operational cost.

## LLM as an enrichment layer

**Decision:** use GigaChat to add categories and summaries, while PostgreSQL remains the system of record.

**Why:** an LLM is effective for semantic interpretation but can be unavailable or return unexpected text. Constraining its output to a known taxonomy and providing a fallback protects downstream consumers.

**Trade-off:** model output still requires evaluation and monitoring. A production system should version prompts, record model metadata, and maintain an offline quality dataset.

## Versioned migrations before application startup

**Decision:** run yoyo migrations as a one-shot dependency before backend and workers.

**Why:** explicit, ordered migrations make schema changes reviewable and repeatable. Services do not need to race to create shared structures at startup.

**Trade-off:** the Flask application currently retains `db.create_all()` for compatibility. The target state is to make migrations the only schema authority once all tables are represented by versioned migrations.

## PostgreSQL and pgvector

**Decision:** use PostgreSQL now and a pgvector-capable image for the semantic-search roadmap.

**Why:** relational constraints suit normalized article metadata, while pgvector allows embeddings and similarity search to live beside transactional data.

**Trade-off:** the current schema does not yet store embeddings. The image communicates and enables the evolution path; adding vectors must be done through a migration with an embedding-version strategy.

## Reproducible dependencies

**Decision:** build services from Dockerfiles and committed Poetry/npm lock files.

**Why:** developers and CI resolve the same dependency graph rather than relying on workstation state.

**Trade-off:** image builds are currently optimized for clarity, not minimum size. Multi-stage builds and dependency-cache improvements are future work.
