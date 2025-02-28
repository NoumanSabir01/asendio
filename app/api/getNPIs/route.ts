import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { User } from "@/types";



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
    const [rows]: [any[], any] = await connection.execute("SELECT u.*, t.name AS usertype_name FROM Users u JOIN Usertypes t ON u.usertype_id = t.id WHERE t.name IN ('Counselor', 'Sysadmin')");

    return NextResponse.json(rows as User[], { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch NPIs: " + JSON.stringify(dbConfig, null, 2) }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
