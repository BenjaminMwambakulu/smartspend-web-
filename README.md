# Expense Tracker

A comprehensive expense tracking application built with React, Vite, and Appwrite.

## Features

- Track income and expenses
- Set budgets for different categories
- Visualize spending patterns with charts
- Set financial goals
- User authentication and data persistence

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- An [Appwrite](https://appwrite.io/) account and project

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd expense_tracker
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
```

To get your Appwrite project ID:
1. Sign in to your [Appwrite Console](https://cloud.appwrite.io/console/)
2. Create a new project or select an existing one
3. Find your Project ID in the project settings

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the application for production
- `npm run preview` - Previews the production build locally
- `npm run lint` - Runs ESLint to check for code issues

## Technologies Used

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [Appwrite](https://appwrite.io/) - Backend-as-a-Service
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Chart.js](https://www.chartjs.org/) - Data visualization
- [React Router](https://reactrouter.com/) - Routing