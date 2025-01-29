import client from "@/lib/appwrite_client";
import {Databases} from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

// fetch a spesific

async function fetchInterpretasion(id: string){
    try {
        const interpretation = await database.getDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string, "interpretations", id);
        return interpretation;
    } catch (error) {
        console.error("Error fetching interpretation", error);
        throw new Error("Failed to fetch interpretation");
    }
}

//Delete spesific
async function deleteInterpretation(id: string){
    try {
        const response = await database.deleteDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string, "interpretations", id);
        return response;
    } catch (error) {
        console.error("Error deleting interpretation", error);
        throw new Error("Failed to delete interpretation");
    }
}

//update
async function updateInterpretation(id: string, data:{Judul: string, Isi: string}){
    try {
        const response = await database.updateDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string, "interpretations", id, data);
        return response;
    } catch (error) {
        console.error("Error updating interpretation", error);
        throw new Error("Failed to update interpretation");
    }
}

export async function GET(req: Request, {params}: {params: {id: string}}){
    try {
        const id = params.id;
        const interpretation = await fetchInterpretasion(id);
        return NextResponse.json({interpretation});
    } catch (error) {
        return NextResponse.json({error: "Failed to fetch interpretation"},
            {status: 500}
        );
    }
}


export async function DELETE(req: Request, {params}: {params: {id: string}}){
    try {
        const id = params.id;
        await deleteInterpretation(id);
        return NextResponse.json({message: "Interpetaion deleted"});
    } catch (error) {
        return NextResponse.json({error: "Failed to deleted interpretation"},
            {status: 500}
        );
    }
}

export async function PUT(req: Request, {params}: {params: {id: string}}){
    try {
        const id = params.id;
        const interpretation = await req.json();
        await updateInterpretation(id, interpretation);
        return NextResponse.json({message: "Interpretation updated"});
    } catch (error) {
        return NextResponse.json({error: "Failed to updated interpretation"},
            {status: 500}
        );
    }
}