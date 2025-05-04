
### Technical Documentation: User Management Dashboard Application

#### Overview
The User Management Dashboard is a full-stack web application designed to manage users through a modern, responsive interface. The frontend is built with Next.js and React, featuring a dark theme with glassmorphism effects, modals for user actions, and filtering capabilities. The backend is a GraphQL API powered by Apollo Server and Express, using MongoDB for data persistence. The application supports role-based access control, allowing Admins to add, edit, and delete users, while Users can only search and filter. The frontend communicates with the backend via GraphQL queries and mutations, ensuring a seamless user management experience.

---

### Frontend Documentation

#### Architecture
The frontend is a Next.js application using React for component-based development. It leverages Apollo Client for GraphQL communication, Tailwind CSS for styling, and various libraries for enhanced functionality (e.g., modals, animations, form handling). The application follows a component-based architecture, with the main dashboard page orchestrating reusable components. It uses TypeScript for type safety and includes tools for linting and state management.

#### File Structure
- **app/**:
  - **dashboard/**:
    - **page.tsx**: The main dashboard page, rendering the user management interface.
  - **login/**:
    - **page.tsx**: The login page for user authentication.
  - **signup/**:
    - **page.tsx**: The signup page for user registration.
  - **favicon.ico**: The favicon for the application.
  - **globals.css**: Global CSS styles, including Tailwind CSS imports.
  - **layout.tsx**: The root layout component for the application.
  - **page.tsx**: The default homepage (if any).
- **components/**:
  - **ui/**:
    - **ErrorBoundary.tsx**: A component for error handling and fallback UI.
    - **LoadingSpinner.tsx**: A loading spinner component for asynchronous operations.
    - **Pagination.tsx**: A component for navigating paginated user data.
    - **ProtectedRoute.tsx**: A component to restrict access to authenticated users.
    - **SearchBar.tsx**: A component for searching users by name or email.
    - **ShowToast.tsx**: A component for displaying toast notifications.
    - **UseForm.tsx**: A form component for adding or editing users (likely a typo, should be `UserForm.tsx`).
    - **UseTable.tsx**: A table component for displaying user data (likely a typo, should be `UserTable.tsx`).
- **hooks/**:
  - **useAuth.ts**: A custom hook for managing user authentication.
  - **useExportUsers.ts**: A custom hook for exporting user data.
  - **useUsers.ts**: A custom hook for fetching user data via GraphQL.
- **lib/**:
  - **apollo.ts**: Apollo Client configuration for GraphQL communication.
  - **auth.ts**: Authentication utilities (e.g., token management).
  - **queries.ts**: GraphQL queries and mutations for user operations.
- **node_modules/**: Dependencies installed via npm.
- **public/**: Static assets (e.g., images, fonts).
- **types/**:
  - **index.ts**: TypeScript type definitions for the application.
- **.env.local**: Environment variables for local development.
- **.gitignore**: Git ignore file for excluding files from version control.
- **eslint.config.mjs**: ESLint configuration for linting.
- **next-env.d.ts**: TypeScript definitions for Next.js.
- **next.config.ts**: Next.js configuration file.
- **package-lock.json**: Lockfile for dependency versions.
- **package.json**: Project metadata and dependencies.
- **postcss.config.js**: PostCSS configuration for Tailwind CSS.
- **README.md**: Project documentation and setup instructions.
- **tailwind.config.js**: Tailwind CSS configuration.
- **tsconfig.json**: TypeScript configuration.

#### Dependencies
- **Production Dependencies**:
  - `@apollo/client`: For GraphQL queries and mutations.
  - `@headlessui/react`: For modal dialogs.
  - `@tanstack/react-query`: For state management and data fetching (though not used in the current implementation).
  - `dotenv`: For managing environment variables.
  - `framer-motion`: For animations.
  - `graphql`: Core GraphQL library.
  - `jsonwebtoken` and `jwt-decode`: For handling JWT authentication.
  - `next`: Framework for server-side rendering and routing.
  - `react` and `react-dom`: Core libraries for building UI components.
  - `react-hook-form`: For form handling and validation.
  - `react-toastify`: For displaying toast notifications.
  - `use-debounce`: For debouncing search input.
  - `zod`: For schema validation.
- **Development Dependencies**:
  - `@eslint/eslintrc` and `eslint`: For linting.
  - `@tailwindcss/postcss`, `autoprefixer`, `postcss`, `tailwindcss`: For styling with Tailwind CSS.
  - `@types/jsonwebtoken`, `@types/node`, `@types/react`, `@types/react-dom`: TypeScript type definitions.
  - `eslint-config-next`: ESLint configuration for Next.js.
  - `typescript`: For type safety.

#### Setup Instructions
1. **Install Dependencies**:
   - Navigate to the `frontend` directory and run the command to install all dependencies listed in `package.json`.
2. **Configure Environment Variables**:
   - Create a `.env.local` file in the root directory.
   - Add the GraphQL API URL (e.g., `NEXT_PUBLIC_GRAPHQL_URL=http://localhost:5000/graphql`).
3. **Configure Tailwind CSS**:
   - Ensure the `tailwind.config.js` file includes the content paths for the `app` and `components` directories to enable Tailwind CSS processing.
4. **Run the Application**:
   - Start the development server using the command `npm run dev`, which uses Next.js Turbopack for faster development.
   - Access the application at `http://localhost:3000/dashboard`.

#### Component Details

##### 1. Dashboard (app/dashboard/page.tsx)
**Purpose**: The main entry point for the user management interface, orchestrating all components and managing state for pagination, filtering, and modals.

**Functionality**:
- Renders a navigation bar (assumed to exist) at the top of the page.
- Displays a filter bar with a search input, role/status dropdowns, and action buttons ("New User" for Admins, "Export").
- Shows a table of users with pagination controls at the bottom.
- Opens modals for adding or editing users (Admin-only).
- Implements permission-based access using the `useAuth` hook to determine the logged-in user’s role.
- Manages state for the current page, search query, role/status filters, and modal visibility.
- Normalizes user data by providing default values for optional fields (e.g., location, joined date).

**State**:
- Current page number for pagination.
- Search query for filtering users by name/email.
- Role filter (e.g., "Admin", "Contributor", "Viewer").
- Status filter (e.g., "active", "inactive").
- Boolean flags for controlling the visibility of "Add User" and "Edit User" modals.
- Selected user for editing in the modal.

**Dependencies**:
- SearchBar, Pagination, UserForm (likely `UseForm.tsx`), UserTable (likely `UseTable.tsx`) components.
- useUsers and useAuth hooks.
- @headlessui/react for modals, framer-motion for animations, ErrorBoundary for error handling.

##### 2. SearchBar (components/ui/SearchBar.tsx)
**Purpose**: Provides a search input for filtering users by name or email.

**Functionality**:
- Renders a single input field styled with glassmorphism effects (translucent background, blurred backdrop, reflective border).
- Captures user input and submits the search query via a callback function.
- Animates the input field on render using a fade-in and slide-up effect.
- Likely uses the `use-debounce` library to debounce search input for performance optimization.

**Props**:
- onSearch: A callback function to handle the search query.

**Dependencies**:
- framer-motion for animations.
- use-debounce for debouncing search input.

##### 3. Pagination (components/ui/Pagination.tsx)
**Purpose**: Enables navigation through paginated user data.

**Functionality**:
- Displays a series of page number buttons with navigation arrows for previous and next pages.
- Highlights the current page with an orange background.
- Disables navigation arrows when at the first or last page.
- Applies glassmorphism styling to buttons (translucent, blurred, reflective).
- Animates the pagination bar on render with a fade-in effect.

**Props**:
- currentPage: The current page number.
- totalPages: The total number of pages.
- onPageChange: A callback function to handle page changes.

**Dependencies**:
- framer-motion for animations.

##### 4. UserForm (components/ui/UseForm.tsx)
**Purpose**: A form for adding or editing users, rendered within modals.

**Functionality**:
- Supports both adding new users and editing existing ones based on the presence of a user prop.
- Includes fields for name, email, password (for new users only), location, role, and status.
- Validates form inputs (e.g., required fields, email format) using `react-hook-form` and possibly `zod` for schema validation.
- Submits form data via GraphQL mutations to create or update users.
- Refetches user data after successful submission to update the table.
- Uses glassmorphism styling for form elements (translucent inputs, blurred backdrop, reflective borders).
- Restricts access to authenticated users via the `useAuth` hook.
- Animates the form on render with a fade-in and slide-up effect.
- Displays toast notifications for success or error messages using `react-toastify`.

**Props**:
- user: An optional user object for editing (if provided, switches to edit mode).
- onSuccess: A callback function to close the modal after successful submission.

**Dependencies**:
- @apollo/client for GraphQL mutations.
- react-hook-form for form handling and validation.
- zod for schema validation.
- framer-motion for animations.
- useAuth for authentication.
- react-toastify for notifications.

##### 5. UserTable (components/ui/UseTable.tsx)
**Purpose**: Displays a table of users with actions for Admins.

**Functionality**:
- Renders a table with columns: Checkbox, Full Name, Email Address, Location, Joined, Permissions, and Actions (Admin-only).
- Displays a circular avatar placeholder next to each user’s name.
- Shows role badges with colors: red for Admin, blue for Contributor, gray for Viewer.
- Provides Edit and Delete actions for Admins, with Edit opening a modal and Delete triggering a GraphQL mutation.
- Applies glassmorphism styling to the table (translucent background, blurred backdrop, reflective border).
- Animates table rows on render with a fade-in and slide-up effect.
- Uses the `useAuth` hook to determine the logged-in user’s role and show/hide actions.

**Props**:
- users: An array of user objects to display.
- onEdit: A callback function to open the edit modal for a user.

**Dependencies**:
- @apollo/client for GraphQL mutations.
- framer-motion for animations.
- useAuth for authentication.

#### Styling
- **Theme**: The application uses a dark theme with a gray background (`bg-gray-900`) and white text.
- **Glassmorphism**: Applied to the table, modals, and form elements using a translucent background (`bg-white/3`), blurred backdrop (`backdrop-blur-2xl`), white border with 10% opacity (`border-white/10`), and a reflective inner shadow.
- **Colors**:
  - Green (`green-400`, `green-500`): Used for form focus states, buttons, and avatars.
  - Orange (`orange-500`): Used for the "New User" button and pagination highlights.
  - Role Badges: Red for Admin, Blue for Contributor, Gray for Viewer.
- **Typography**: Uses Tailwind’s default font sizes (e.g., `text-3xl` for headings, `text-sm` for labels).

#### Permissions
- **Admin Role**: Can add new users, edit existing users, delete users, and set roles/status.
- **User Role**: Can only search and filter users; add/edit/delete actions are hidden.

#### Authentication
- Uses the `useAuth` hook to manage user authentication.
- Likely integrates with JWT tokens via `jsonwebtoken` and `jwt-decode` for token handling.
- The `ProtectedRoute` component ensures that only authenticated users can access the dashboard.

#### Error Handling
- **Loading State**: Displays a loading spinner (via `LoadingSpinner`) in the table while fetching user data.
- **Error State**: Shows an error message in red if the GraphQL query fails, wrapped by the `ErrorBoundary` component.
- **Empty State**: Displays "No users found" if no users match the filters.
- **Form Errors**: Shows validation errors below form fields and API errors via toast notifications.

---

### Backend Documentation

#### Architecture
The backend is a GraphQL API built with Apollo Server and Express, using MongoDB as the database. It provides endpoints for querying and mutating user data, with middleware for authentication and error handling. The API is secured with JWT-based authentication and role-based access control, restricting mutations to Admin users while allowing all authenticated users to query data. TypeScript is used for type safety, and `nodemon` is used for development with automatic restarts.

#### File Structure
- **config/**:
  - **db.ts**: Database connection configuration for MongoDB.
- **graphql/**:
  - **resolvers/**:
    - **schema.ts**: Defines the GraphQL schema, including types, queries, and mutations.
  - **typeDefs.ts**: Additional type definitions for GraphQL (possibly redundant with `schema.ts`).
- **middleware/**:
  - **auth.ts**: Middleware for JWT authentication.
  - **validate.ts**: Middleware for request validation.
- **models/**:
  - **User.ts**: Mongoose schema and model for the User collection.
- **node_modules/**: Dependencies installed via npm.
- **utils/**:
  - **errorHandler.ts**: Utility for centralized error handling.
- **.env**: Environment variables for configuration.
- **.gitignore**: Git ignore file for excluding files from version control.
- **package-lock.json**: Lockfile for dependency versions.
- **package.json**: Project metadata and dependencies.
- **seed.ts**: Script for seeding the database with initial data.
- **server.ts**: Main entry point for the Express and Apollo Server setup.
- **tsconfig.json**: TypeScript configuration.

#### Dependencies
- **Production Dependencies**:
  - `@faker-js/faker`: For generating fake data ( used in `seed.ts`).
  - `apollo-server-express`: For building the GraphQL server with Express.
  - `bcryptjs`: For password hashing.
  - `cors`: For enabling CORS in Express.
  - `dotenv`: For managing environment variables.
  - `express`: Web framework for Node.js.
  - `graphql`: Core GraphQL library.
  - `jsonwebtoken`: For JWT authentication.
  - `mongoose`: For MongoDB object modeling.
  - `nodemon`: For automatic server restarts during development.
- **Development Dependencies**:
  - `@types/jsonwebtoken`, `@types/node`: TypeScript type definitions.
  - `ts-node`: For running TypeScript files directly.
  - `tsx`: For running TypeScript with ES modules.
  - `typescript`: For type safety.

#### Setup Instructions
1. **Install Dependencies**:
   - Navigate to the `backend` directory and run the command to install all dependencies listed in `package.json`.
2. **Configure Environment Variables**:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     - MongoDB connection string (e.g., `MONGO_URI=mongodb://localhost:27017/user-management`).
     - JWT secret (e.g., `JWT_SECRET=your-secret-key`).
     - Port number (e.g., `PORT=5000`).
3. **Set Up MongoDB**:
   - Ensure MongoDB is running locally or use a cloud service (e.g., MongoDB Atlas).
   - Update the `config/db.ts` file to connect to the MongoDB instance using the `MONGO_URI`.
4. **Seed the Database** (Optional):
   - Run the `seed.ts` script to populate the database with initial user data using `@faker-js/faker`.
5. **Run the Server**:
   - Start the development server using the command `npm run dev`, which uses `nodemon` for automatic restarts.
   - Alternatively, start the production server using `npm start`.
   - The server will run on `http://localhost:5000/graphql` (or the specified port).

#### Schema
The GraphQL schema defines the following:

**Types**:
- **User**: Represents a user with fields: id (ID), name (String), email (String), password (String, hashed), location (String, optional), joined (String, optional), role (String), status (String).
- **UserConnection**: A wrapper for paginated user data, with fields: users (array of User objects) and totalPages (Integer).

**Queries**:
- **users(page: Int!, limit: Int!, search: String)**: Retrieves a paginated list of users with optional search filtering by name or email.

**Mutations**:
- **createUser(input: UserInput!)**: Creates a new user (Admin-only).
- **updateUser(id: ID!, input: UserInput!)**: Updates an existing user (Admin-only).
- **deleteUser(id: ID!)**: Deletes a user (Admin-only).

**Inputs**:
- **UserInput**: Input type for creating/updating users, with fields: name (String), email (String), password (String, optional), location (String, optional), role (String), status (String).

#### Resolvers
The resolvers implement the logic for the GraphQL schema:

- **users Query**:
  - Queries the MongoDB database for users, applying search filtering (case-insensitive) on name and email if provided.
  - Paginates the filtered users based on the page and limit arguments.
  - Returns a UserConnection object with the paginated users and total number of pages.
  - Requires the user to be authenticated (throws an "Unauthorized" error if not).

- **createUser Mutation**:
  - Hashes the password using `bcryptjs` before saving.
  - Creates a new user in the MongoDB database with a generated ID and current timestamp for the joined date.
  - Restricted to Admin users (throws an "Unauthorized" error if the user is not an Admin).
  - Returns the created user object.

- **updateUser Mutation**:
  - Updates an existing user in the MongoDB database by ID with the provided input fields.
  - Restricted to Admin users (throws an "Unauthorized" error if the user is not an Admin).
  - Throws a "User not found" error if the user ID does not exist.
  - Returns the updated user object.

- **deleteUser Mutation**:
  - Deletes a user from the MongoDB database by ID.
  - Restricted to Admin users (throws an "Unauthorized" error if the user is not an Admin).
  - Throws a "User not found" error if the user ID does not exist.
  - Returns a boolean indicating success.

#### Database
The backend uses MongoDB as the database, with Mongoose for object modeling:
- **User Model**: Defined in `models/User.ts`, includes fields for id, name, email, password (hashed), location, joined, role, and status.
- **Connection**: Established in `config/db.ts` using Mongoose, connecting to the MongoDB instance specified in the `MONGO_URI` environment variable.
- **Seeding**: The `seed.ts` script uses `@faker-js/faker` to generate fake user data for testing purposes.

#### Security
- **Authentication**:
  - Uses JWT for authentication, implemented in `middleware/auth.ts`.
  - The middleware extracts the JWT from the Authorization header, verifies it using `jsonwebtoken`, and adds the user to the request context.
- **Authorization**:
  - Mutations (createUser, updateUser, deleteUser) are restricted to users with the "admin" role.
  - Queries are accessible to all authenticated users.
  - Unauthorized access results in an "Unauthorized" error.
- **Password Hashing**:
  - Passwords are hashed using `bcryptjs` before storage in the database.

#### Middleware
- **auth.ts**: Handles JWT authentication, verifying tokens and adding the user to the GraphQL context.
- **validate.ts**: Validates incoming requests (e.g., ensuring required fields are present, email format is valid).
- **errorHandler.ts**: Centralized error handling for consistent error responses.

#### Error Handling
- **Unauthorized Access**: Throws an "Unauthorized" error if the user is not authenticated or lacks the required role for mutations.
- **Not Found**: Throws a "User not found" error if a user ID does not exist during update or delete operations.
- **Validation**: Uses `validate.ts` middleware to enforce input validation (e.g., email format, required fields).
- **Database Errors**: Handled by `errorHandler.ts` to return consistent error messages.

#### Notes for Production
- Use a production-grade MongoDB instance (e.g., MongoDB Atlas) instead of a local database.
- Implement rate limiting and request logging for security and monitoring.
- Add additional validation for user inputs (e.g., password strength, unique email).
- Use a secure JWT secret and rotate it periodically.

---

### Integration Notes
- **Frontend-Backend Integration**:
  - The frontend uses Apollo Client to communicate with the GraphQL API at the endpoint `/graphql` (e.g., `http://localhost:5000/graphql`).
  - Apollo Client is configured in `lib/apollo.ts` and provided to the application via a root provider ( in `app/layout.tsx`).
  - The frontend sends JWT tokens in the Authorization header for authenticated requests, managed by `lib/auth.ts`.
- **Authentication Flow**:
  - Users log in via `app/login/page.tsx`, receiving a JWT token from the backend.
  - The token is stored (likely in local storage or cookies) and used for subsequent requests.
  - The `useAuth` hook retrieves the token and user data, ensuring protected routes like the dashboard are accessible only to authenticated users.
- **Testing**:
  - Test the frontend by running the Next.js development server and accessing the dashboard page.
  - Test the backend by running the Apollo Server and using the GraphQL playground to execute queries and mutations.
- **Environment Variables**:
  - Frontend: Configure `NEXT_PUBLIC_GRAPHQL_URL` in `.env.local`.
  - Backend: Configure `MONGO_URI`, `JWT_SECRET`, and `PORT` in `.env`.
