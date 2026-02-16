# Architecture Definition

## 1. Architectural Style
The system uses a **layered architecture** to separate concerns between the user interface, application logic, core calculator engine, and infrastructure. This keeps the calculator simple, modular, and maintainable, while making it easy to deploy for public use.

## 2. Logical Layers
- **Interface / API:** The frontend web interface handles user input, displays results, toggles between standard and scientific modes, and shows recent calculation history. Implemented with HTML/CSS/JS or optionally React.  
- **Application Services:** Backend API receives requests from the frontend, orchestrates calculation execution, and manages temporary history storage. Implemented in Node.js, Python Flask, or FastAPI.  
- **Domain / Core:** The calculator engine performs all standard and scientific calculations accurately and handles history retention for up to 2 days. This layer contains all business logic.  
- **Infrastructure:** Temporary data store (SQLite, JSON, or in-memory) persists calculation history for 2 days. Deployment layer uses Neon, Vercel, Netlify, or GitHub Pages. CI/CD is managed via Git/GitHub.

## 3. Data Flow
User input from the frontend is sent to the backend API. The application service forwards the request to the domain/core calculator engine, which computes the result. The result is stored in the temporary data store for history retention. The backend responds to the frontend with the calculation result and updated history, which is then displayed to the user.

## 4. External Dependencies
The system depends on a temporary data store (SQLite, JSON, or in-memory) for history retention. There are no external APIs or message brokers at this stage. Future integrations with external services are possible but not required for the MVP.

## 5. Dependency Rules
Dependencies flow strictly downward: Interface → Application Services → Domain/Core → Infrastructure. Forbidden patterns include putting business logic in the frontend or API controllers, direct database access in the core/domain layer, or cross-module coupling that violates layer separation.

## 6. Anti-Patterns (Explicitly Forbidden)
- Business logic in controllers (frontend or backend API handlers)  
- Database access directly in core/domain layer  
- Cross-module coupling that breaks the layered structure  

### Notes
The calculator should resemble the Windows calculator in simplicity, offering only standard and scientific modes. The system is lightweight, modular, and designed for public deployment using Neon or other hosting platforms. History retention is limited to 2 days, and no personal information is collected.
