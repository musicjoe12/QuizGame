# ADR 001: Architecture Style

## Status
Accepted

## Context
The project involves integrating a real-time game built in Unity with a quiz system built in React, communicating via a Node.js backend and MongoDB Atlas database. Due to the interconnected nature of these components and the need for scalable yet manageable deployment, a **modular monolith** architecture was evaluated against a microservices architecture and a classic monolithic structure (Fowler, 2015).

## Decision
A modular monolith architecture was selected:
- **Frontend**: React handles dynamic UI and quiz interaction
- **Game engine**: Unity WebGL build hosted within the public directory of React
- **Backend**: Node.js with Express manages API routes and SSE event streams
- **Database**: MongoDB Atlas stores quiz data and user points

This design supports component separation and independent iteration without the overhead of managing full microservices.

## Alternatives Considered
1. **Monolithic Architecture**: A single codebase combining backend, frontend, and game logic.
2. **Microservices**: Fully independent services for each layer (React, Unity, backend, database).

## Pros and Cons of the Alternatives

| Architecture        | Pros                                         | Cons                                                  |
|---------------------|----------------------------------------------|--------------------------------------------------------|
| Monolithic          | Simple to deploy, fewer moving parts         | Difficult to manage React and Unity in one build       |
| Microservices       | High scalability and independence             | Overhead in deployment, orchestration, and comms       |
| Modular Monolith ✅ | Balanced control, easier integration          | Slightly harder to decouple at extreme scale           |

## Justification
A modular monolith provides the best trade-off between maintainability, testability, and development velocity. It avoids overengineering while still respecting technological boundaries between Unity, React, and Node.js.

## References
Fowler, M. (2015). *Monolith First*. https://martinfowler.com/bliki/MonolithFirst.html  
Newman, S. (2019). *Building Microservices* (2nd ed.). O’Reilly Media.
