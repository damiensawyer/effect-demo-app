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
You can paste a user token into the authorize field in the Swagger doc. 
use lazysql or similar to read the database in /data. 
I have a user with token 0197a956-3880-75bf-bb48-b355f280295d

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

## How to Authenticate / "Log In"

This app doesn't have a traditional login endpoint. Instead, **user creation IS the authentication process**. Here's the complete flow:

### Step-by-Step Authentication

#### 1. Create a User Account (This authenticates you)
```bash
curl -c cookies.txt -X POST http://localhost:3000/accounts/users \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com"}'
```

The `-c cookies.txt` flag saves cookies to a file. The server automatically sets a `token` cookie.

#### 2. Use the Saved Cookies for Subsequent Requests
```bash
curl -b cookies.txt -X GET http://localhost:3000/accounts/users/me
```

The `-b cookies.txt` flag loads cookies from the file.

#### 3. Alternative: Manual Token Extraction
If you prefer to handle tokens manually, extract the `accessToken` from the user creation response:

```bash
# Create user and save response
response=$(curl -s -X POST http://localhost:3000/accounts/users \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}')

# Extract token (requires jq)
token=$(echo $response | jq -r '.accessToken')

# Use token in subsequent requests
curl -X GET http://localhost:3000/accounts/users/me \
  -H "Cookie: token=$token"
```

### Using Swagger UI for Authentication

1. Open http://localhost:3000/docs
2. Use the `POST /accounts/users` endpoint to create a user
3. The browser will automatically handle the authentication cookie
4. You can now use other authenticated endpoints in the Swagger UI

### Important Notes

- **No separate login**: User creation automatically authenticates you
- **Cookie-based auth**: The server sets a `token` cookie automatically  
- **Authorization**: You can only access your own user data and resources you create
- **Session persistence**: Cookies remain valid until manually cleared

### Troubleshooting Authentication

If you're getting "Unauthorized" errors:

1. **Make sure you created a user first** - this is required for authentication
2. **Check cookie handling** - ensure your client sends the `token` cookie
3. **Use the browser/Swagger UI** - it handles cookies automatically
4. **For curl**: Use `-c` to save cookies and `-b` to send them

### Example Complete Workflow
```bash
# 1. Create user (saves auth cookie)
curl -c auth-cookies.txt -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@example.com"}'

# 2. Get your profile (uses saved cookie)
curl -b auth-cookies.txt -X GET http://localhost:3000/users/me

# 3. Create a group (uses saved cookie)
curl -b auth-cookies.txt -X POST http://localhost:3000/groups/ \
  -H "Content-Type: application/json" \
  -d '{"name": "My Demo Group"}'

# 4. Add person to group (uses saved cookie)
curl -b auth-cookies.txt -X POST http://localhost:3000/people/groups/1/people \
  -H "Content-Type: application/json" \
  -d '{"firstName": "John", "lastName": "Doe", "dateOfBirth": "1990-01-01"}'
```


## SQL Lite db
[SQLLite TUI](https://github.com/jorgerojas26/lazysql)
