# Budget System Government Portal - Walkthrough

I have created the Budget System Government Portal as requested. The project is built with React, TypeScript, Vite, and Tailwind CSS.

## Features Implemented

- **Responsive Layout**: Sidebar navigation and main content area.
  - **Collapsible Sidebar**: Toggle button to collapse sidebar to icon-only mode. Dark themed (`#474444`) for contrast.
- **Dashboard Overview**:
  - **Stat Cards**: Displaying Total Budget, Allocated, Active Programs, and Pending Approvals.
  - **Charts**: Budget Allocation (Donut Chart) and Monthly Spending Trend (Line Chart) using `recharts`.
  - **Recent Activity**: A list of recent system activities.
- **Profile Page**:
  - **Modular Design**: Separated into `ProfileHeader`, `ProfileTabs`, `ProfilePhoto`, and `BasicInfo` components.
  - **Navigation**: Accessible via the Sidebar "Profile" link.
  - **UI**: Matches the requested design with tabs, photo upload section, and form fields. Now spans the full width of the screen.
- **User Management**:
  - **Stats Overview**: Cards showing Total Users, Admins, Active/Inactive counts.
  - **Filtering**: Search bar and Role filter.
  - **User Table**: Detailed list of users with status badges and action buttons.
- **Modal System**:
  - A reusable `Modal` component in `src/components/ui/Modal.tsx`.
  - A specific `NewProgramModal` in `src/components/dashboard/NewProgramModal.tsx`.
  - The modal is triggered by the "New Program" button in the dashboard header.

## Project Structure

```
src/
├── components/
│   ├── dashboard/       # Dashboard specific components
│   │   ├── ActivityList.tsx
│   │   ├── BudgetChart.tsx
│   │   ├── Dashboard.tsx
│   │   ├── NewProgramModal.tsx
│   │   ├── SpendingTrendChart.tsx
│   │   └── StatCard.tsx
│   ├── layout/          # Layout components
│   │   ├── Layout.tsx
│   │   └── Sidebar.tsx
│   └── ui/              # Generic UI components
│       └── Modal.tsx
├── App.tsx              # Main application component
├── index.css            # Global styles and Tailwind configuration
└── main.tsx             # Entry point
```

## How to Run

1.  Navigate to the project directory:
    ```bash
    cd budget-portal
    ```
2.  Install dependencies (if not already done):
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open your browser at the URL shown (usually `http://localhost:5173`).

## Notes

- **Tailwind CSS v4**: The project uses the latest Tailwind CSS v4. Configuration is handled in `src/index.css` using the `@theme` directive.
- **Mock Data**: The dashboard uses static mock data as requested.
- **Clean Code**: Components are separated for reusability and maintainability.
