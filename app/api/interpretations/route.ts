import client from "@/lib/appwrite_client";
import {Databases, ID, Query} from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);


//create interpretation
async function createInterpretation(data: {Judul: string, Isi: string}){
    try{
        const response = await database.createDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string, "interpretations", ID.unique(), data);
        return response;
    } catch (error){
        console.error("Error creating interpretaion", error);
        throw new Error("Failed to create interpretation");
    }
}


//fetch
async function fetchInterpretations(){
    try{
        const response = await database.listDocuments(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string, "interpretations",
             [Query.orderDesc("$createdAt")]);
        return response;
    } catch (error){
        console.error("Error creating interpretaion", error);
        throw new Error("Failed to fetch interpretation");
    }
}

export async function POST(req: Request){
   try {
    const {Judul, Isi} = await req.json();
    const data = {Judul, Isi};
    await createInterpretation(data);
    return NextResponse.json({message: "Interpretation created"});
   } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json(
        {
            error: "Failed to create interpretations",
        },
        {status: 500}
    );
   }
}

export async function GET(){
    try {
        const interpretations = await fetchInterpretations();
        return NextResponse.json(interpretations);

    } catch (error) {
        console.error("Error in GET:", error);
        return NextResponse.json({error : "Failed to fetch Interpretations"},
        {status: 500});
    }
}