# Frontend Absensi - Employee Attendance System

A modern web application for employee attendance management built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **User Authentication**: Secure login system for employees and administrators
- **Role-Based Access Control**: Different interfaces for employees and administrators
- **Employee Dashboard**: Clock-in/out functionality, attendance history, and status tracking
- **Admin Dashboard**: Department management, employee management, and attendance reports
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: Custom components with [Shaden UI]((https://ui.shadcn.com/))


## Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Backend API running (see backend-absensi project)

## Getting Started

### Installation

1. Clone the repository

```bash
git clone https://github.com/rustam76/frontend-absensi.git
cd frontend-absensi
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:3030/api
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Build for Production

```bash
npm run build
# or
yarn build
```

### Start Production Server

```bash
npm run start
# or
yarn start
```

## Project Structure

```
├── app/                # Next.js App Router
│   ├── admin/          # Admin dashboard pages
│   ├── auth/           # Authentication pages
│   ├── context/        # React Context providers
│   ├── employee/       # Employee dashboard pages
│   ├── layout.tsx      # Root layout component
│   └── page.tsx        # Home page component
├── components/         # Reusable UI components
│   ├── ui/             # Base UI components
│   └── DataTable.tsx   # Data table component
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
│   ├── api.ts          # API client
│   ├── auth.ts         # Authentication utilities
│   └── utils.ts        # Helper functions
├── public/             # Static assets
├── types/              # TypeScript type definitions
└── middleware.ts       # Next.js middleware for auth
```

## Authentication Flow

1. User enters their employee ID on the login page
2. The system authenticates the user against the backend API
3. Upon successful authentication, a JWT token is stored in localStorage and cookies
4. The user is redirected to the appropriate dashboard based on their role
5. Protected routes are secured using Next.js middleware

## User Roles

### Employee
- View personal attendance history
- Clock in and out for the day
- View attendance status (on time, late, etc.)

### Admin
- Manage departments (create, update, delete)
- Manage employees (create, update, delete)
- View attendance reports for all employees

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
