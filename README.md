# Support Ticket Management System
[![Frontend CI](https://github.com/wahib-bachoua/Support-Ticket-Management-Frontend/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/wahib-bachoua/Support-Ticket-Management-Frontend/actions/workflows/ci.yml)
[![Backend CI](https://github.com/wahib-bachoua/Support-Ticket-Management-System/actions/workflows/ci.yml/badge.svg)](https://github.com/wahib-bachoua/Support-Ticket-Management-System/actions/workflows/ci.yml)

---

## 🏗️ Architecture du Projet

Ce projet utilise une architecture découplée. Ce dépôt concerne uniquement le **Frontend**. 

* **Dépôt Frontend :** `C'est ce dépôt` (Angular 19)
* **Dépôt Backend :** [Accéder au Repository Backend 🔗](https://github.com/wahib-bachoua/Support-Ticket-Management-System.git) (API GraphQL & Base de données)

This Frontend is built with Angular using standalone components. It provides a platform for managing support tickets efficiently, with features like ticket categorization, priority management, and user authentication.

## Features

- **Dashboard**: Overview of ticket statistics categorized by priority and type.
- **Authentication**: Secure login and session management.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Error Handling**: Graceful handling of API errors and user feedback.

## Additional Features

- **Role-Based Access Control**: Different user roles (Admin, Agent, Teacher) with specific permissions.
- **Ticket Management**: Create, update, and track the status of support tickets.
- **Priority and Status Badges**: Visual indicators for ticket priority and status.
- **User Management**: Admins can manage user accounts and roles.

## Architecture du frontend

This project leverages Angular's **standalone components** for a modular and simplified architecture. Key differences include:

- No `app.module.ts`. Instead, routes are defined in `app.routes.ts`.
- Components, directives, and pipes are self-contained and can be imported directly.

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/wahib-git/Support-Ticket-Management-Frontend.git
   ```
2. Navigate to the project directory:
   ```bash
   cd SupportTicketManagement
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   ng serve
   ```
   Navigate to `http://localhost:4200/` in your browser.

## File Structure

- `src/app/features/admin/dashboard/`: Contains the `DashboardComponent` for ticket statistics.
- `src/app/core/services/`: Services for API communication.
- `src/app/core/models/`: Type definitions and interfaces.

## Key Components

- **DashboardComponent**: Displays ticket statistics and integrates the .
- **LoadingSpinnerComponent**: Provides a visual indicator during data loading.

## Technologies Used

- **Angular**: Frontend framework.
- **TypeScript**: Programming language.
- **RxJS**: Reactive programming library.
- **SCSS**: Styling.

## How to Run Tests

### Unit & Integration Tests

Run all unit and integration tests using:

```bash
ng test
```

This will launch the Angular test runner (Karma) and execute all `.spec.ts` files.

### End-to-End (E2E) Tests with Cypress

Run E2E tests using:

```bash
npm run e2e
```

This will open the Cypress test runner. Select a test to run in the Cypress UI, or run headless with:

```bash
npx cypress run
```

Make sure your Angular app is running (`ng serve`) before running E2E tests.

## Required Dependencies for Testing

Before running tests, make sure you have installed the following:

- **Angular CLI**
  ```bash
  npm install -g @angular/cli
  ```
- **Project dependencies**
  ```bash
  npm install
  ```
- **Cypress (for E2E tests)**  
  Cypress is already listed in `devDependencies`. If not installed, run:
  ```bash
  npm install cypress --save-dev
  ```

All other dependencies are managed via `package.json`.  
If you add new test libraries, install them with `npm install <package> --save-dev`.

## Contribution Guidelines

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes with clear messages.
4. Submit a pull request.

For detailed guidelines, refer to `CONTRIBUTING.md` (if available).

## Support

For any issues or questions, please open an issue in the [GitHub repository](https://github.com/wahib-git/Support-Ticket-Management-Frontend/issues).
