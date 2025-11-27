# User Management Page Implementation Plan

## Goal
Implement the "User Management" page to match the provided design, including stats cards, search/filter bar, and a detailed user table.

## Proposed Changes

### New Components (`src/components/users/`)

1.  **`UserStats.tsx`**
    *   Display 5 cards: Total Users, Admins, Active Users, Inactive Users, Locked Accounts.
    *   Use icons from `lucide-react`.
    *   Match the color coding from the design (blue, green, red).

2.  **`UserFilters.tsx`**
    *   Search input field.
    *   Role dropdown filter.
    *   Refresh and Force Refresh buttons.

3.  **`UserTable.tsx`**
    *   Table displaying user data: Name, Email, Phone, Role, Status, Security Status, Created, Last Login, Actions.
    *   Mock data matching the image.
    *   Status badges (Active/Inactive).
    *   Security status indicators (Green check for "No security issues").
    *   Action buttons: Edit, Delete, Toggle Active.

4.  **`UserManagement.tsx`**
    *   Main container component.
    *   Assembles Header, Stats, Filters, and Table.
    *   "Add User" button in the header.

### App Integration

*   Update `App.tsx` to render `UserManagement` when `activePage` is 'users'.

## Verification Plan

### Manual Verification
1.  Run `npm run dev`.
2.  Navigate to "User Management" via the sidebar.
3.  Verify the layout matches the design image.
4.  Check if all 5 stat cards are present with correct icons and colors.
5.  Check if the search bar and buttons are rendered.
6.  Check if the table displays the mock data correctly.
7.  Verify the "Add User" button is present.
8.  Run `npm run build` to ensure no build errors.
