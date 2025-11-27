# Budget Portal with MERN Stack

A comprehensive web application for managing budgets, programs, and users. This portal facilitates the tracking of financial programs, document management, and user administration with role-based access control.

## Features

*   **Role-Based Access Control:** Secure login and dashboard views for different user roles (Admin, Finance, User).
*   **Dashboard:** Visual overview of budget allocation and program status using interactive charts.
*   **Program Management:**
    *   Create, update, and track financial programs.
    *   **Status Workflow:** Programs move through various statuses: Draft -> Under Review -> Query/Query Answered -> Completed/Rejected.
    *   **Status Tracking:** Kanban-style board to monitor programs by status (Pending, Accepted, Rejected) with month navigation.
    *   **Program Deletion:** Users can securely delete their own programs while in 'Draft' status.
    *   **Query System:** Finance users can raise queries on programs. Users can reply to queries, and the entire conversation history is tracked.
    *   **Accept/Reject Workflow:** Finance users can formally accept (mark as Completed) or reject programs with remarks/reasons.
*   **Document Management:** Upload and manage documents associated with programs.
*   **User Management:** Admin tools to add and manage system users.
*   **Profile Management:** User profile updates including profile photo upload.
*   **Responsive Design:** Built with Tailwind CSS for a seamless experience across devices.

## Program Workflow

The application follows a structured workflow for program management, ensuring clear communication between Users and Finance/Admin roles.

1.  **Creation & Submission**
    *   **User** creates a program -> Status: **Draft**
    *   **User** submits the program -> Status: **Under Review**

2.  **Review Process**
    *   **Finance/Admin** reviews the submitted program.
    *   If details are correct -> Finance clicks **Accept** -> Status: **Completed**
    *   If information is missing/incorrect -> Finance clicks **Query** -> Status: **Query**

3.  **Query Resolution**
    *   **User** sees the program in "Query Management".
    *   **User** edits details (if needed) and clicks **Reply** -> Status: **Query Answered**
    *   **Finance** reviews the reply.

4.  **Final Decision**
    *   If satisfied -> Finance clicks **Accept** -> Status: **Completed**
    *   If still unsatisfied -> Finance clicks **Query** again -> Status: **Query**
    *   If the request is invalid -> Finance clicks **Reject** -> Status: **Rejected**

## Tech Stack

### Frontend
*   **React** (Vite)
*   **TypeScript**
*   **Tailwind CSS**
*   **Recharts** (Data Visualization)
*   **Lucide React** (Icons)
*   **React Router DOM** (Routing)
*   **Axios** (API Requests)

### Backend
*   **Node.js**
*   **Express.js**
*   **RESTful API** Architecture
*   **MongoDB** (Mongoose ODM)
*   **JWT** (Authentication)
*   **Multer** (File Uploads)

## Prerequisites

Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v14 or higher)
*   [MongoDB](https://www.mongodb.com/) (Local or Atlas)

## Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd budget-portal
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    npm install
    ```

3.  **Install Backend Dependencies:**
    ```bash
    cd server
    npm install
    cd ..
    ```

4.  **Environment Configuration:**
    Create a `.env` file in the `server` directory with the following variables:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```

5.  **Run the Application:**

    *   **Start the Backend Server:**
        Open a terminal and run:
        ```bash
        cd server
        npm run dev
        ```
        The server will start on `http://localhost:5000`.

    *   **Start the Frontend Development Server:**
        Open a new terminal window and run:
        ```bash
        npm run dev
        ```
        The application will be available at `http://localhost:5173` (or the port shown in the terminal).

## Project Structure

```
budget-portal/
├── dist/               # Production build output
├── public/             # Static assets
├── server/             # Backend Node.js/Express application
│   ├── config/         # Database configuration
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware (auth, upload)
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   └── uploads/        # Uploaded documents storage
├── src/                # Frontend React application
│   ├── assets/         # Images and styles
│   ├── components/     # Reusable UI components
│   │   ├── auth/       # Authentication components
│   │   ├── dashboard/  # Dashboard widgets and charts
│   │   ├── layout/     # Layout components (Sidebar, etc.)
│   │   ├── profile/    # User profile management
│   │   ├── programs/   # Program management
│   │   │   ├── finance/# Finance-specific views
│   │   │   └── user/   # User-specific views
│   │   ├── query/      # Query management
│   │   ├── status/     # Status tracking board
│   │   ├── ui/         # Generic UI components (Modals, etc.)
│   │   └── users/      # User management (Admin)
│   ├── services/       # API service functions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Entry point
├── index.html          # HTML template
├── package.json        # Frontend dependencies and scripts
└── vite.config.ts      # Vite configuration
```

## License

This project is licensed under the ISC License.
