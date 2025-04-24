# ADR 002: Tech Stack Selection

## Status
Accepted

## Context
The frontend needed to be dynamic, responsive, and capable of real-time updates. The game element was best suited to Unity for visual fidelity. The backend required a lightweight, scalable solution that could handle real-time communication and session-based logic.

Alternatives:
1. **Angular** – Too heavy for a lightweight quiz game; steeper learning curve (Rouse, 2020).
2. **Vue.js** – Suitable, but less mature for advanced component libraries compared to React (Gackenheimer, 2015).
3. **Firebase** – Easy real-time updates, but less control over data structure and SSE support (Moroney, 2017).

## Decision
- **React** for frontend – rich component ecosystem (Material UI, AntD), easy state handling.
- **Unity (WebGL)** for the game – allows fast visual iteration and professional polish.
- **Node.js + Express** for the backend – fast to deploy, easy JSON handling.
- **SSE** over WebSockets for real-time updates – simpler for one-way streaming (Raymond, 2021).

## Consequences
✅ Smooth integration between diverse tools  
✅ Real-time communication via SSE  
⚠️ WebGL requires precise memory management on export

## References
Rouse, M. (2020). *Angular vs. React: What's the Difference?* TechTarget.  
Gackenheimer, C. (2015). *Introduction to Vue.js*. Apress.  
Moroney, L. (2017). *The Firebase Book*. Leanpub.  
Raymond, E. (2021). *Server-Sent Events (SSE) Overview*. Mozilla Developer Network.
