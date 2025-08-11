import { pool } from "./dbConfig";
import fs from "fs/promises";
import path from "path";

async function checkResourceExists(
	resourceType: string,
	resourceName: string
): Promise<boolean> {
	let query = "";
	const params = [resourceName];
	switch (resourceType) {
		case "table":
			query = `
                SELECT EXISTS (
                    SELECT FROM information_schema.tables
                    WHERE table_schema = 'public'
                    AND table_name = $1
                );`;
			break;
		case "trigger":
			query = `
                SELECT EXISTS (
                    SELECT FROM pg_trigger
                    WHERE tgname = $1
                );`;
			break;
		case "function":
			query = `
                SELECT EXISTS (
                    SELECT FROM pg_proc 
                    WHERE proname = $1
                );`;
			break;
		default:
			throw new Error(`Unknown resource type: ${resourceType}`);
	}
	const result = await pool.query(query, params);
	return result.rows[0].exists;
}

function splitSQLStatements(sqlContent: string): string[] {
	const statements: string[] = [];
	let currentStatement = "";
	let isInFunction = false;
	const lines = sqlContent.split("\n");

	for (const line of lines) {
		currentStatement += line + "\n";

		// Check if we're entering a function definition
		if (
			line.includes("CREATE OR REPLACE FUNCTION") ||
			line.includes("CREATE FUNCTION")
		) {
			isInFunction = true;
		}

		// If we're in a function, wait for the complete function definition
		if (isInFunction) {
			if (line.trim().endsWith("language 'plpgsql';")) {
				isInFunction = false;
				statements.push(currentStatement.trim());
				currentStatement = "";
			}
		}
		// For regular statements, split on semicolon
		else if (line.trim().endsWith(";")) {
			statements.push(currentStatement.trim());
			currentStatement = "";
		}
	}

	// Add any remaining statement
	if (currentStatement.trim()) {
		statements.push(currentStatement.trim());
	}

	return statements.filter((stmt) => stmt.length > 0);
}

async function executeSQLFile(
	filePath: string,
	resourceType: string
): Promise<void> {
	try {
		const sqlContent = await fs.readFile(filePath, "utf8");

		const statements = splitSQLStatements(sqlContent);

		for (const statement of statements) {
			if (statement.trim()) {
				// Extract resource name from CREATE statement for logging
				const resourceName = statement.match(
					/CREATE (?:OR REPLACE )?(?:TABLE|TRIGGER|FUNCTION) (?:IF NOT EXISTS )?([^\s(]+)/i
				)?.[1];

				await pool.query(statement);

				if (resourceName) {
					console.log(
						`${resourceType} '${resourceName}' created successfully`
					);
				}
			}
		}
	} catch (error) {
		console.error(`Error executing ${filePath}:`, error);
		throw error;
	}
}

async function checkAllTablesExist(tablesSQL: string): Promise<boolean> {
	const tableNames =
		tablesSQL
			.match(/CREATE TABLE (?:IF NOT EXISTS )?([^\s(]+)/gi)
			?.map((match) => match.split(/\s+/).pop()?.toLowerCase()) || [];

	for (const tableName of tableNames) {
		if (tableName && !(await checkResourceExists("table", tableName))) {
			return false;
		}
	}
	return true;
}

export async function setupDatabase(): Promise<{ skipped: boolean }> {
	console.log("\nStarting database setup...\n");
	try {
		const tablesSQL = await fs.readFile(
			path.join(process.cwd(), "src/lib/db/schemas/tables.sql"),
			"utf8"
		);

		const allTablesExist = await checkAllTablesExist(tablesSQL);

		if (!allTablesExist) {
			console.log("Creating tables...\n");
			await executeSQLFile(
				path.join(process.cwd(), "src/lib/db/schemas/tables.sql"),
				"Table"
			);

			console.log("\nCreating functions...\n");
			await executeSQLFile(
				path.join(process.cwd(), "src/lib/db/schemas/functions.sql"),
				"Function"
			);

			console.log("\nCreating triggers...\n");
			await executeSQLFile(
				path.join(process.cwd(), "src/lib/db/schemas/triggers.sql"),
				"Trigger"
			);

			console.log("\nInserting seed data...\n");
			await executeSQLFile(
				path.join(process.cwd(), "src/lib/db/schemas/seed.sql"),
				"Seed data"
			);

			console.log("Database setup completed successfully");
			return { skipped: false };
		} else {
			console.log("All tables already exist, skipping setup");
			return { skipped: true };
		}
	} catch (error) {
		console.error("Database setup failed:", error);
		throw error;
	}
}
