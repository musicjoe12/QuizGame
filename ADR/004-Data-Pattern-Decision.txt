# ADR 004: Data Sync and Pattern Choice

## Status
Accepted

## Context
The system had to reflect real-time state changes:
- Unity → React: when a wheel spin result is available
- React → Backend → DB: for quiz completion and score updates

Alternatives considered:
1. **WebSockets** – Full-duplex, but more complex setup (Lalwani, 2021).
2. **Polling** – Inefficient and resource-heavy.

## Decision
Use **Server-Sent Events (SSE)** for React to subscribe to `/api/result-stream?sessionId=xxx`.  
Unity POSTs data to the backend, which pushes it forward via SSE to React.  
React uses Axios for PUT requests to update MongoDB.

## Consequences
✅ Lightweight real-time updates  
✅ Simple to implement with Express  
⚠️ SSE is one-directional – cannot be used for user-initiated sync

## References
Lalwani, R. (2021). *WebSockets vs SSE: Which one to use?* DEV Community.  
Mozilla Developer Network. (2023). *Server-Sent Events (SSE)*. https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
