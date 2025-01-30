'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

interface IInterpretation {
  $id: string;
  Judul: string;
  Isi: string;
}

export default function Home() {
  const [interpretations, setInterpretations] = useState<IInterpretation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterpretations = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching data..."); 
        const response = await fetch("/api/interpretations");

        console.log("Response status:", response.status); 

        if (!response.ok) {
          throw new Error(`Failed to fetch. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data fetched:", data); 

        if (Array.isArray(data.documents)) {
          setInterpretations(data.documents);
        } else {
          console.error("Data format incorrect:", data);
          setError("Invalid data format received.");
        }
      } catch (error) {
        console.error("Error fetching interpretations:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterpretations();
  }, []);

const handleDelete = async(id: string) => {
  try {
    await fetch(`/api/interpretations/${id}`, {method: "DELETE"});
    setInterpretations((prevInterpretations) => prevInterpretations.filter((i)=>i.$id !== id))

  } catch (error) {
    console.error(error);
    setError("Failed to delete. Please try again.");
  }
};

  return (
    <div className="bg-gray-100 p-4">
      {error && <p className="py-4 text-red-500">{error}</p>}
      {isLoading ? (
        <p>Loading....</p>
      ) : interpretations.length > 0 ? (
        <div>
          {interpretations.length === 0 ? (
            <p>No interpretations found.</p>
          ) : (
            interpretations.map((interpretation) => (
              <div
                key={interpretation.$id}
                className="bg-white shadow-md rounded-2xl max-w-md w-full mx-auto p-6"
              >
                <div className="mb-4">
                  <h1 className="text-lg font-bold text-gray-800 pb-2 border-b-4 border-yellow-500 inline-block">
                    {interpretation.Judul}
                  </h1>
                </div>
                <p className="text-gray-700 mb-4">{interpretation.Isi}</p>
                <div className="flex gap-4 justify-end">
                  <Link
                    className="bg-slate-500 hover:bg-blue-500 text-white px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest transition"
                    href={`/edit/${interpretation.$id}`}
                  >
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(interpretation.$id)} className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest transition">
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ):(
        <p>Memo is empty.</p>
      )}
    </div>
  );
}
