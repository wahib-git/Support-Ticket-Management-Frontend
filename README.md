# Support Ticket Management System

This project is a **Support Ticket Management System** built with Angular using standalone components. It provides a platform for managing support tickets efficiently, with features like ticket categorization, priority management, and user authentication.

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

## Architecture

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

## Testing

### Unit Tests

Run the following command to execute unit tests:

```bash
ng test
```

### End-to-End Tests

Run the following command to execute end-to-end tests:

```bash
ng e2e
```

Ensure that the required testing dependencies are installed before running the tests.

## Contribution Guidelines

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes with clear messages.
4. Submit a pull request.

For detailed guidelines, refer to `CONTRIBUTING.md` (if available).

## Support

For any issues or questions, please open an issue in the [GitHub repository](https://github.com/wahib-git/Support-Ticket-Management-Frontend/issues).
