# ADR 002: Tech Stack Selection

## Status
Accepted

## Context
The project required technologies that support dynamic interfaces, real-time updates, high interactivity (game engine), and lightweight deployment. Choices were guided by developer familiarity, ecosystem support, and frontend–backend communication requirements.

## Decision
- **Frontend**: React + Material UI + Ant Design for responsiveness and UI flexibility
- **Game Engine**: Unity (WebGL) for 3D visuals, animation control
- **Backend**: Node.js + Express for REST APIs and SSE
- **Real-time updates**: Server-Sent Events for backend → React one-way data flow

## Alternatives Considered
1. **Angular**: Robust but heavy and verbose
2. **Vue.js**: Lightweight but limited mature library support for complex components
3. **Firebase**: Full real-time stack, but lower backend control

## Pros and Cons of the Alternatives

| Stack            | Pros                                             | Cons                                                   |
|------------------|--------------------------------------------------|---------------------------------------------------------|
| Angular          | Structured, backed by Google                     | Heavy for small projects (Rouse, 2020)                  |
| Vue.js           | Lightweight, easy to learn                       | Weaker UI ecosystem (Gackenheimer, 2015)                |
| Firebase         | Real-time DB and auth integrated                 | Limited backend flexibility (Moroney, 2017)             |
| React + Unity ✅ | Best control, rich UI libraries, strong visuals  | Requires SSE integration and memory optimization        |

## Justification
React allowed for easy state management and fast UI prototyping. Unity ensured the game remained visually impressive. SSE fit the communication flow from backend → React without the need for complex WebSocket infrastructure.

## References
Rouse, M. (2020). Angular vs. React: What's the Difference? TechTarget.  
Gackenheimer, C. (2015). *Introduction to Vue.js*. Apress.  
Moroney, L. (2017). *The Firebase Book*. Leanpub.  
Raymond, E. (2021). *Server-Sent Events (SSE) Overview*. Mozilla Developer Network.
