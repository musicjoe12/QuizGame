# ADR 004: Data Communication Pattern

**Status:** Accepted  
**Date:** 2025-04-10

## Context
The backend needed to notify the frontend of game results in real time, so the quiz could be presented instantly after a Unity game spin. The communication had to be lightweight, persistent, and browser-compatible.

## Decision
We used **Server-Sent Events (SSE)**:
- One-way data flow from backend to frontend
- React listens via EventSource
- Backend pushes JSON-encoded quiz triggers
This reduced complexity compared to WebSockets and worked natively with browsers (Tilkov & Vinoski, 2010).

## Alternatives Considered

### 1. WebSockets
**Pros:**
- Full-duplex communication
- Flexible

**Cons:**
- Overhead for bidirectional flow (not needed here)
- Complex state handling

### 2. Polling via Axios
**Pros:**
- Very simple
- Works everywhere

**Cons:**
- Wasteful on bandwidth and CPU
- Not truly real time

## Consequences
SSE was easy to implement with Node.js streams and avoided reconnect logic. It matched our need for one-way real-time updates with minimal setup.

## References
Tilkov, S., & Vinoski, S. (2010). Node.js: Using JavaScript to Build High-Performance Network Programs. *IEEE Internet Computing*, 14(6), 80–83.
