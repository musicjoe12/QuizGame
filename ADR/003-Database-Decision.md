# ADR 003: Database Decision

**Status:** Accepted  
**Date:** 2025-04-10

## Context
The system stores structured quiz data, user points, and session-specific results. Flexibility in schema and easy cloud deployment were important considerations.

## Decision
We selected **MongoDB Atlas** as our database solution due to:
- Schema-less design fitting varied quiz formats
- Excellent integration with Node.js
- Free-tier cloud hosting with Atlas
- Native support for document-style data (Chodorow, 2013)

## Alternatives Considered

### 1. PostgreSQL
**Pros:**
- Strong ACID compliance
- Mature relational features

**Cons:**
- Rigid schema may slow iteration
- Joins not needed in this use case

### 2. Firebase Realtime DB
**Pros:**
- Native real-time syncing
- Serverless backend

**Cons:**
- Less flexibility with structured queries
- Vendor lock-in risks

## Consequences
MongoDB enabled rapid prototyping of quizzes and dynamic updates via PUT requests. JSON compatibility also reduced transform logic across frontend/backend.

## References
Chodorow, K. (2013). *MongoDB: The Definitive Guide*. O'Reilly Media.
