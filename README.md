# React Login

This project is a backend application built with TypeScript and Express. It provides authentication and basic administrative functionalities, along with a health check endpoint and serves a React frontend using [Ant Design](https://ant.design/).

It may be useful to deploy the application on a hosting platform such as [Fly.io](https://fly.io).

## Folder Structure

```
backend
├── src
│   ├── server.ts          # Entry point of the application
│   ├── models             # Database table creation
│   ├── routes             # API endpoints
│   ├── types              # Type definitions
|   ├── constants.ts       # Non-sensitive constant configurations
|   └── db.ts              # Database connector utility
├── .env                   # Environment variables for local development
├── package.json           # NPM configuration
└── tsconfig.json          # TypeScript configuration
frontend
├── public                 # Static files for React build
├── src
│   ├── api                # Utility for calling API endpoints
│   ├── assets             # Static frontend assets
│   ├── components         # App files including pages and widgets
│   ├── config             # Constant configurations
│   ├── routes             # React router
│   ├── App.test.tsx       # Automated testing
│   ├── ...
├── package.json           # NPM configuration
└── tsconfig.json          # TypeScript configuration
README.md                  # Project documentation
```

## Setup Instructions

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```
   ```bash
   cd frontend
   npm install
   ```

2. **Run the application:**
   ```bash
   cd frontend
   npm run build
   cd ..
   xcopy ./frontend/build ./backend/public
   cd backend
   npm run build
   node ./dist/server.js
   ```

3. **Visit website**

   http://localhost:8080/

## Usage

- The server runs on the specified port (default is 8080).
- Access the health check endpoint at `/health`.
- The API routes for authentication are available at `/api/auth`.
- The admin routes can be accessed at `/api/admin`.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.