import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        const {
            date,
            selectedPatient,
            selectedClinic,
            selectedNpi,
            housingScore,
            dosingScore,
            drugsScore,
            counselingScore,
            physicalScore,
            legalScore,
            relationshipsScore,
            medicationScore,
            housingNote,
            dosingNote,
            drugsNote,
            counselingNote,
            physicalNote,
            legalNote,
            relationshipsNote,
            medicationNote,
            rgNote,
        } = data;

        const conn = await mysql.createConnection(dbConfig);

        const query = `
            INSERT INTO R3Reports (
                DoR, patient_id, clinic, npi, status, housing, dosing, drugs, counseling,
                health, legal, relationship, medication, housing_note, dosing_note, drugs_note,
                counseling_note, health_note, legal_note, relationship_note, medication_note, rg_note
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            date, selectedPatient, selectedClinic, selectedNpi, "A",
            housingScore, dosingScore, drugsScore, counselingScore,
            physicalScore, legalScore, relationshipsScore, medicationScore,
            housingNote, dosingNote, drugsNote, counselingNote,
            physicalNote, legalNote, relationshipsNote, medicationNote, rgNote
        ];

        await conn.execute(query, values);
        await conn.end();

        return NextResponse.json({ success: true, message: "Data inserted successfully" });
    } catch (error) {
        console.error("Database insert failed:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
