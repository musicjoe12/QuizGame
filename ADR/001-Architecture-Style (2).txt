# ADR 001: Architecture Style

## Status
Accepted

## Context
The project aims to combine an interactive Unity-based game with a real-time, responsive React frontend and a Node.js backend. To support scalability and clear separation of concerns, a **modular microservice-like monolith** architecture was selected (Fowler, 2015).

Alternative options considered:
1. **Monolithic Architecture** – Simpler, but risked tight coupling and was harder to manage different technology stacks like Unity, React, and Node.js.
2. **Microservices** – Overkill for the current scale; introduces high complexity in deployment and communication (Newman, 2019).

## Decision
Use a **modular monolith** architecture:
- Frontend (React) handles the dynamic UI and quiz experience.
- Unity WebGL is embedded separately and communicates via session IDs and backend endpoints.
- Node.js backend manages APIs, SSE streams, and connects to MongoDB Atlas for data persistence.

## Consequences
✅ Easy integration between systems  
✅ Backend remains light and loosely coupled  
⚠️ Must manage communication between Unity and React carefully

## References
Fowler, M. (2015). *Monolith First*. martinfowler.com. https://martinfowler.com/bliki/MonolithFirst.html  
Newman, S. (2019). *Building Microservices (2nd ed.)*. O’Reilly Media.
