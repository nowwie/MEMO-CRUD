import client from "@/lib/appwrite_client";
import { Databases } from "appwrite";
import { NextResponse, NextRequest } from "next/server";

const database = new Databases(client);

// Fetch a specific interpretation
async function fetchInterpretasion(id: string) {
    try {
        if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
            throw new Error("Database ID is missing in environment variables");
        }
        const interpretation = await database.getDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "interpretations",
            id
        );
        return interpretation;
    } catch (error) {
        console.error("Error fetching interpretation:", error);
        throw new Error("Failed to fetch interpretation");
    }
}

// Delete specific interpretation
async function deleteInterpretation(id: string) {
    try {
        if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
            throw new Error("Database ID is missing in environment variables");
        }
        const response = await database.deleteDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "interpretations",
            id
        );
        return response;
    } catch (error) {
        console.error("Error deleting interpretation:", error);
        throw new Error("Failed to delete interpretation");
    }
}

// Update interpretation
async function updateInterpretation(id: string, data: { Judul: string; Isi: string }) {
    try {
        if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
            throw new Error("Database ID is missing in environment variables");
        }
        const response = await database.updateDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "interpretations",
            id,
            data
        );
        return response;
    } catch (error) {
        console.error("Error updating interpretation:", error);
        throw new Error("Failed to update interpretation");
    }
}

// GET request handler
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> } 
    
) {
    try {
        const id = (await params).id;
        console.log("Params received:", params);
        if (!id) {
            return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
        }

        const interpretation = await fetchInterpretasion(id);
        return NextResponse.json({ interpretation });
    } catch (error) {
        console.error("Error in GET request:", error);
        return NextResponse.json(
            { error: "Failed to fetch interpretation" },
            { status: 500 }
        );
    }
}


// DELETE request handler
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }>}) {
    try {
        const id = (await params).id;
        if (!id) {
            return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
        }

        await deleteInterpretation(id);
        return NextResponse.json({ message: "Interpretation deleted" });
    } catch (error) {
        console.error("Error in DELETE request:", error);
        return NextResponse.json(
            { error: "Failed to delete interpretation" },
            { status: 500 }
        );
    }
}

// PUT request handler
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }

) {
    try {
        const id = (await params).id;
        if (!id) {
            return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
        }

        const interpretation = await req.json();
        await updateInterpretation(id, interpretation);
        return NextResponse.json({ message: "Interpretation updated" });
    } catch (error) {
        console.error("Error in PUT request:", error);
        return NextResponse.json(
            { error: "Failed to update interpretation" },
            { status: 500 }
        );
    }
}
