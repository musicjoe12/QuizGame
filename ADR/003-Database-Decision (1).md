# ADR 003: Database Selection

## Status
Accepted

## Context
Data stored included nested quizzes (with arrays of questions and choices), player sessions and points, and session history. The system required flexible schemas and easy querying.

## Decision
**MongoDB Atlas** was chosen:
- JSON-like structure fits quiz format
- Easy to scale with cloud hosting
- Integrates seamlessly with Node.js and Mongoose

## Alternatives Considered
1. **PostgreSQL**: Strong relational model, but not ideal for flexible nested structures
2. **Firebase Realtime DB**: Real-time sync but limited query complexity

## Pros and Cons of the Alternatives

| Database        | Pros                                          | Cons                                                 |
|------------------|-----------------------------------------------|-------------------------------------------------------|
| PostgreSQL       | ACID compliance, relational consistency       | Harder to manage flexible nested quiz formats         |
| Firebase         | Built-in real-time support                    | Poor indexing and querying for nested objects         |
| MongoDB Atlas ✅ | Schema-less, works naturally with Node/JSON   | Less robust for strict relationships                  |

## Justification
MongoDB’s document model aligned with the quiz structure. It offered developer speed and fit the flexible data needs of this project, especially when building quizzes dynamically.

## References
Momjian, B. (2020). *PostgreSQL: Introduction and Concepts*. Addison-Wesley.  
Moroney, L. (2017). *The Firebase Book*. Leanpub.
