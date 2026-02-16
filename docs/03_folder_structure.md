# Folder Structure Rules

## src/core
- Domain logic only
- Pure functions where possible
- No framework imports

## src/services
- Orchestration
- Transaction boundaries

## src/modules
- Feature-bounded code
- One module = one responsibility

## src/infrastructure
- DB adapters
- External APIs
- Messaging

## src/utils
- Stateless helpers only
- No business logic

RULES:
- No circular dependencies
- Max file size: 300 lines
- One public responsibility per file
