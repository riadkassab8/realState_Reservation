# Realty-Flow

Real estate management application built with React, Vite, and TypeScript.

## Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Development

Run the development server:
```bash
npm run dev --workspace=@workspace/realty-pro
```

The application will be available at `http://localhost:5173`

## Build

Build the application for production:
```bash
npm run build --workspace=@workspace/realty-pro
```

## Project Structure

This is a monorepo using npm workspaces with the following structure:

- `artifacts/realty-pro` - Main React application
- `artifacts/api-server` - Express API server
- `artifacts/mockup-sandbox` - Mockup sandbox
- `lib/` - Shared libraries
  - `api-client-react` - React API client
  - `api-spec` - API specifications
  - `api-zod` - Zod schemas
  - `db` - Database utilities

## Deployment

### Vercel

1. Connect your GitHub repository to Vercel
2. Set the root directory to `artifacts/realty-pro`
3. Set the build command to `npm run build`
4. Set the output directory to `dist/public`
5. Deploy

### GitHub

The project is ready for GitHub. Make sure to:
- Push the `.gitignore` file to exclude `node_modules` and `package-lock.json`
- Include all source files
- The repository will be cloned and dependencies installed via `npm install`

## Scripts

- `npm run build` - Build all workspaces
- `npm run typecheck` - Type check all workspaces
- `npm run typecheck:libs` - Type check libraries only

## Environment Variables

The application uses the following environment variables (with defaults):

- `PORT` - Server port (default: 5173)
- `BASE_PATH` - Base path for the application (default: "/")
- `NODE_ENV` - Environment (development/production)
