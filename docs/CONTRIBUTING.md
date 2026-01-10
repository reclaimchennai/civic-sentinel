# Contributing to Chennai Civic Sentinel

We welcome contributions! Please follow these guidelines to ensure a smooth workflow.

## Getting Started

1.  **Fork** the repository.
2.  **Clone** your fork locally.
3.  **Install Dependencies:**
    ```bash
    npm install
    ```
4.  **Set up Environment:**
    - Copy `.env.example` to `.env` (if available) or refer to `README.md` for required keys.
    - Start Docker services: `docker-compose up -d`.

## Development Workflow

1.  **Create a Branch:**
    Always create a feature branch from `main`.
    ```bash
    git checkout -b feature/my-new-feature
    ```
2.  **Coding Standards:**
    - Use **TypeScript** for all new code.
    - Use **Tailwind CSS** for styling.
    - Follow **Shadcn UI** patterns for components.
    - Ensure `eslint` passes.
3.  **Committing:**
    - We use **Semantic Commit Messages**:
        - `feat: ...` for new features.
        - `fix: ...` for bug fixes.
        - `docs: ...` for documentation.
        - `style: ...` for formatting.
        - `refactor: ...` for code restructuring.
    - **Sign your commits** (GPG) if possible.
4.  **Push & PR:**
    - Push to your fork.
    - Open a Pull Request against `main`.
    - Ensure CI checks (Secret Scan, Linting) pass.

## Branch Protection
The `main` branch is protected.
- Direct pushes are disabled.
- PRs require at least **1 approval**.
- **Secret Scanning** is enforced.

## Documentation
If you add a new feature or API endpoint, please update the relevant file in the `docs/` folder:
- New Component/Flow -> `docs/ARCHITECTURE.md`
- New Endpoint -> `docs/API.md`
- DB Change -> `docs/DATABASE.md`
