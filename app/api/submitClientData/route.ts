import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { RowDataPacket } from "mysql2/promise";

const BASE_URL = "http://50.192.114.102:8080/";
const DATABASE_INTERFACE_BEARER_TOKEN = "password";

export async function POST(request: Request) {
  const body = await request.json();
  const { clientNumber } = body;

  if (!clientNumber) {
    return NextResponse.json({ error: "Client number is required" }, { status: 400 });
  }

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



    // Query the R3d table
    const [rowsR3] = await connection.execute<RowDataPacket[]>(
      "SELECT * FROM R3d WHERE Client = ? ORDER BY Date_Created DESC LIMIT 1",
      [clientNumber]
    );
    
    // Query the Renew table
    const [rowsRenew] = await connection.execute<RowDataPacket[]>(
      "SELECT * FROM Renew WHERE Client = ? ORDER BY Date_Created DESC LIMIT 1",
      [clientNumber]
    );
    
    // Extract the first result or fallback to an empty object
    const r3d = rowsR3[0] || {};
    const renew = rowsRenew[0] || {};
    const combinedClientData = { ...r3d, ...renew };
    

    // Send data to external endpoint
    const externalResponse = await fetch(`${BASE_URL}gen`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DATABASE_INTERFACE_BEARER_TOKEN}`,
      },
      body: JSON.stringify({
        queries: [
          {
            query: JSON.stringify(combinedClientData),
            top_k: 3,
            filter: {
              author: JSON.stringify(["OpioidUseDisorder", "MedicationsForOpioidUseDisorder"]),
            },
          },
        ],
      }),
    });

    if (!externalResponse.ok) {
      const errorText = await externalResponse.text();
      return NextResponse.json({ error: `External API error: ${errorText}` }, { status: externalResponse.status });
    }

    const externalData = await externalResponse.json();
    return NextResponse.json({ success: true, data: externalData }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

export async function GET() {
   
  

      return NextResponse.json({true: "true"}, { status: 200 });
  
}
  