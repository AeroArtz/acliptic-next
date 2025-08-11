# Database Setup Instructions

## Prerequisites

1. PostgreSQL installed locally
2. Next.js development server running

## Initial Setup

1. First, create your database in PostgreSQL:

```sql
CREATE DATABASE sideeffect_db;
```

2. Store the database URL in the .env file

```
DATABASE_URL="postgresql://user:password@localhost:5432/your_database_name"
```

3. Install dependencies:

```
npm install
```

4. Start your Next.js development server:

```
npm run dev
```

5. Trigger database setup by making a POST request to the setup endpoint:

```
curl -X POST http://localhost:3000/api/setup-db
```

Or use Postman/similar tools to make a POST request to `http://localhost:3000/api/setup-db`

The setup will:

-   Create all necessary tables
-   Set up triggers
-   Insert seed data
-   Return a success/error response

## Project Structure

```
src/
├── lib/
│   └── db/
│       ├── db.ts             # Database connection configuration
│       ├── setup.ts          # Setup script logic
│       └── schemas/
│           ├── tables.sql    # Table definitions
│           ├── triggers.sql  # Trigger definitions
│           └── seed.sql      # Seed data
└── app/
    └── api/
        └── setup-db/
            └── route.ts      # Setup API route
```

## Using in Routes

Import the pool in your API routes:

```typescript
import { pool } from "@/lib/db/db";

export async function GET() {
	const result = await pool.query("SELECT * FROM your_table");
	return Response.json(result.rows);
}
```

## Response Format

Successful setup:

```json
{
	"message": "Database setup completed successfully"
}
```

Error response:

```json
{
	"error": "Database setup failed"
}
```
