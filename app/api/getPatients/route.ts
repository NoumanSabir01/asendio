import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  // Database configuration
  const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };
  let connection;

  try {
    // Connect to the database
    connection = await mysql.createConnection(dbConfig);
    // Query the database for all client IDs
    const [rows]: [any[], any] = await connection.execute("SELECT DISTINCT Client FROM R3d ORDER BY Client ASC");

    // Extract only the client IDs
    const clientIds = rows.map((row: { Client: string }) => row.Client);

    return NextResponse.json(clientIds, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch client IDs: " + JSON.stringify(dbConfig, null, 2) }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
