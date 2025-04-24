# ADR 003: Database Selection

## Status
Accepted

## Context
The application required storing:
- Multiple quizzes with nested questions and answer types
- Player progress and points across sessions
- Minimal authentication overhead

Alternatives considered:
1. **PostgreSQL** – Excellent for relational data but less intuitive for nested JSON (Momjian, 2020).
2. **Firebase Realtime DB** – Real-time, but less control over querying and data structure (Moroney, 2017).

## Decision
Use **MongoDB Atlas**:
- Supports JSON-like documents, ideal for nested quiz structures.
- Easy integration with Node.js and Mongoose ORM.
- Cloud-hosted, auto-scaled, and deployable via Render.

## Consequences
✅ Flexible for different quiz formats  
✅ Easy to scale with cloud hosting  
⚠️ Limited support for complex relationships

## References
Momjian, B. (2020). *PostgreSQL: Introduction and Concepts*. Addison-Wesley.  
Moroney, L. (2017). *The Firebase Book*. Leanpub.
