# ADR 004: Data Sync and Real-Time Communication

## Status
Accepted

## Context
The system required pushing game results from Unity → Node.js → React. Once the wheel stops spinning, a quiz must appear immediately for the user to engage in.

## Decision
Use **Server-Sent Events (SSE)**:
- Unity POSTs result to backend
- Node.js emits the result using SSE to React via sessionId
- React subscribes with `EventSource`

## Alternatives Considered
1. **WebSockets**: Two-way communication but heavier to manage
2. **Polling**: Periodic check from React for new data

## Pros and Cons of the Alternatives

| Method         | Pros                                         | Cons                                                  |
|----------------|-----------------------------------------------|--------------------------------------------------------|
| WebSockets     | Bi-directional, high interactivity           | Overkill for one-way updates, more setup (Lalwani, 2021) |
| Polling        | Simple                                        | High latency, inefficient                             |
| SSE ✅          | Lightweight, simple to stream Unity → React   | One-directional only                                  |

## Justification
SSE matched the need for one-way, push-based communication without complex setup. Since only the backend pushes updates, it was ideal.

## References
Lalwani, R. (2021). *WebSockets vs SSE: Which one to use?* DEV Community.  
Mozilla Developer Network. (2023). *Server-Sent Events (SSE)*. https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
