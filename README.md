# Effect HTTP Server Example

## Getting Started

- On Linux, install NIX
  sh <(curl -L https://nixos.org/nix/install) --no-daemon
  nix develop ## This will download depenedencies in flake.nix and put you in another shell (exit with exit), pnpm install etc.
  Run `echo $IN_NIX_SHELL` to see if you're in a shell (impure or pure says that you are)

Make sure to create a `.env` file in the root of the repository based on the `.env.example` file.

## How to Use This App

### Server Access
- **Base URL**: http://localhost:3000
- **API Documentation**: http://localhost:3000/docs (Interactive Swagger UI)
- **Start Development Server**: `pnpm dev`

### Quick Start Guide

1. **Start the server**: `pnpm dev`
2. **Access API docs**: Open http://localhost:3000/docs in your browser
3. **Create a user** (required for authentication):
   ```bash
   curl -X POST http://localhost:3000/accounts/users \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com"}'
   ```
4. **Extract the access token** from the response and use it in subsequent requests as a cookie

### Authentication
Most endpoints require authentication via a `token` cookie. Only user creation is public.

### API Endpoints Summary

#### Accounts API
- `POST /accounts/users` - Create user (public)
- `GET /accounts/users/me` - Get current user (authenticated)
- `GET /accounts/users/:id` - Get user by ID (authenticated)
- `PATCH /accounts/users/:id` - Update user (authenticated)

#### Groups API
- `POST /groups/` - Create group (authenticated)
- `PATCH /groups/:id` - Update group (authenticated)

#### People API
- `POST /people/groups/:groupId/people` - Create person in group (authenticated)
- `GET /people/people/:id` - Get person by ID (authenticated)

### Example Usage

#### 1. Create a User Account
```bash
curl -X POST http://localhost:3000/accounts/users \
  -H "Content-Type: application/json" \
  -d '{"email": "joe.bloggs@example.com"}'
```

#### 2. Create a Group (requires authentication)
```bash
curl -X POST http://localhost:3000/groups/ \
  -H "Content-Type: application/json" \
  -H "Cookie: token=your-access-token" \
  -d '{"name": "My Team"}'
```

#### 3. Add a Person to a Group
```bash
curl -X POST http://localhost:3000/people/groups/1/people \
  -H "Content-Type: application/json" \
  -H "Cookie: token=your-access-token" \
  -d '{"firstName": "John", "lastName": "Doe", "dateOfBirth": "1990-01-01"}'
```

#### 4. Get Current User Profile
```bash
curl -X GET http://localhost:3000/accounts/users/me \
  -H "Cookie: token=your-access-token"
```

### Database
- **Type**: SQLite
- **Location**: `/data/db.sqlite`
- **Initial State**: Empty tables (no seed data provided)
- **Population**: Use API endpoints or create custom seed scripts

### Recommended Workflow
1. Use the interactive Swagger UI at http://localhost:3000/docs for easy API testing
2. Create a user first to get an access token
3. Use the token to create groups and people
4. Explore the functional programming patterns in the Effect codebase
