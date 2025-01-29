"use client";

import { useParams, useRouter } from "next/navigation"; 
import { ChangeEvent, useEffect, useState } from "react";

export default function EditPage() {
  const params = useParams(); 
  const id = params.id as string;  

  const [formData, setFormData] = useState({ Judul: "", Isi: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/interpretations/${id}`);
        if (!response.ok) {
          throw new Error("Failed to Fetch interpretation");
        }

        const data = await response.json();
        console.log(data);
        setFormData({ Judul: data.interpretation.Judul, Isi: data.interpretation.Isi });
      } catch (error) {
        setError("Failed to load");
      }
    };

    if (id) {
      fetchData(); 
    }
  }, [id]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async(e: React.FormEvent)=> {
    e.preventDefault();
    if(!formData.Judul || !formData.Isi){
      setError("Please fill in all the fields");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/interpretations/${params.id}`,{method: "PUT", headers:{
        "Content-type":"application/json",
      },
      body : JSON.stringify(formData),
    });
    if(!response.ok){
      throw new Error("Failed to create memo.")
    }
    router.push("/");
    } catch (error) {
      console.log(error);
      setError("Something went wrong. Please try again.");

    }finally{
      setIsLoading(false);
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Memo</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="Judul"
            placeholder="Judul"
            value={formData.Judul}
            onChange={handleInputChange}
            className="py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <textarea
            name="Isi"
            rows={5}
            placeholder="Isi"
            value={formData.Isi}
            onChange={handleInputChange}
            className="py-2 px-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-full transition duration-300"
          >
             {isLoading ? "Updatting...." : "Updating Memo"}
          </button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
