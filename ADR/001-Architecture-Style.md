# ADR 001: Architecture Style

**Status:** Accepted  
**Date:** 2025-04-10

## Context
The project integrates a real-time quiz system with a Unity-based game for educational engagement. It needs to support modular frontend/backend development, real-time interactions, and scalable deployment. A suitable architectural pattern is essential to ensure maintainability, clear separation of concerns, and scalable evolution of components.

## Decision
We selected a **Three-Tier Architecture** composed of:

- **Presentation Layer:** React.js handles UI and real-time updates.
- **Application Layer:** Node.js/Express manages routing, API logic, and SSE communication.
- **Data Layer:** MongoDB stores user points, quiz data, and session mappings.

This separation ensures that each tier can evolve independently and simplifies debugging and testing across components (Fowler, 2002).

## Alternatives Considered

### 1. Monolithic Architecture
**Pros:**
- Simple to develop and deploy initially
- Fewer network calls

**Cons:**
- Difficult to scale individual components
- Harder to maintain and debug as complexity grows

### 2. Microservices
**Pros:**
- Highly scalable
- Independent deployments possible

**Cons:**
- Overhead of inter-service communication
- Increased deployment and testing complexity

## Consequences
The Three-Tier Architecture allowed clear modularity:
- The Unity/WebGL game lives in the presentation layer
- Backend logic processes game results and serves quizzes in real time
- MongoDB handles structured JSON data

This decision provided the right balance of scalability and simplicity for a student-led, time-constrained development cycle.

## References
Fowler, M. (2002). *Patterns of Enterprise Application Architecture*. Addison-Wesley.
