# Pulse Sidebar Components

This document describes the Admin and User sidebar components built for the Pulse application.

## Components Overview

### 1. AdminSidebar (`/src/components/core/admin-sidebar/index.tsx`)
A comprehensive sidebar for admin users with the following navigation structure:

- **Dashboard** - Admin overview
- **Applications** - Manage applications
- **Batches** - Batch management with sub-items:
  - Create Batch
  - Instructors
- **Tests** - Test management with sub-items:
  - Create Test
  - Assign to Batch
  - Test Results
- **Users** - User management
- **Analytics** - Analytics dashboard
- **Settings** - System settings with sub-items:
  - Privacy Policy
  - Roles & Permissions
  - Notifications
- **Account** - Account management with sub-items:
  - My Profile
  - Change Password
  - Logout

### 2. UserSidebar (`/src/components/core/user-sidebar/index.tsx`)
A user-focused sidebar with the following navigation structure:

- **Dashboard** - User overview
- **My Tests** - Test management with sub-items:
  - Active Tests
  - Completed Tests
- **My Batch** - Batch information
- **My Profile** - Profile management
- **Notifications** - User notifications
- **Privacy & Terms** - Privacy policy
- **Account** - Account settings with sub-items:
  - Settings
  - Logout

## Usage

### Basic Usage

The sidebar components are integrated into the `AppSidebar` component and can be used by specifying the `userType` prop:

```tsx
// For Admin Dashboard
<DashboardLayout userType="admin">
  <YourAdminContent />
</DashboardLayout>

// For User Dashboard
<DashboardLayout userType="user">
  <YourUserContent />
</DashboardLayout>
```

### AppSidebar Props

```tsx
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userType?: "admin" | "user"; // Defaults to "admin"
}
```

### DashboardLayout Props

```tsx
export type DashboardLayoutProps = {
  children: React.ReactNode;
  userType?: "admin" | "user"; // Defaults to "admin"
};
```

## Features

### ✅ Implemented Features

- **Responsive Design**: Sidebar collapses into a drawer on mobile devices
- **Active Link Highlighting**: Current page is highlighted with background color
- **Collapsible Menus**: Parent items with children can be expanded/collapsed
- **Icon Integration**: All navigation items use Lucide React icons
- **TypeScript Support**: Fully typed with proper interfaces
- **Dark Mode Support**: Uses Tailwind's dark mode classes
- **Accessibility**: Proper ARIA attributes and keyboard navigation

### 🎨 Styling

- Uses Tailwind CSS for styling
- Integrates with Shadcn UI components
- Consistent color scheme:
  - Active items: `bg-[#f66c84] text-white`
  - Hover states: `hover:bg-[#2563eb] hover:text-white`
  - Sub-items: Gray backgrounds with proper contrast

### 📱 Responsive Behavior

- Desktop: Full sidebar with collapsible sections
- Mobile: Drawer-style sidebar triggered by hamburger menu
- Smooth transitions and animations

## File Structure

```
src/
├── components/
│   └── core/
│       ├── admin-sidebar/
│       │   └── index.tsx
│       └── user-sidebar/
│           └── index.tsx
├── layouts/
│   └── dashboard/
│       ├── app-sidebar.tsx (updated)
│       └── layout.tsx (updated)
└── app/
    ├── admin/
    │   └── dashboard/
    │       └── page.tsx (example)
    └── user/
        └── dashboard/
            └── page.tsx (example)
```

## Dependencies

- React 18+
- Next.js 14+
- TypeScript
- Tailwind CSS
- Shadcn UI components
- Lucide React (for icons)

## Example Pages

Two example pages are provided to demonstrate usage:

1. **Admin Dashboard** (`/src/app/admin/dashboard/page.tsx`)
2. **User Dashboard** (`/src/app/user/dashboard/page.tsx`)

These pages show how to integrate the sidebar components with the dashboard layout.

## Customization

To customize the sidebar:

1. **Add new navigation items**: Modify the `adminNavItems` or `userNavItems` arrays
2. **Change icons**: Update the `icon` property with different Lucide React icons
3. **Modify styling**: Update the Tailwind classes in the component files
4. **Add new routes**: Update the `url` properties to match your routing structure

## Notes

- All navigation items use Next.js `Link` components for client-side routing
- The sidebar maintains the existing Pulse branding and logo
- Collapsible sections remember their state during the session
- The components are fully compatible with the existing dashboard layout structure
