# Super Calculator

A web-accessible calculator with both **standard** and **scientific** modes, featuring 2-day calculation history retention.

## Project Overview

This project demonstrates full-stack development using a layered architecture. The calculator provides:
- Standard arithmetic operations
- Scientific functions (sin, cos, tan, log, ln, sqrt, pow, exp)
- Calculation history with 2-day retention
- Clean, modern web interface

## Architecture

The project follows a **layered architecture**:
- **Interface/API**: Frontend web interface (HTML/CSS/JS)
- **Application Services**: Backend API (Express.js)
- **Domain/Core**: Pure calculator engine functions
- **Infrastructure**: SQLite database for history storage

See `docs/01_architecture.md` for detailed architecture documentation.

## Folder Structure

```
src/
├── core/              # Domain logic, pure functions
├── services/          # Orchestration, transaction boundaries
├── modules/           # Feature-bounded code (API endpoints)
├── infrastructure/    # DB adapters, external APIs
└── utils/             # Stateless helper functions

public/                # Frontend static files
docs/                  # Project documentation
```

See `docs/03_folder_structure.md` for detailed structure rules.

## Prerequisites

- Node.js >= 14.0.0
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd SuperCalculator
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The calculator will be available at `http://localhost:3000`

## Usage

1. **Standard Mode**: Basic arithmetic operations (+, -, *, /) with parentheses support
2. **Scientific Mode**: Additional scientific functions (sin, cos, tan, log, ln, sqrt, pow, exp)
3. **History**: View recent calculations (last 2 days) in the history panel
4. Click on any history item to reuse that calculation

## API Endpoints

- `POST /api/calculate` - Perform standard calculation
- `POST /api/calculate/scientific` - Perform scientific calculation
- `GET /api/history` - Get calculation history
- `POST /api/history/cleanup` - Clean up old calculations

## Development

### Coding Standards

- camelCase for variables
- PascalCase for classes
- kebab-case for files
- Single responsibility functions
- No logs in core layer
- Public functions documented

See `docs/02_coding_standards.md` for complete standards.

### Change Management

- Update documentation first if behavior changes
- One logical change per commit
- Update CHANGELOG for user-visible changes

See `docs/04_change_management.md` for change management rules.

## Documentation

All project documentation is in the `docs/` folder:
- `00_project_overview.md` - Project purpose and scope
- `01_architecture.md` - Architecture definition
- `02_coding_standards.md` - Coding standards
- `03_folder_structure.md` - Folder structure rules
- `04_change_management.md` - Change management process

## License

MIT
