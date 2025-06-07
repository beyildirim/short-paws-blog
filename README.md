# short-paws-blog

90s style paw oriented blogging platform built with Vite and React.

## Installation

```bash
npm install
```

## Running the Development Server

Start the dev server at `http://localhost:5173`:

```bash
npm run dev
```

## Linting

Check code quality with ESLint:

```bash
npm run lint
```

## Building

Create an optimized production build in `dist/`:

```bash
npm run build
```

## Previewing the Build

Serve the built project locally to verify the output:

```bash
npm run preview
```

## Admin Login

Navigate to `/admin/login` and sign in with the username `admin` and the password from the settings store (default `gizmelikedi123`). After logging in you can manage blog posts and site settings.

## Basic Configuration

Default theme and content settings are defined in `src/store/settingsStore.ts`. These values are persisted locally and can be updated through the admin dashboard or by editing the file directly.

