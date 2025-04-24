# ADR 002: Tech Stack Decision

**Status:** Accepted  
**Date:** 2025-04-10

## Context
The application needed to provide a real-time, gamified learning experience across web platforms. The stack had to support WebGL, frontend interactivity, REST APIs, and real-time server communication.

## Decision
We chose the following stack:
- **Frontend:** React.js with Ant Design and Material UI
- **Game Engine:** Unity, exported as WebGL
- **Backend:** Node.js with Express
- **Database:** MongoDB Atlas
- **Hosting:** Render (backend), Netlify (frontend)

This combination provided strong documentation, rapid prototyping, and compatibility with open web standards (Grinberg, 2018; Unity Technologies, 2024).

## Alternatives Considered

### 1. Angular or Vue.js for Frontend
**Pros:**
- Strong ecosystems
- Two-way data binding (Vue)

**Cons:**
- Learning curve and heavier build tools
- Less community support for WebGL hosting in Angular

### 2. Firebase as Backend
**Pros:**
- Real-time database and auth
- Serverless functions

**Cons:**
- Limited control over backend logic
- Less transparent data streaming (compared to SSE)

## Consequences
The chosen stack enabled:
- Real-time quiz updates
- Easy session management
- Smooth Unity integration
- Fast UI prototyping

## References
Grinberg, M. (2018). *Flask Web Development*. O'Reilly Media.  
Unity Technologies. (2024). *Unity Manual: WebGL Deployment*. Retrieved from https://docs.unity3d.com
